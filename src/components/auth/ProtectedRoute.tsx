import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles = [],
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  // Debug logging
  console.log('ProtectedRoute Debug:', {
    isAuthenticated,
    user,
    userRole: user?.role,
    allowedRoles,
    isLoading,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('User not authenticated, redirecting to login');
    return <Navigate to="/auth/login" replace />;
  }

  // Check if user has required role
  if (allowedRoles.length > 0 && user) {
    const hasRequiredRole = allowedRoles.includes(user.role);
    console.log('Role check:', {
      userRole: user.role,
      allowedRoles,
      hasRequiredRole,
    });

    if (!hasRequiredRole) {
      console.log(
        'User does not have required role, redirecting to unauthorized page'
      );
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Akses Ditolak
            </h1>
            <p className="text-gray-600 mb-4">
              Anda tidak memiliki izin untuk mengakses halaman ini.
            </p>
            <p className="text-sm text-gray-500">
              Role Anda: {user.role} | Role yang diperlukan:{' '}
              {allowedRoles.join(', ')}
            </p>
            <button
              onClick={() => window.history.back()}
              className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
            >
              Kembali
            </button>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
