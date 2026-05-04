import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdminAuthStore } from './useAdminAuthStore';

export default function RequireAdmin({ children }) {
  const location = useLocation();
  const isAuthenticated = useAdminAuthStore((state) => state.isAuthenticated);
  const user = useAdminAuthStore((state) => state.user);

  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
