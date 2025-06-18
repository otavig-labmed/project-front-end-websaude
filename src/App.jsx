import React, { useEffect, Suspense, lazy, memo } from 'react';
import { Outlet, BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoadingSpinner from "./components/load/LoadingSpinner";
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx';
import ErrorBoundary from './components/ErrorBoundary';
import './styles/global.css'

const LoginPage = lazy(() => import("./pages/LoginPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage.jsx"));

const preloadCriticalPages = () => {
  import("./pages/LoginPage");
  
  setTimeout(() => {
    import("./pages/DashboardPage.jsx");
  }, 1000);
};

const ProtectedRoute = memo(({ children }) => {
  const { isAuthenticated, isLoading } = useAuth(); 

  if (isLoading) {
    return <LoadingSpinner />; 
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />; 
  }

  return children;
});

ProtectedRoute.displayName = 'ProtectedRoute';

const DashboardLayout = memo(() => {
  const { permissions } = useAuth();

  if (!permissions) {
    return <LoadingSpinner />;
  }

  return <Outlet context={{ permissions }} />;
});

DashboardLayout.displayName = 'DashboardLayout';

const PageSuspense = ({ children, fallback = <LoadingSpinner /> }) => (
  <Suspense fallback={fallback}>
    {children}
  </Suspense>
);

const App = memo(() => {
  useEffect(() => {
    preloadCriticalPages();
    
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
      setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
          loadingScreen.remove();
        }, 300);
      }, 500);
    }
    
    document.body.classList.add('app-loaded');
  }, []);

  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={
              <PageSuspense>
                <LoginPage />
              </PageSuspense>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute> 
            }>
              <Route index element={
                <PageSuspense>
                  <DashboardPage />
                </PageSuspense>
              } />
            </Route>
            <Route path='*' element={
              <PageSuspense>
                <NotFoundPage />
              </PageSuspense>
            }/>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
});

App.displayName = 'App';

export default App;
