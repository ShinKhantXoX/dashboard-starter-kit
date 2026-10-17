import { z } from 'zod'

export const adminCreateSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be at most 100 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  roles: z.array(z.string()).min(1, 'Select at least one role'),
  permissions: z.array(z.string()),
})

export const adminUpdateSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be at most 100 characters'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .optional()
    .or(z.literal('')),
  roles: z.array(z.string()).min(1, 'Select at least one role'),
  permissions: z.array(z.string()),
})

export type AdminCreateInput = z.infer<typeof adminCreateSchema>
export type AdminUpdateInput = z.infer<typeof adminUpdateSchema>
/** Form values (password optional so the same form serves create + edit). */
export type AdminFormValues = z.infer<typeof adminUpdateSchema>
