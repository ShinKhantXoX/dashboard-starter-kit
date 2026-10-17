import type { ApiError, ApiResponse, ApiEnvelope } from '@/types/api'

const API_URL = import.meta.env.VITE_API_URL ?? '/api'

let accessToken: string | null = null

export function setAccessToken(token: string | null): void {
  accessToken = token
}

/**
 * Normalize base URL + endpoint so we never get double slashes or missing ones.
 * e.g. base="http://localhost:8000/api/v1", endpoint="auth/login"
 *     -> "http://localhost:8000/api/v1/auth/login"
 */
function joinUrl(base: string, endpoint: string): string {
  const b = base.replace(/\/+$/, '')
  const e = endpoint.replace(/^\/+/, '')
  return `${b}/${e}`
}

export interface UnauthorizedDetails {
  /** The endpoint that returned 401, e.g. `auth/me` or `admins`. */
  endpoint: string
  status: number
}

let onUnauthorized: ((details: UnauthorizedDetails) => void) | null = null

export function setUnauthorizedHandler(fn: (details: UnauthorizedDetails) => void): void {
  onUnauthorized = fn
}

function unwrapEnvelope<T>(json: unknown): T {
  if (
    json &&
    typeof json === 'object' &&
    'status' in json &&
    'data' in json &&
    (json as ApiEnvelope<T>).status !== undefined
  ) {
    return (json as ApiEnvelope<T>).data as T
  }
  return json as T
}

class HttpClient {
  private baseUrl: string

  constructor(baseUrl: string = API_URL) {
    this.baseUrl = baseUrl
  }

  private hasBody(method?: string, body?: unknown): boolean {
    const m = (method ?? 'GET').toUpperCase()
    return (m === 'POST' || m === 'PUT' || m === 'PATCH') && body !== undefined && body !== null
  }

  async csrf(): Promise<void> {
  const response = await fetch(
    joinUrl(this.baseUrl.replace(/\/api\/?$/, ''), '/sanctum/csrf-cookie'),
    {
      method: 'GET',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
      },
    },
  )

  if (!response.ok) {
    throw new Error('Failed to initialize CSRF protection')
  }
}

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<ApiResponse<T>> {
    const url = joinUrl(this.baseUrl, endpoint)
    const method = (options.method ?? 'GET').toUpperCase()
    const body = options.body

    const headers = new Headers(options.headers)

    headers.set('Accept', 'application/json')

    // Only set Content-Type when sending a body.
    if (this.hasBody(method, body)) {
      headers.set('Content-Type', 'application/json')
    }

    // Attach the Bearer token to authenticated requests.
    if (accessToken) {
      headers.set('Authorization', `Bearer ${accessToken}`)
    }

    const config: RequestInit = {
      ...options,
      method,
      headers,
      credentials: 'omit',
    }

    try {
      const response = await fetch(url, config)

      const contentType = response.headers.get('content-type')
      const isJson = contentType?.includes('application/json')

      if (!response.ok) {
        let errorData: ApiError = {
          message: 'An error occurred',
          status: response.status,
        }

        if (isJson) {
          try {
            const json = await response.json()
            // Laravel envelope on error: { status, message, errors? }
            if (json && typeof json === 'object' && 'message' in json) {
              errorData = {
                message: (json as { message: string }).message,
                status: response.status,
                errors: (json as { errors?: Record<string, string[]> }).errors,
              }
            } else {
              errorData.message = 'An error occurred'
            }
          } catch {
            errorData.message = response.statusText
          }
        } else {
          errorData.message = response.statusText
        }

        // 401 = unauthenticated / session expired. The handler decides
        // whether it actually means "the session is gone" (see auth.store).
        if (response.status === 401 && onUnauthorized) {
          onUnauthorized({ endpoint, status: response.status })
        }

        return { data: null, error: errorData }
      }

      if (response.status === 204) {
        return { data: null as T, error: null }
      }

      if (!isJson) {
        const text = await response.text()
        return { data: text as unknown as T, error: null }
      }

      const json = await response.json()
      const data = unwrapEnvelope<T>(json)
      return { data, error: null }
    } catch (error) {
      return {
        data: null,
        error: {
          message: error instanceof Error ? error.message : 'Network error',
          status: 0,
        },
      }
    }
  }

  async get<T>(
    endpoint: string,
    params?: Record<string, string | number | boolean | undefined>
  ): Promise<ApiResponse<T>> {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value))
        }
      })
    }
    const query = searchParams.toString() ? `?${searchParams.toString()}` : ''
    return this.request<T>(`${endpoint}${query}`, { method: 'GET' })
  }

  async post<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    })
  }

  async put<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    })
  }

  async patch<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    })
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }
}

export const httpClient = new HttpClient()
export default httpClient