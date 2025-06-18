import { API_ENDPOINTS } from './constants.js';

// Função para configurar cookies manualmente
const setCookie = (name, value, options = {}) => {
  const defaultOptions = {
    path: '/',
    sameSite: 'Lax',
    secure: window.location.protocol === 'https:',
    ...options
  };
  
  let cookieString = `${name}=${value}`;
  
  if (defaultOptions.expires) {
    cookieString += `; expires=${defaultOptions.expires.toUTCString()}`;
  }
  if (defaultOptions.maxAge) {
    cookieString += `; max-age=${defaultOptions.maxAge}`;
  }
  if (defaultOptions.path) {
    cookieString += `; path=${defaultOptions.path}`;
  }
  if (defaultOptions.domain) {
    cookieString += `; domain=${defaultOptions.domain}`;
  }
  if (defaultOptions.secure) {
    cookieString += '; secure';
  }
  if (defaultOptions.sameSite) {
    cookieString += `; samesite=${defaultOptions.sameSite}`;
  }
  
  document.cookie = cookieString;
};

// Função para obter cookies
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

// Função para remover cookies
const removeCookie = (name) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

// Configuração base para requisições
const baseConfig = {
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
  },
  mode: 'cors',
};

// Função utilitária para fazer requisições
const apiRequest = async (url, options = {}) => {
  try {
    // Verificar se há cookies de autenticação para endpoints protegidos
    const isProtectedEndpoint = url.includes('/user/permissions/') || 
                               url.includes('/login/check/') || 
                               url.includes('/refresh/');
    
    if (isProtectedEndpoint) {
      const accessToken = getCookie('access_token');
      if (!accessToken) {
        console.warn('Token de acesso não encontrado para endpoint protegido:', url);
      }
    }

    const config = {
      ...baseConfig,
      ...options,
      headers: {
        ...baseConfig.headers,
        ...options.headers,
      },
    };

    const response = await fetch(url, config);
    
    // Tratamento específico para diferentes status codes
    if (response.status === 401) {
      // Unauthorized - usuário não está autenticado
      throw new Error('UNAUTHORIZED');
    }
    
    if (response.status === 403) {
      // Forbidden - usuário não tem permissão
      throw new Error('FORBIDDEN');
    }
    
    if (response.status === 404) {
      // Not Found
      throw new Error('NOT_FOUND');
    }
    
    if (response.status >= 500) {
      // Erro do servidor
      throw new Error('SERVER_ERROR');
    }
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    // Verifica se a resposta tem conteúdo antes de tentar fazer parse
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    
    // Se não for JSON, retorna o texto
    return await response.text();
  } catch (error) {
    // Se for erro de rede, não loga como erro da API
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      console.warn('Erro de rede - verifique sua conexão:', error.message);
      throw new Error('NETWORK_ERROR');
    }
    
    // Se já é um erro customizado, apenas repassa
    if (error.message === 'UNAUTHORIZED' || 
        error.message === 'FORBIDDEN' || 
        error.message === 'NOT_FOUND' || 
        error.message === 'SERVER_ERROR' ||
        error.message === 'NETWORK_ERROR') {
      throw error;
    }
    
    console.error('API request failed:', error);
    throw error;
  }
};

// Funções específicas da API
export const api = {
  // Autenticação
  login: async (email, password) => {
    const response = await apiRequest(API_ENDPOINTS.LOGIN, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    // Se o login foi bem-sucedido, configurar cookies manualmente se necessário
    if (response && response.access_token) {
      setCookie('access_token', response.access_token, {
        maxAge: 3600, // 1 hora
        sameSite: 'Lax'
      });
    }
    
    if (response && response.refresh_token) {
      setCookie('refresh_token', response.refresh_token, {
        maxAge: 86400 * 7, // 7 dias
        sameSite: 'Lax'
      });
    }
    
    return response;
  },

  logout: async () => {
    try {
      await apiRequest(API_ENDPOINTS.LOGOUT, {
        method: 'POST',
      });
    } finally {
      // Sempre remover cookies localmente
      removeCookie('access_token');
      removeCookie('refresh_token');
    }
  },

  checkLogin: () => 
    apiRequest(API_ENDPOINTS.CHECK_LOGIN, {
      method: 'GET',
    }),

  refreshToken: async () => {
    const response = await apiRequest(API_ENDPOINTS.REFRESH_TOKEN, {
      method: 'POST',
    });
    
    // Atualizar o token de acesso se fornecido
    if (response && response.access_token) {
      setCookie('access_token', response.access_token, {
        maxAge: 3600, // 1 hora
        sameSite: 'Lax'
      });
    }
    
    return response;
  },

  getUserPermissions: () => 
    apiRequest(API_ENDPOINTS.USER_PERMISSIONS, {
      method: 'GET',
    }),

  // Função genérica para outras requisições
  request: (url, options) => apiRequest(url, options),
  
  // Funções utilitárias para cookies
  getCookie,
  setCookie,
  removeCookie,
}; 