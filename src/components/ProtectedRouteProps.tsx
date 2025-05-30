import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Adjust path as needed

interface ProtectedRouteProps {
  children?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, userRole, permissions, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading authentication...</div>; 
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the children or Outlet, passing userRole and permissions as context
  // This is crucial for passing data to nested routes
  return children ? <>{children}</> : <Outlet context={{ userRole, permissions }} />;
};

export default ProtectedRoute;