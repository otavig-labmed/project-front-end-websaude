import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { api } from '../utils/api.js';
import { TIMEOUTS, USER_ROLES } from '../utils/constants.js';
import { logError, getErrorMessage, ERROR_TYPES } from '../utils/errorHandler.js';

const AuthContext = createContext(undefined);

function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [permissions, setPermissions] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const clearAuthStates = useCallback(() => {
    setIsAuthenticated(false);
    setPermissions(null);
    localStorage.removeItem('hasLoggedInOnce');
  }, []);

  const fetchUserPermissions = useCallback(async () => {
    try {
      const data = await api.getUserPermissions();

      if (Array.isArray(data.permissoes)) {
        setUserRole(data.regra);
        const permissionNames = data.permissoes.map(p => p.nome);
        setPermissions(permissionNames);
        return true;
      } else {
        logError(new Error('Dados de permissões inesperados'), 'fetchUserPermissions');
        setPermissions([]);
        return false;
      }
    } catch (error) {
      if (error.message === ERROR_TYPES.UNAUTHORIZED) {
        logError(error, 'fetchUserPermissions - Usuário não autenticado');
        setPermissions([]);
        return false;
      }
      
      if (error.message === ERROR_TYPES.NETWORK) {
        logError(error, 'fetchUserPermissions - Erro de rede');
        setPermissions([]);
        return false;
      }
      
      logError(error, 'fetchUserPermissions');
      setPermissions([]);
      return false;
    }
  }, []);

  const checkLoginStatus = useCallback(async () => {
    try {
      const data = await api.checkLogin();
      
      if (data.message) {
        setIsAuthenticated(true);
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
      if (error.message === ERROR_TYPES.UNAUTHORIZED) {
        logError(error, 'checkLoginStatus - Usuário não autenticado');
        clearAuthStates();
        return;
      }
      
      if (error.message === ERROR_TYPES.NETWORK) {
        logError(error, 'checkLoginStatus - Erro de rede');
        return;
      }
      
      logError(error, 'checkLoginStatus');
      clearAuthStates();
    }
  }, [fetchUserPermissions, clearAuthStates]);

  useEffect(() => {
    const initAuthProcess = async () => {
      setIsLoading(true);
      const hasLoggedInOnce = localStorage.getItem('hasLoggedInOnce');
      
      if (hasLoggedInOnce) {
        await checkLoginStatus();
      } else {
        clearAuthStates();
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
      }, TIMEOUTS.TOKEN_REFRESH); 

      return () => clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const logout = useCallback(async () => {
    try {
      await api.logout();
    } catch (error) {
      logError(error, 'logout - Erro no backend');
    } finally {
      clearAuthStates();
      api.removeCookie("access_token"); 
      api.removeCookie("refresh_token");
    }
  }, [clearAuthStates]);

  const login = useCallback(async (email, password) => {
    setIsLoading(true); 
    try {
      const data = await api.login(email, password);
      setIsAuthenticated(true);
      localStorage.setItem('hasLoggedInOnce', 'true');
      
      const permissionsFetched = await fetchUserPermissions();
      
      if (!permissionsFetched) {
        logError(new Error('Falha ao carregar permissões após login'), 'login');
        clearAuthStates();
        return false;
      }
      return true;
    } catch (error) {
      if (error.message === ERROR_TYPES.UNAUTHORIZED) {
        logError(error, 'login - Credenciais inválidas');
        clearAuthStates();
        return false;
      }
      
      if (error.message === ERROR_TYPES.NETWORK) {
        logError(error, 'login - Erro de rede');
        clearAuthStates();
        return false;
      }
      
      logError(error, 'login');
      clearAuthStates();
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [fetchUserPermissions, clearAuthStates]);

  const refreshToken = useCallback(async () => {
    try {
      await api.refreshToken();
    } catch (error) {
      if (error.message === ERROR_TYPES.UNAUTHORIZED) {
        logError(error, 'refreshToken - Token expirado');
        await logout();
      } else {
        logError(error, 'refreshToken');
        await logout();
      }
    }
  }, [logout]);

  const contextValue = useMemo(() => ({
    isAuthenticated,
    userRole,
    permissions,
    logout,
    isLoading,
    login
  }), [isAuthenticated, userRole, permissions, logout, isLoading, login]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// Exportações nomeadas para compatibilidade com Fast Refresh
export { AuthProvider, useAuth };
