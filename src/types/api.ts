export interface ApiError {
  message: string
  status: number
  errors?: Record<string, string[]>
}

export interface ApiResponse<T> {
  data: T | null
  error: ApiError | null
}

/** Laravel envelope: { status, data, message } */
export interface ApiEnvelope<T> {
  status: number
  data: T
  message: string
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: PaginationMeta
}

export interface PaginationMeta {
  currentPage: number
  perPage: number
  total: number
  totalPages: number
}

export interface PaginationParams {
  page?: number
  perPage?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}