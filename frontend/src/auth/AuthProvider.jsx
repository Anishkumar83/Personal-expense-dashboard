// src/auth/AuthProvider.jsx
import { useState, useEffect } from 'react';
import AuthContext from './AuthContext';

const AuthProvider = ({ children }) => {
  const [authTokens, setAuthTokens] = useState({
    accessToken: localStorage.getItem('accessToken'),
    refreshToken: localStorage.getItem('refreshToken'),
  });

  const login = ({ accessToken, refreshToken }) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    setAuthTokens({ accessToken, refreshToken });
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setAuthTokens({ accessToken: null, refreshToken: null });
  };

  const isAuthenticated = !!authTokens.accessToken;

  useEffect(() => {
    const syncTokens = () => {
      setAuthTokens({
        accessToken: localStorage.getItem('accessToken'),
        refreshToken: localStorage.getItem('refreshToken'),
      });
    };
    window.addEventListener('storage', syncTokens);
    return () => window.removeEventListener('storage', syncTokens);
  }, []);

  return (
    <AuthContext.Provider value={{ ...authTokens, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
