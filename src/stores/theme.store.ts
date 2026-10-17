import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

type Theme = 'light' | 'dark' | 'system'

interface ThemeState {
  theme: Theme
  resolvedTheme: 'light' | 'dark'
  setTheme: (theme: Theme) => void
  initializeTheme: () => void
}

const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window !== 'undefined') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  return 'light'
}

const applyTheme = (theme: 'light' | 'dark') => {
  const root = document.documentElement
  if (theme === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'system',
      resolvedTheme: 'light',

      setTheme: (theme: Theme) => {
        const resolvedTheme = theme === 'system' ? getSystemTheme() : theme
        applyTheme(resolvedTheme)
        set({ theme, resolvedTheme })
      },

      initializeTheme: () => {
        const { theme } = get()
        const resolvedTheme = theme === 'system' ? getSystemTheme() : theme
        applyTheme(resolvedTheme)
        set({ resolvedTheme })

        if (typeof window !== 'undefined' && theme === 'system') {
          const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
          const handler = (e: MediaQueryListEvent) => {
            const newResolvedTheme = e.matches ? 'dark' : 'light'
            applyTheme(newResolvedTheme)
            set({ resolvedTheme: newResolvedTheme })
          }
          mediaQuery.addEventListener('change', handler)
          return () => mediaQuery.removeEventListener('change', handler)
        }
      },
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ theme: state.theme }),
    }
  )
)