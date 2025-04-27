import React from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from '../firebase';

function ProtectedRoute({ children }) {
  if (!auth.currentUser) {
    return <Navigate to="/signin" replace />;
  }
  return children;
}

export default ProtectedRoute;
