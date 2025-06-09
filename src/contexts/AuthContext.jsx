import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [permissions, setPermissions] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const clearAuthStates = useCallback(() => {
    setIsAuthenticated(false);
    setUserRole(null);
    setPermissions(null);
    localStorage.removeItem('hasLoggedInOnce');
  }, []);

  const fetchUserPermissions = useCallback(async () => {
    try {
      const response = await axios.get(
        'http://127.0.0.1:8000/user/permissions/',
        { withCredentials: true }
      );
      if (response.status === 200 && Array.isArray(response.data)) {
        const permissionNames = response.data.map(p => p.nome);
        setPermissions(permissionNames);
        console.log("Permissões carregadas:", permissionNames);
        return true; 
      } else {
        console.warn("Rota de permissões retornou dados inesperados:", response.data);
        setPermissions([]);
        return false; 
      }
    } catch (error) {
      console.error("Erro ao carregar permissões:", error);
      setPermissions([]);
      return false;
    }
  }, []); 

  const refreshToken = useCallback(async () => {
    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/refresh/',
        {},
        { withCredentials: true }
      );

      if (response.status === 200) {
        console.log("Token renovado com sucesso!");
        await fetchUserPermissions();
        return true; 
      }
      return false; 
    } catch (error) {
      console.error("Erro ao renovar o token:", error);
      clearAuthStates();
      return false; 
    }
  }, [fetchUserPermissions, clearAuthStates]);

  const checkLoginStatus = useCallback(async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/login/check",
        {},
        { withCredentials: true }
      );

      if (response.status === 200 && response.data.is_authenticated) {
        setIsAuthenticated(true);
        setUserRole(response.data.role || null);

        const permissionsFetched = await fetchUserPermissions();
        if (permissionsFetched) {
          localStorage.setItem('hasLoggedInOnce', 'true');
        } else {
          clearAuthStates();
        }
      } else {
        clearAuthStates(); 
      }
    } catch (error) {
      console.error("Erro ao verificar login:", error);
      clearAuthStates();
    } 
  }, [fetchUserPermissions, clearAuthStates]);

  useEffect(() => {
    const initAuthProcess = async () => {
      setIsLoading(true);
      const hasLoggedInOnce = localStorage.getItem('hasLoggedInOnce');

      if (hasLoggedInOnce === 'true') {
        await checkLoginStatus();
      } else {
        setIsAuthenticated(false);
        setUserRole(null);
        setPermissions(null);
      }
      setIsLoading(false); 
    };

    initAuthProcess();
  }, [checkLoginStatus]);

  useEffect(() => {
    let interval;
    if (isAuthenticated) {
      interval = setInterval(() => {
        refreshToken();
      }, 800000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isAuthenticated, refreshToken]);

  const logout = useCallback(async () => {
    try {
      await axios.post('http://127.0.0.1:8000/api/logout/', {}, { withCredentials: true });
      console.log("Logged out successfully from backend.");
    } catch (error) {
      console.error("Error during backend logout:", error);
    } finally {
      clearAuthStates();
    }
  }, [clearAuthStates]);

  const login = useCallback(async (username, password) => {
    setIsLoading(true); 
    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/login/', 
        { username, password },
        { withCredentials: true }
      );
      if (response.status === 200 && response.data.is_authenticated) {
        setIsAuthenticated(true);
        setUserRole(response.data.role || null);
        localStorage.setItem('hasLoggedInOnce', 'true');

        const permissionsFetched = await fetchUserPermissions();
        if (!permissionsFetched) {
          console.error("Failed to load permissions after successful login. Logging out.");
          clearAuthStates();
          return false;
        }
        return true;
      }
      clearAuthStates();
      return false; 
    } catch (error) {
      console.error("Login failed:", error);
      clearAuthStates();
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [fetchUserPermissions, clearAuthStates]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, permissions, logout, isLoading, login }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};