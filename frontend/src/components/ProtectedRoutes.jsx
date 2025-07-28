import { useAuth } from '../context/authContext';
import { Navigate } from 'react-router-dom';
import SkeletonLoader from './SkeletonLoader';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Show loading fallback (spinner, etc.) while auth is loading
  if (loading) return <SkeletonLoader />;

  // If no user, redirect to login
  if (!user) return <Navigate to="/login" replace />;

  return children;
};

export default ProtectedRoute;
