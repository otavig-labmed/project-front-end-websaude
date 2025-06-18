// Tipos de erro
export const ERROR_TYPES = {
  NETWORK: 'NETWORK_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  SERVER_ERROR: 'SERVER_ERROR',
  VALIDATION: 'VALIDATION_ERROR',
  UNKNOWN: 'UNKNOWN_ERROR'
};

// Mensagens de erro amigáveis
export const ERROR_MESSAGES = {
  [ERROR_TYPES.NETWORK]: 'Erro de conexão. Verifique sua internet e tente novamente.',
  [ERROR_TYPES.UNAUTHORIZED]: 'Sessão expirada. Faça login novamente.',
  [ERROR_TYPES.FORBIDDEN]: 'Você não tem permissão para acessar este recurso.',
  [ERROR_TYPES.NOT_FOUND]: 'Recurso não encontrado.',
  [ERROR_TYPES.SERVER_ERROR]: 'Erro no servidor. Tente novamente em alguns minutos.',
  [ERROR_TYPES.VALIDATION]: 'Dados inválidos. Verifique as informações e tente novamente.',
  [ERROR_TYPES.UNKNOWN]: 'Ocorreu um erro inesperado. Tente novamente.'
};

// Função para classificar erros
export const classifyError = (error) => {
  if (error.message === 'UNAUTHORIZED') return ERROR_TYPES.UNAUTHORIZED;
  if (error.message === 'FORBIDDEN') return ERROR_TYPES.FORBIDDEN;
  if (error.message === 'NOT_FOUND') return ERROR_TYPES.NOT_FOUND;
  if (error.message === 'SERVER_ERROR') return ERROR_TYPES.SERVER_ERROR;
  if (error.message === 'NETWORK_ERROR') return ERROR_TYPES.NETWORK;
  
  // Verifica se é erro de rede
  if (error.name === 'TypeError' && error.message.includes('fetch')) {
    return ERROR_TYPES.NETWORK;
  }
  
  // Verifica se é erro de validação
  if (error.name === 'ValidationError') {
    return ERROR_TYPES.VALIDATION;
  }
  
  return ERROR_TYPES.UNKNOWN;
};

// Função para obter mensagem de erro amigável
export const getErrorMessage = (error) => {
  const errorType = classifyError(error);
  return ERROR_MESSAGES[errorType] || ERROR_MESSAGES[ERROR_TYPES.UNKNOWN];
};

// Função para log de erro
export const logError = (error, context = '') => {
  const errorType = classifyError(error);
  
  // Em desenvolvimento, sempre loga
  if (process.env.NODE_ENV === 'development') {
    console.error(`[${errorType}] ${context}:`, error);
    return;
  }
  
  // Em produção, só loga erros críticos
  if (errorType === ERROR_TYPES.SERVER_ERROR || errorType === ERROR_TYPES.UNKNOWN) {
    console.error(`[${errorType}] ${context}:`, error);
  } else {
    console.warn(`[${errorType}] ${context}:`, error.message);
  }
};

// Função para retry de operações
export const retryOperation = async (operation, maxRetries = 3, delay = 1000) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      const errorType = classifyError(error);
      
      // Não retry para erros de autorização ou validação
      if (errorType === ERROR_TYPES.UNAUTHORIZED || 
          errorType === ERROR_TYPES.FORBIDDEN || 
          errorType === ERROR_TYPES.VALIDATION) {
        throw error;
      }
      
      // Se é o último attempt, re-throw o erro
      if (attempt === maxRetries) {
        throw error;
      }
      
      // Aguarda antes de tentar novamente
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }
};

// Função para debounce de operações
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}; 