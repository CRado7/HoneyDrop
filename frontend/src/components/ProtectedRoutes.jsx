import { useCurrentUser } from '../hooks/useAuth';
import { Navigate, Outlet } from 'react-router-dom';
import SkeletonLoader from './SkeletonLoader';

const ProtectedRoutes = () => {
  const { user, loading } = useCurrentUser();

  if (loading) return <SkeletonLoader />;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoutes;
