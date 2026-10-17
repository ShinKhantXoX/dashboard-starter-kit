'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

type Theme = 'light' | 'dark' | 'system'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  resolvedTheme: 'light' | 'dark'
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

const getInitialTheme = (defaultTheme: Theme): Theme => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('theme') as Theme | null
    if (stored) return stored
  }
  return defaultTheme
}

const getInitialResolvedTheme = (theme: Theme): 'light' | 'dark' => {
  if (typeof window !== 'undefined') {
    if (theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return theme
  }
  return 'light'
}

export function ThemeProvider({
  children,
  attribute,
  defaultTheme,
  enableSystem,
}: {
  children: ReactNode
  attribute: string
  defaultTheme: Theme
  enableSystem: boolean
}) {
  const [theme, setTheme] = useState<Theme>(() => getInitialTheme(defaultTheme))
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>(() =>
    getInitialResolvedTheme(getInitialTheme(defaultTheme))
  )
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
    // Initialize theme on mount
    const root = document.documentElement
    let resolved: 'light' | 'dark'

    if (theme === 'system') {
      resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    } else {
      resolved = theme
    }

    setResolvedTheme(resolved)
    root.classList.remove('light', 'dark')
    root.classList.add(resolved)
    root.setAttribute(attribute, resolved)

    localStorage.setItem('theme', theme)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!enableSystem || theme !== 'system') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      const resolved = mediaQuery.matches ? 'dark' : 'light'
      setResolvedTheme(resolved)
      document.documentElement.classList.remove('light', 'dark')
      document.documentElement.classList.add(resolved)
      document.documentElement.setAttribute(attribute, resolved)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [theme, enableSystem, attribute])

  if (!mounted) {
    return (
      <ThemeContext.Provider value={{ theme: defaultTheme, setTheme, resolvedTheme: 'light' }}>
        {children}
      </ThemeContext.Provider>
    )
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}