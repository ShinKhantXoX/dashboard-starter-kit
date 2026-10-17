import type { MongoAbility } from '@casl/ability'

export type AppActions = 'manage' | 'create' | 'read' | 'update' | 'delete' | 'export'

export type AppSubjects = 'Admin' | 'User' | 'Settings' | 'all'

export type AppAbility = MongoAbility<[AppActions, AppSubjects]>
