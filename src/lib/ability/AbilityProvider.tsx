import { useMemo, type ReactNode } from 'react'
import { AbilityProvider as CaslAbilityProvider } from '@casl/react'
import { useAuthStore } from '@/stores/auth.store'
import { defineAbilityFor } from './define-ability'

/**
 * Builds the CASL ability from the authenticated user (roles + permissions)
 * and exposes it to the tree via @casl/react's context.
 */
export function AbilityProvider({ children }: { children: ReactNode }) {
  const user = useAuthStore((state) => state.user)
  const ability = useMemo(() => defineAbilityFor(user), [user])

  return <CaslAbilityProvider value={ability}>{children}</CaslAbilityProvider>
}
