import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store/store';
import { checkAuth } from '../store/authSlice';

interface ProtectedRouteProps {
  children: React.ReactElement;
  requireAuth?: boolean;
  requiredRole?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAuth = true,
  requiredRole 
}) => {
  const dispatch = useDispatch();
  const { isAuthenticated, admin, token } = useSelector((state: RootState) => state.auth);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    dispatch(checkAuth());
    setIsInitialized(true);
  }, [dispatch]);

  // Wait for initial auth check to complete
  if (!isInitialized) {
    return null;
  }

  // If authentication is required but user is not authenticated or no token exists
  if (requireAuth && (!isAuthenticated || !token)) {
    return <Navigate to="/login" replace />;
  }

  // If user is authenticated but shouldn't access login page
  if (!requireAuth && isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  // Check role-based access
  if (requiredRole && admin && !requiredRole.includes(admin.role)) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default ProtectedRoute;
