import { createMongoAbility, type RawRuleOf } from '@casl/ability'
import type { AuthUser } from '@/modules/auth/types'
import type { AppAbility, AppActions, AppSubjects } from './types'

type RuleTuple = [AppActions, AppSubjects]

/**
 * Backend role -> CASL rules.
 * `SUPER_ADMIN` gets full access (including the Admins module).
 */
const ROLE_RULES: Record<string, RuleTuple[]> = {
  SUPER_ADMIN: [['manage', 'all']],
  ADMIN: [
    ['manage', 'Admin'],
    ['read', 'User'],
  ],
  USER: [['read', 'User']],
}

/**
 * Backend permission code -> CASL rule.
 * Unknown codes are ignored and summarised once in dev, so a new backend
 * permission never breaks the UI.
 *
 * NOTE: these codes are backend-specific. The ORGANIZER_ACCOUNT_* codes map
 * onto the User subject (organizer accounts are users); adjust the
 * action/subject to match how your backend actually gates each screen.
 */
const PERMISSION_RULES: Record<string, RuleTuple> = {
  USER_INDEX: ['read', 'User'],
  USER_SHOW: ['read', 'User'],
  USER_STORE: ['create', 'User'],
  USER_UPDATE: ['update', 'User'],
  USER_DESTROY: ['delete', 'User'],
  USER_EXPORT: ['export', 'User'],

  ORGANIZER_ACCOUNT_INDEX: ['read', 'User'],
  ORGANIZER_ACCOUNT_SHOW: ['read', 'User'],
  ORGANIZER_ACCOUNT_STORE: ['create', 'User'],
  ORGANIZER_ACCOUNT_UPDATE: ['update', 'User'],
  ORGANIZER_ACCOUNT_DESTROY: ['delete', 'User'],
}

const warnedPermissions = new Set<string>()

export function defineAbilityFor(user: AuthUser | null): AppAbility {
  const rules: RawRuleOf<AppAbility>[] = []
  const unmapped: string[] = []

  if (user) {
    for (const role of user.roles ?? []) {
      for (const [action, subject] of ROLE_RULES[role] ?? []) {
        rules.push({ action, subject })
      }
    }

    for (const permission of user.permissions ?? []) {
      const rule = PERMISSION_RULES[permission]
      if (rule) {
        rules.push({ action: rule[0], subject: rule[1] })
      } else if (!warnedPermissions.has(permission)) {
        warnedPermissions.add(permission)
        unmapped.push(permission)
      }
    }
  }

  if (import.meta.env.DEV && unmapped.length > 0) {
    console.warn(
      `[casl] ${unmapped.length} unmapped permission code(s): ${unmapped.join(', ')}\n` +
        'Add them to PERMISSION_RULES in src/lib/ability/define-ability.ts to grant UI access.'
    )
  }

  return createMongoAbility<[AppActions, AppSubjects]>(rules)
}
