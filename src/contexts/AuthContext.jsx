import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(() => localStorage.getItem('userRole') || 'doctor');
  const [permissions, setPermissions] = useState(() => {
    try {
      const raw = localStorage.getItem('permissions');
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedRole = localStorage.getItem('userRole');
    const storedPermissions = JSON.parse(localStorage.getItem('permissions') || '{}');

    if (storedToken && storedRole && Object.keys(storedPermissions).length > 0) {
      setIsAuthenticated(true);
      setUserRole(storedRole);
      setPermissions(storedPermissions);
    }
    setIsLoading(false);
  }, []);

  const login = (role, perms, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userRole', role || '');
    localStorage.setItem('permissions', JSON.stringify(perms));
    setIsAuthenticated(true);
    setUserRole(role);
    setPermissions(perms);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('permissions');
    setIsAuthenticated(false);
    setUserRole(null);
    setPermissions({});
  };
 
  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, permissions, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook customizado para consumir o contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
