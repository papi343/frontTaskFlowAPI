import { Navigate, Outlet } from 'react-router-dom';
import { UseAuth } from '../Hooks/UseAuth';

function ProtectedRoutes() {
  const { isAuthenticated, isLoading } = UseAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8f8f7] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

export default ProtectedRoutes;