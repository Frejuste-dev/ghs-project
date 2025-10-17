import { RequestStatus, UserProfile, ContractType } from '@/types';

// Request Status Labels
export const REQUEST_STATUS_LABELS: Record<RequestStatus, string> = {
  [RequestStatus.PENDING]: 'Brouillon',
  [RequestStatus.SUBMITTED]: 'Soumise',
  [RequestStatus.FIRST_LEVEL_APPROVED]: 'Validée N1',
  [RequestStatus.IN_PROGRESS]: 'En cours',
  [RequestStatus.SECOND_LEVEL_APPROVED]: 'Validée N2',
  [RequestStatus.ACCEPTED]: 'Acceptée',
  [RequestStatus.REJECTED]: 'Rejetée',
};

// Request Status Colors (for Badge component)
export const REQUEST_STATUS_COLORS: Record<
  RequestStatus,
  'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
> = {
  [RequestStatus.PENDING]: 'default',
  [RequestStatus.SUBMITTED]: 'primary',
  [RequestStatus.FIRST_LEVEL_APPROVED]: 'info',
  [RequestStatus.IN_PROGRESS]: 'warning',
  [RequestStatus.SECOND_LEVEL_APPROVED]: 'info',
  [RequestStatus.ACCEPTED]: 'success',
  [RequestStatus.REJECTED]: 'danger',
};

// User Profile Labels
export const USER_PROFILE_LABELS: Record<UserProfile, string> = {
  [UserProfile.VALIDATOR]: 'Validateur',
  [UserProfile.SUPERVISOR]: 'Superviseur',
  [UserProfile.ADMINISTRATOR]: 'Administrateur',
  [UserProfile.COORDINATOR]: 'Coordinateur',
};

// Contract Type Labels
export const CONTRACT_TYPE_LABELS: Record<ContractType, string> = {
  [ContractType.CDI]: 'CDI',
  [ContractType.CDD]: 'CDD',
  [ContractType.INTERIM]: 'Intérim',
  [ContractType.STAGE]: 'Stage',
  [ContractType.ALTERNANCE]: 'Alternance',
  [ContractType.MOO]: 'MOO',
};

// Validation Rules
export const VALIDATION_RULES = {
  MAX_HOURS_PER_REQUEST: 12,
  MIN_PASSWORD_LENGTH: 8,
  EMPLOYEE_NUMBER_REGEX: /^EMP\d{4,}$/,
  SERVICE_CODE_REGEX: /^SVC-[A-Z0-9]{3,}$/,
} as const;

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'dd/MM/yyyy',
  DISPLAY_WITH_TIME: 'dd/MM/yyyy HH:mm',
  API: 'yyyy-MM-dd',
  TIME: 'HH:mm',
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  USER: 'user',
  THEME: 'theme',
  LANGUAGE: 'language',
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  REQUESTS: '/requests',
  EMPLOYEES: '/employees',
  SERVICES: '/services',
  ACCOUNTS: '/accounts',
  DELEGATIONS: '/delegations',
  WORKFLOWS: '/workflows',
  REPORTS: '/reports',
  NOTIFICATIONS: '/notifications',
} as const;

// Query Keys (for React Query)
export const QUERY_KEYS = {
  AUTH: {
    ME: ['auth', 'me'],
  },
  REQUESTS: {
    ALL: ['requests'],
    DETAIL: (id: number) => ['requests', id],
    MY_REQUESTS: (employeeId: number) => ['requests', 'employee', employeeId],
    STATS: (employeeId: number) => ['requests', 'stats', employeeId],
  },
  EMPLOYEES: {
    ALL: ['employees'],
    DETAIL: (id: number) => ['employees', id],
    BY_SERVICE: (serviceId: number) => ['employees', 'service', serviceId],
  },
  SERVICES: {
    ALL: ['services'],
    DETAIL: (id: number) => ['services', id],
    TREE: ['services', 'tree'],
  },
  ACCOUNTS: {
    ALL: ['accounts'],
    DETAIL: (id: number) => ['accounts', id],
  },
  DELEGATIONS: {
    ALL: ['delegations'],
    ACTIVE: ['delegations', 'active'],
  },
  WORKFLOWS: {
    ALL: ['workflows'],
    BY_REQUEST: (requestId: number) => ['workflows', 'request', requestId],
  },
  NOTIFICATIONS: {
    ALL: ['notifications'],
    UNREAD: ['notifications', 'unread'],
    COUNT: ['notifications', 'count'],
  },
} as const;