import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Spinner from '../ui/Spinner';
import AdminSidebar from './AdminSidebar';

export default function AdminRoute() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex min-h-screen bg-ivory">
      <AdminSidebar />
      <div className="flex-1 lg:pl-64 flex flex-col">
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
