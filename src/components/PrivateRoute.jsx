import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

const PrivateRoute = () => {
  const token = useAuthStore((state) => state.token);

  // თუ ტოკენი არსებობს, ვუშვებთ შიდა გვერდებზე, თუ არა - გადაგვყავს /login-ზე
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
