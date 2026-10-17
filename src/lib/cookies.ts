/**
 * Small cookie helpers — no external deps.
 * The XSRF-TOKEN cookie from Sanctum is URL-encoded; we decode it.
 */
export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.split('; ').find((row) => row.startsWith(`${name}=`))
  return match ? decodeURIComponent(match.split('=')[1]) : null
}

export function getXsrfToken(): string | null {
  return getCookie('XSRF-TOKEN')
}

export function setCookie(
  name: string,
  value: string,
  options: { days?: number; path?: string; domain?: string; sameSite?: 'Lax' | 'Strict' | 'None'; secure?: boolean } = {}
): void {
  if (typeof document === 'undefined') return
  const { days = 7, path = '/', domain, sameSite = 'Lax', secure = false } = options
  const expires = new Date(Date.now() + days * 864e5).toUTCString()
  const parts = [`${name}=${encodeURIComponent(value)}`, `expires=${expires}`, `path=${path}`, `SameSite=${sameSite}`]
  if (domain) parts.push(`domain=${domain}`)
  if (secure) parts.push('Secure')
  document.cookie = parts.join('; ')
}

export function deleteCookie(name: string, path = '/', domain?: string): void {
  if (typeof document === 'undefined') return
  const parts = [`${name}=`, 'expires=Thu, 01 Jan 1970 00:00:00 GMT', `path=${path}`]
  if (domain) parts.push(`domain=${domain}`)
  document.cookie = parts.join('; ')
}