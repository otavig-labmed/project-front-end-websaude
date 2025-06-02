import React from 'react';
import { Outlet } from "react-router-dom";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import LoadingSpinner from "./components/load/LoadingSpinner";
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx';
import './styles/global.css'

const LoginPage = lazy(() => import("./pages/LoginPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage.jsx"));

function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}

const DashboardLayout = () => {
  const { userRole, permissions } = useAuth();

  if (!userRole || !permissions) {
    return <p>Carregando...</p>;
  }

  return <Outlet context={{ userRole, permissions }} />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<DashboardPage />} />
        </Route>
        <Route path='*' element={< NotFoundPage />}/>
      </Routes>
    </BrowserRouter>
  );
}


export default App;
