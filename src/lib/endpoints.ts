export const ENDPOINTS = {
  auth: {
    login: 'auth/login',
    logout: 'auth/logout',
    me: 'auth/me',
    refresh: 'auth/refresh',
  },
  users: {
    list: 'users',
    detail: (id: string) => `users/${id}`,
  },
  admins: {
    list: 'admins',
    detail: (id: string) => `admins/${id}`,
  },
} as const