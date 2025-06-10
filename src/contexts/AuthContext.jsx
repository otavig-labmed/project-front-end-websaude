import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

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
      const response = await fetch('http://127.0.0.1:8000/api/user/permissions/', {
        method: 'GET',
        credentials: 'include', 
      });
      
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          const permissionNames = data.map(p => p.nome);
          setPermissions(permissionNames);
          console.log("Permissões carregadas:", permissionNames);
          return true;
        } else {
          console.warn("Rota de permissões retornou dados inesperados:", data);
          setPermissions([]);
          return false;
        }
      } else {
        console.error("Erro ao carregar permissões:", response.status);
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
      const response = await fetch('http://127.0.0.1:8000/api/refresh/', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
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
      const response = await fetch("http://127.0.0.1:8000/api/login/check", {
        method: 'POST',
        credentials: 'include',  
      });

      if (response.ok) {
        const data = await response.json();
        if (data.is_authenticated) {
          setIsAuthenticated(true);
          setUserRole(data.role || null);

          const permissionsFetched = await fetchUserPermissions();
          if (permissionsFetched) {
            localStorage.setItem('hasLoggedInOnce', 'true');
          } else {
            clearAuthStates();
          }
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
      }, 800000); // tempo de expiração do token (em ms)
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isAuthenticated, refreshToken]);

  const logout = useCallback(async () => {
    try {
      await fetch('http://127.0.0.1:8000/api/logout/', {
        method: 'POST',
        credentials: 'include',  // Inclui cookies de sessão
      });
      console.log("Logged out successfully from backend.");
    } catch (error) {
      console.error("Erro durante o logout no backend:", error);
    } finally {
      clearAuthStates();
      document.cookie = "access_token=; Max-Age=0; path=/"; 
      document.cookie = "refresh_token=; Max-Age=0; path=/";
    }
  }, [clearAuthStates]);

  const login = useCallback(async (email, password) => {
    setIsLoading(true); 
    try {
      const response = await fetch('http://127.0.0.1:8000/api/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include',  // Inclui cookies de sessão
      });

      if (response.ok) {
        const data = await response.json();
        setIsAuthenticated(true);
        setUserRole(data.role || null);
        localStorage.setItem('hasLoggedInOnce', 'true');
        
        const permissionsFetched = await fetchUserPermissions();
        
        if (!permissionsFetched) {
          console.error("Falha ao carregar permissões após login bem-sucedido. Desconectando.");
          clearAuthStates();
          return false;
        }
        return true;
      }
      clearAuthStates();
      return false; 
    } catch (error) {
      console.error("Falha no login:", error);
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
