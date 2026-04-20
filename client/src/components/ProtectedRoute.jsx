import React from 'react';
import { Navigate } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  // const { currentUser, loading } = useAuth();
  const currentUser = true; // Placeholder
  const loading = false; // Placeholder

  if (loading) return <div>Loading...</div>;

  return currentUser ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
