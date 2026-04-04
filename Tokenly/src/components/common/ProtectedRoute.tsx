import React from 'react';
import { Navigate } from 'react-router-dom';
import Loader from './Loader';
import type { ProtectedRouteProps } from '../../types/common';

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole
}) => {
  const loading = false;
  const isAuthenticated = true;
  const user = { role: 'user' as const };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

