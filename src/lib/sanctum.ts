
import { getXsrfToken } from './cookies'

let csrfFetched = false
let csrfPromise: Promise<void> | null = null

export async function ensureCsrfCookie(): Promise<void> {
  if (csrfFetched) return
  if (csrfPromise) return csrfPromise

  const apiUrl = import.meta.env.VITE_API_URL ?? '/api'

  const sanctumUrl =
    import.meta.env.VITE_SANCTUM_URL ??
    (apiUrl.startsWith('http')
      ? new URL(apiUrl).origin
      : window.location.origin)

  csrfPromise = (async () => {
    const res = await fetch(
      `${sanctumUrl.replace(/\/+$/, '')}/sanctum/csrf-cookie`,
      {
        method: 'GET',
        credentials: 'include',
        headers: {
          Accept: 'application/json',
        },
      },
    )

    if (!res.ok) {
      throw new Error(
        `CSRF cookie request failed: ${res.status}`,
      )
    }

    // Read the cookie after the response completes.
    getXsrfToken()
    csrfFetched = true
  })()

  try {
    await csrfPromise
  } finally {
    csrfPromise = null
  }
}

export function resetCsrfFetched(): void {
  csrfFetched = false
  csrfPromise = null
}
