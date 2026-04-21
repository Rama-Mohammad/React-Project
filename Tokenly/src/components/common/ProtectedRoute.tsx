import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import Loader from './Loader';
import type { ProtectedRouteProps } from '../../types/common';
import useAuth from '../../hooks/useAuth';

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole
}) => {
  const location = useLocation();
  const { loading, isAuthenticated } = useAuth();
  const user = { role: 'user' as const };

  if (loading) {
    return <Loader fullScreen label="Loading Tokenly..." />;
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/auth?mode=signin"
        replace
        state={{ from: `${location.pathname}${location.search}${location.hash}` }}
      />
    );
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

