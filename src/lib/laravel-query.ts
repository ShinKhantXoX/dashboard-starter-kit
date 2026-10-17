import type { PaginationMeta } from '@/types/api'

/**
 * Helpers that translate the UI's list state into the query contract used by
 * the Laravel table endpoints (sortingQuery / searchQuery / paginationQuery /
 * filterQuery / filterDateQuery) and normalise the paginator response back
 * into the app's `PaginationMeta` shape.
 *
 * Request contract:
 *   ?page=1&per_page=10
 *   &order=created_at&sort=DESC
 *   &search=john&columns=name,email
 *   &start_date=2026-01-01&end_date=2026-01-31
 *   &status=active&role=ADMIN            (simple filters)
 */

export type ListFilters = Record<string, string | number | boolean | undefined | null>

export type ListParams = Record<string, string | number | boolean | undefined>

export interface ListParamsInput {
  page?: number
  perPage?: number
  search?: string
  /** Comma-separated columns the backend should search (e.g. `name,email`). */
  searchColumns?: string
  order?: string
  sort?: 'ASC' | 'DESC'
  /** `YYYY-MM-DD` */
  startDate?: string
  /** `YYYY-MM-DD` */
  endDate?: string
  filters?: ListFilters
}

/** Build the querystring params for a list endpoint, omitting empty values. */
export function buildListParams(input: ListParamsInput = {}): ListParams {
  const params: ListParams = {}
  const { page, perPage, search, searchColumns, order, sort, startDate, endDate, filters } = input

  if (page) params.page = page
  if (perPage) params.per_page = perPage

  if (search) {
    params.search = search
    if (searchColumns) params.columns = searchColumns
  }

  if (order) params.order = order
  if (sort) params.sort = sort

  if (startDate) params.start_date = startDate
  if (endDate) params.end_date = endDate

  if (filters) {
    for (const [key, value] of Object.entries(filters)) {
      if (value !== undefined && value !== null && value !== '') {
        params[key] = value
      }
    }
  }

  return params
}

/** A Laravel length-aware paginator. */
export interface LaravelPaginator<T> {
  current_page: number
  data: T[]
  last_page: number
  per_page: number
  total: number
  from?: number | null
  to?: number | null
}

export interface NormalizedPage<T> {
  data: T[]
  meta: PaginationMeta
}

function isLaravelPaginator(value: unknown): value is LaravelPaginator<unknown> {
  return (
    !!value &&
    typeof value === 'object' &&
    'data' in value &&
    'current_page' in value &&
    'last_page' in value
  )
}

function isNormalizedPage(value: unknown): value is NormalizedPage<unknown> {
  return !!value && typeof value === 'object' && 'data' in value && 'meta' in value
}

/**
 * Accepts either a raw Laravel paginator, an already-normalised `{ data, meta }`
 * page, or a plain array, and always returns `{ data, meta }`.
 */
export function normalizePaginator<T>(raw: unknown): NormalizedPage<T> {
  if (isLaravelPaginator(raw)) {
    const paginator = raw as LaravelPaginator<T>
    const rows = paginator.data ?? []
    return {
      data: rows,
      meta: {
        currentPage: Number(paginator.current_page) || 1,
        perPage: Number(paginator.per_page) || rows.length,
        total: Number(paginator.total) || rows.length,
        totalPages: Number(paginator.last_page) || 1,
      },
    }
  }

  if (isNormalizedPage(raw)) {
    return raw as NormalizedPage<T>
  }

  const data = Array.isArray(raw) ? (raw as T[]) : []
  return {
    data,
    meta: { currentPage: 1, perPage: data.length, total: data.length, totalPages: 1 },
  }
}
