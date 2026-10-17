
import httpClient from '@/lib/http-client'
import { ENDPOINTS } from '@/lib/endpoints'
import type { AuthUser } from './types'

interface LoginResponse {
  accessToken: string
  tokenType: string
  user: AuthUser
}

export const authService = {
  async login(credentials: {
    email: string
    password: string
    rememberMe?: boolean
  }): Promise<LoginResponse> {
    const response = await httpClient.post<LoginResponse>(
      ENDPOINTS.auth.login,
      credentials,
    )

    if (response.error || !response.data) {
      throw new Error(response.error?.message ?? 'Login failed')
    }

    return response.data
  },

  async getCurrentUser(): Promise<AuthUser> {
    const response = await httpClient.get<{ user: AuthUser }>(
      ENDPOINTS.auth.me,
    )

    if (response.error || !response.data) {
      throw new Error(response.error?.message ?? 'Failed to fetch current user')
    }

    return response.data.user
  },

  async logout(): Promise<void> {
    const response = await httpClient.post(ENDPOINTS.auth.logout)

    if (response.error) {
      throw new Error(response.error.message)
    }
  },
}
