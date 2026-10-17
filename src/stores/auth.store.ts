
import { create } from 'zustand'
import { authService } from '@/modules/auth/service'
import type { AuthUser } from '@/modules/auth/types'
import {
  setAccessToken,
  setUnauthorizedHandler,
} from '@/lib/http-client'
import { ENDPOINTS } from '@/lib/endpoints'

interface AuthState {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  isInitialized: boolean
  isSubmitting: boolean

  login: (credentials: {
    email: string
    password: string
    rememberMe?: boolean
  }) => Promise<void>

  logout: () => Promise<void>
  setUser: (user: AuthUser | null) => void
  setLoading: (loading: boolean) => void
  initialize: () => Promise<void>
  hasRole: (role: string) => boolean
  hasPermission: (permission: string) => boolean
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  isInitialized: false,
  isSubmitting: false,

  login: async (credentials) => {
    set({ isSubmitting: true })

    try {
      // Login must return the access token.
      const result = await authService.login(credentials)

      if (!result.accessToken) {
        throw new Error('Login response did not contain an access token')
      }

      // Store the token in memory before calling protected endpoints.
      setAccessToken(result.accessToken)

      const user = await authService.getCurrentUser()

      set({
        user,
        isAuthenticated: true,
        isInitialized: true,
        isLoading: false,
      })
    } catch (error) {
      setAccessToken(null)

      set({
        user: null,
        isAuthenticated: false,
        isInitialized: true,
        isLoading: false,
      })

      throw error
    } finally {
      set({ isSubmitting: false })
    }
  },

  logout: async () => {
    set({ isSubmitting: true })

    try {
      await authService.logout()
    } finally {
      // Always clear the client-side token and user state.
      setAccessToken(null)

      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        isInitialized: true,
        isSubmitting: false,
      })
    }
  },

  setUser: (user) => {
    set({
      user,
      isAuthenticated: Boolean(user),
    })
  },

  setLoading: (isLoading) => set({ isLoading }),

  initialize: async () => {
    if (get().isInitialized) return

    set({ isLoading: true })

    // An in-memory access token is lost on page reload.
    // Without a refresh flow, do not assume the user is authenticated.
    setAccessToken(null)

    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      isInitialized: true,
    })
  },

  hasRole: (role) =>
    get().user?.roles.includes(role) ?? false,

  hasPermission: (permission) =>
    get().user?.permissions.includes(permission) ?? false,
}))

const SESSION_ENDPOINTS = new Set<string>([
  ENDPOINTS.auth.me,
])

setUnauthorizedHandler(({ endpoint }) => {
  const path = endpoint.split('?')[0]

  if (!SESSION_ENDPOINTS.has(path)) return

  setAccessToken(null)

  useAuthStore.getState().setUser(null)
})
