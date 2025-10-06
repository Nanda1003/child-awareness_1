import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { currentUser } = useAuth();

  // 1. Check if the user exists in the context
  if (!currentUser) {
    // If not logged in, redirect them to the login page
    return <Navigate to="/login" replace />;
  }

  // 2. Check if the user has the required role
  const hasRequiredRole = allowedRoles ? allowedRoles.includes(currentUser.role) : true;

  if (!hasRequiredRole) {
    // If user is logged in but doesn't have the right role, redirect them
    // to their own dashboard.
    if (currentUser.role === 'Counselor') {
        return <Navigate to="/counselor-dashboard" replace />;
    } else {
        return <Navigate to="/dashboard" replace />;
    }
  }

  // 3. If all checks pass, render the component for that route
  return <Outlet />;
};

export default ProtectedRoute;