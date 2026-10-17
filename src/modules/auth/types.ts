export interface AuthUser {
  id: string
  email: string
  roles: string[]
  permissions: string[]
}

export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

export interface AuthResponse {
  user: AuthUser
  accessToken: string
}

/** For backward compatibility with any remaining code expecting a User */
export type User = AuthUser