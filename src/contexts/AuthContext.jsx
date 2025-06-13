import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [permissions, setPermissions] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const clearAuthStates = useCallback(() => {
    setIsAuthenticated(false);
    // setUserRole(null);
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

        if (Array.isArray(data.permissoes)) {
          setUserRole(data.regra);
          const permissionNames = data.permissoes.map(p => p.nome);
          setPermissions(permissionNames);
          //console.log("Permissões carregadas:", permissionNames);
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

  const checkLoginStatus = useCallback(async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/login/check/", {
        method: 'GET',
        credentials: 'include',  
      });

      if (response.ok) {
        const data = await response.json();
        //console.log(data.is_authenticated);
        if (data.message) {
          setIsAuthenticated(true);

          const permissionsFetched = await fetchUserPermissions();
          if (permissionsFetched) {
            localStorage.setItem('hasLoggedInOnce', 'true');
          } else {
            //console.log("Caiu 1");
            clearAuthStates();
          }
        } else {
          //console.log("Caiu 2");
          clearAuthStates(); 
        }
      } else {
        //console.log("Caiu 3");
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
      
      // Se já logou uma vez, tenta verificar o login
      if (hasLoggedInOnce) {
        await checkLoginStatus();
      } else {
        //console.log("Caiu 4");
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
      }, 800000); //

      return () => clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  useEffect(() => {
    // if (userRole !== null) { 
    //   console.log("userRole atualizado:", userRole);
    // }
  }, [userRole]);

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

  const refreshToken = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/refresh/', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
      } else {
        console.error('Erro ao renovar o token');
        await logout();
      }
    } catch (error) {
      console.error('Erro ao tentar renovar o token', error);
      await logout();
    }
  };

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
