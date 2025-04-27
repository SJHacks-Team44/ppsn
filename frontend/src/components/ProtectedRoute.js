import React from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from '../Firebase';

function ProtectedRoute({ children }) {
  if (!auth.currentUser) {
    return <Navigate to="/signin" replace />;
  }
  return children;
}

export default ProtectedRoute;
