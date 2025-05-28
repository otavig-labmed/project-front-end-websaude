import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react'; // <--- FIX IS HERE

// Define the shape of your authentication context data
interface AuthContextType {
  isAuthenticated: boolean;
  userRole: 'doctor' | 'admin' | 'attendant' | 'patient' | null;
  permissions: { [key: string]: number }; // Example: { 'agenda_visualizar': 1, 'is_master': 0 }
  login: (role: AuthContextType['userRole'], perms: AuthContextType['permissions'], token: string) => void;
  logout: () => void;
  isLoading: boolean; // To indicate if auth data is still being loaded
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<AuthContextType['userRole']>(null);
  const [permissions, setPermissions] = useState<{ [key: string]: number }>({});
  const [isLoading, setIsLoading] = useState<boolean>(true); // Start as loading

  // Effect to load authentication data from localStorage on initial render
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedRole = localStorage.getItem('userRole') as AuthContextType['userRole'];
    const storedPermissions = JSON.parse(localStorage.getItem('permissions') || '{}');

    if (storedToken && storedRole && Object.keys(storedPermissions).length > 0) {
      setIsAuthenticated(true);
      setUserRole(storedRole);
      setPermissions(storedPermissions);
    }
    setIsLoading(false); // Finished loading
  }, []);

  // Function to handle user login
  const login = (role: AuthContextType['userRole'], perms: AuthContextType['permissions'], token: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userRole', role || ''); // Store role
    localStorage.setItem('permissions', JSON.stringify(perms)); // Store permissions
    setIsAuthenticated(true);
    setUserRole(role);
    setPermissions(perms);
  };

  // Function to handle user logout
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

// Custom hook to consume the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};