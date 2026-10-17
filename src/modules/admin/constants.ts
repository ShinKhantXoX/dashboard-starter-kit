/** Role codes the admin form can assign. */
export const ROLE_OPTIONS = ['SUPER_ADMIN', 'ADMIN', 'USER'] as const

/** Permission codes the admin form can assign. */
export const PERMISSION_OPTIONS = [
  'ADMIN_INDEX',
  'ADMIN_STORE',
  'ADMIN_UPDATE',
  'ADMIN_DESTROY',
  'USER_INDEX',
  'USER_SHOW',
  'USER_STORE',
  'USER_UPDATE',
  'USER_DESTROY',
  'USER_EXPORT',
] as const
