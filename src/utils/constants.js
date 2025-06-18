export const API_BASE_URL = import.meta.env.DEV 
  ? '/api' 
  : 'http://192.168.15.59:8000/api';

export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/login/`,
  LOGOUT: `${API_BASE_URL}/logout/`,
  CHECK_LOGIN: `${API_BASE_URL}/login/check/`,
  REFRESH_TOKEN: `${API_BASE_URL}/refresh/`,
  USER_PERMISSIONS: `${API_BASE_URL}/user/permissions/`,
};

export const TIMEOUTS = {
  TOKEN_REFRESH: 800000, 
  ALERT_DURATION: 5000,
  LOGIN_ALERT_DURATION: 2000,
};

// Tipos de alerta
export const ALERT_TYPES = {
  ERROR: 'error',
  WARNING: 'warning',
  SUCCESS: 'success',
  GOOD: 'good',
};

export const USER_ROLES = {
  ADMIN: 'Admin',
};

export const PERMISSIONS = {
  DASHBOARD_VIEW: 'dashboard_visualizar',
  CALENDAR_VIEW: 'agenda_visualizar',
  CALENDAR_CREATE: 'agenda_criar',
  CALENDAR_EDIT: 'agenda_editar',
  REPORTS_VIEW: 'reportes_visualizar',
  PATIENT_VIEW: 'paciente_visualizar',
  USERS_VIEW: 'usuarios_visualizar',
  USERS_CREATE: 'usuarios_criar',
  FINDINGS_VIEW: 'findings_visualizar',
};

// Configurações de paginação
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
};

// Configurações de validação
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 6,
}; 