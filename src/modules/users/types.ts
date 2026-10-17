export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'user' | 'viewer'
  status: 'active' | 'inactive'
  createdAt: string
  updatedAt: string
}

export interface UserCreateInput {
  name: string
  email: string
  role: 'admin' | 'user' | 'viewer'
  status: 'active' | 'inactive'
}

export interface UserUpdateInput {
  name: string
  email: string
  role: 'admin' | 'user' | 'viewer'
  status: 'active' | 'inactive'
}

export interface UserListQuery {
  page?: number
  perPage?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface UserListResponse {
  data: User[]
  meta: {
    currentPage: number
    perPage: number
    total: number
    totalPages: number
  }
}