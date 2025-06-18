// Utilitários de debug para desenvolvimento
export const debugUtils = {
  // Verificar cookies atuais
  checkCookies: () => {
    console.log('=== DEBUG: Cookies atuais ===');
    console.log('Document cookies:', document.cookie);
    
    const cookies = document.cookie.split(';').reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split('=');
      acc[key] = value;
      return acc;
    }, {});
    
    console.log('Cookies parseados:', cookies);
    console.log('Access token presente:', !!cookies.access_token);
    console.log('Refresh token presente:', !!cookies.refresh_token);
    console.log('=============================');
  },

  // Verificar configuração de CORS
  checkCORS: () => {
    console.log('=== DEBUG: Configuração CORS ===');
    console.log('Origin:', window.location.origin);
    console.log('Protocol:', window.location.protocol);
    console.log('Host:', window.location.host);
    console.log('API Base URL:', import.meta.env.DEV ? '/api' : 'http://192.168.15.59:8000/api');
    console.log('===============================');
  },

  // Testar requisição simples
  testRequest: async (url) => {
    console.log('=== DEBUG: Testando requisição ===');
    try {
      const response = await fetch(url, {
        credentials: 'include',
        mode: 'cors'
      });
      console.log('Status:', response.status);
      console.log('Headers:', Object.fromEntries(response.headers.entries()));
      console.log('OK:', response.ok);
      return response;
    } catch (error) {
      console.error('Erro na requisição:', error);
      throw error;
    } finally {
      console.log('===============================');
    }
  },

  // Verificar estado de autenticação
  checkAuthState: (authContext) => {
    console.log('=== DEBUG: Estado de autenticação ===');
    console.log('Is authenticated:', authContext.isAuthenticated);
    console.log('User role:', authContext.userRole);
    console.log('Permissions:', authContext.permissions);
    console.log('Is loading:', authContext.isLoading);
    console.log('====================================');
  }
};

// Função para habilitar debug em desenvolvimento
export const enableDebug = () => {
  if (import.meta.env.DEV) {
    window.debugUtils = debugUtils;
    console.log('Debug utils habilitadas. Use window.debugUtils para acessar.');
  }
}; 