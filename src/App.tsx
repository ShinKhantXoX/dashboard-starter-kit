import { useEffect } from 'react'
import AppRoutes from '@/routes/router'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { AbilityProvider } from '@/lib/ability/AbilityProvider'
import { useAuthStore } from '@/stores/auth.store'

function App() {
  const isInitialized = useAuthStore((s) => s.isInitialized)
  const initialize = useAuthStore((s) => s.initialize)

  useEffect(() => {
    initialize()
  }, [initialize])

  // Optional: show a splash while checking session
  if (!isInitialized) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading…
      </div>
    )
  }

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
    >
      <AbilityProvider>
        <AppRoutes />
      </AbilityProvider>
    </ThemeProvider>
  )
}

export default App