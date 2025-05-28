import React from 'react';
import { Navigate } from 'react-router-dom';

const RedirectAcessScreen: React.FC = () => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/access" replace />;
  } 
    return <Navigate to="/dashboard" replace />;
};

export default RedirectAcessScreen;