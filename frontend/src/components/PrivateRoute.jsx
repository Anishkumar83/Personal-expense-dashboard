import { Navigate } from 'react-router-dom';
import useAuth from '../auth/useAuth'; // ✅ use default import from useAuth.js

const PrivateRoute = ({ children }) => {
  const { accessToken } = useAuth(); // ✅ correct usage based on your context

  return accessToken ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
