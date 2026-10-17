import { useAbility } from '@casl/react'
import type { AppAbility } from './types'

/** Typed accessor for the current ability. */
export function useAppAbility(): AppAbility {
  return useAbility<AppAbility>()
}
