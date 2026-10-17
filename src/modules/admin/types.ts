export interface Admin {
  id: string
  name: string
  email: string
  roles: string[]
  permissions: string[]
  createdAt: string | null
  updatedAt: string | null
}

/**
 * UI list state. Translated into the Laravel query contract
 * (`page`, `per_page`, `search`, `columns`, `order`, `sort`,
 * `start_date`, `end_date`, + filters) by `buildListParams`.
 */
export interface AdminListQuery {
  page: number
  perPage: number
  search: string
  order: string
  sort: 'ASC' | 'DESC'
  /** `YYYY-MM-DD` */
  startDate?: string
  /** `YYYY-MM-DD` */
  endDate?: string
  /** Simple filter, sent as `?role=...`. */
  role?: string
}
