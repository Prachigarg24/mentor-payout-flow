
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Skeleton } from './ui/skeleton';

interface ProtectedRouteProps {
  children: React.ReactNode;
  role?: 'admin' | 'mentor';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, role }) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    } else if (!isLoading && isAuthenticated && role && user?.role !== role) {
      navigate(user?.role === 'admin' ? '/admin' : '/mentor');
    }
  }, [isAuthenticated, isLoading, navigate, role, user?.role]);

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 flex flex-col gap-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (role && user?.role !== role) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
