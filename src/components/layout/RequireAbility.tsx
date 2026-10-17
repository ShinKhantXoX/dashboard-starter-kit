import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAppAbility } from '@/lib/ability/use-app-ability'
import type { AppActions, AppSubjects } from '@/lib/ability/types'

interface RequireAbilityProps {
  action: AppActions
  subject: AppSubjects
  children: ReactNode
}

/**
 * Route guard: renders children only when the current ability allows
 * `action` on `subject`, otherwise redirects to the 403 page.
 */
export function RequireAbility({ action, subject, children }: RequireAbilityProps) {
  const ability = useAppAbility()

  if (!ability.can(action, subject)) {
    return <Navigate to="/403" replace />
  }

  return <>{children}</>
}
