import { z } from 'zod'

const roleEnum = z.enum({ admin: 'admin', user: 'user', viewer: 'viewer' })
const statusEnum = z.enum({ active: 'active', inactive: 'inactive' })
const sortOrderEnum = z.enum({ asc: 'asc', desc: 'desc' })

export const userCreateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must be at most 100 characters'),
  email: z.string().email('Invalid email address'),
  role: roleEnum,
  status: statusEnum,
  password: z.string().min(8, 'Password must be at least 8 characters').optional(),
})

export const userUpdateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must be at most 100 characters'),
  email: z.string().email('Invalid email address'),
  role: roleEnum,
  status: statusEnum,
})

export const userSchema = z.object({
  id: z.string().uuid('Invalid user ID'),
  name: z.string().min(2).max(100),
  email: z.string().email(),
  role: roleEnum,
  status: statusEnum,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export type UserCreateInput = z.infer<typeof userCreateSchema>
export type UserUpdateInput = z.infer<typeof userUpdateSchema>
export type User = z.infer<typeof userSchema>

export const userListQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  perPage: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: sortOrderEnum.optional(),
})

export type UserListQuery = z.infer<typeof userListQuerySchema>