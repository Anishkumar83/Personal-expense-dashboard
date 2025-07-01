import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  withCredentials: false
});

let isRefreshing = false;
let refreshSubscribers = [];

const subscribeTokenRefresh = cb => refreshSubscribers.push(cb);
const onRefreshed = token => {
  refreshSubscribers.forEach(cb => cb(token));
  refreshSubscribers = [];
};

api.interceptors.request.use(config => {
  const token = localStorage.getItem('accessToken');
  // console.log('📦 Attaching token:', token); // 👈 Debug log
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  res => res,
  async error => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      localStorage.getItem('refreshToken')
    ) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const response = await axios.post('http://localhost:8080/api/auth/refresh-token', {
            refreshToken: localStorage.getItem('refreshToken'),
          });

          const newAccessToken = response.data.accessToken;
          localStorage.setItem('accessToken', newAccessToken);

          api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
          onRefreshed(newAccessToken);
        } catch (err) {
          localStorage.clear();
          window.location.href = '/login';
          return Promise.reject(err);
        } finally {
          isRefreshing = false;
        }
      }

      return new Promise(resolve => {
        subscribeTokenRefresh(token => {
          originalRequest.headers.Authorization = 'Bearer ' + token;
          resolve(api(originalRequest));
        });
      });
    }

    return Promise.reject(error);
  }
);

export default api;
