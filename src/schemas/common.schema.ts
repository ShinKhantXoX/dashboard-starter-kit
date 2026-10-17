import { z } from 'zod'

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  perPage: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
})

export const idParamSchema = z.object({
  id: z.string().uuid('Invalid ID format'),
})

export type PaginationInput = z.infer<typeof paginationSchema>
export type IdParam = z.infer<typeof idParamSchema>