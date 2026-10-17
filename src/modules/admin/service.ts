import { httpClient } from '@/lib/http-client'
import { ENDPOINTS } from '@/lib/endpoints'
import {
  buildListParams,
  normalizePaginator,
  type NormalizedPage,
} from '@/lib/laravel-query'
import type { AdminCreateInput, AdminUpdateInput } from '@/schemas/admin.schema'
import type { Admin, AdminListQuery } from './types'

/**
 * Raw record as returned by the Laravel admin API. Field names are tolerated
 * in both snake_case and camelCase, and roles/permissions are both optional so
 * the mapper keeps working if the resource shape changes slightly.
 */
interface AdminResource {
  id: string | number
  name?: string | null
  email: string
  roles?: string[] | null
  permissions?: string[] | null
  created_at?: string | null
  updated_at?: string | null
  createdAt?: string | null
  updatedAt?: string | null
}

function mapAdmin(raw: AdminResource): Admin {
  return {
    id: String(raw.id),
    name: raw.name ?? '',
    email: raw.email,
    roles: raw.roles ?? [],
    permissions: raw.permissions ?? [],
    createdAt: raw.createdAt ?? raw.created_at ?? null,
    updatedAt: raw.updatedAt ?? raw.updated_at ?? null,
  }
}

export const adminService = {
  async getAdmins(query: AdminListQuery): Promise<NormalizedPage<Admin>> {
    const params = buildListParams({
      page: query.page,
      perPage: query.perPage,
      search: query.search,
      searchColumns: 'name,email',
      order: query.order,
      sort: query.sort,
      startDate: query.startDate,
      endDate: query.endDate,
      filters: { role: query.role },
    })

    const response = await httpClient.get<unknown>(ENDPOINTS.admins.list, params)
    if (response.error) throw new Error(response.error.message)

    const page = normalizePaginator<AdminResource>(response.data)
    return { data: page.data.map(mapAdmin), meta: page.meta }
  },

  async getAdmin(id: string): Promise<Admin> {
    const response = await httpClient.get<AdminResource>(ENDPOINTS.admins.detail(id))
    if (response.error) throw new Error(response.error.message)
    if (!response.data) throw new Error('Admin not found')
    return mapAdmin(response.data)
  },

  async createAdmin(data: AdminCreateInput): Promise<Admin> {
    const response = await httpClient.post<AdminResource>(ENDPOINTS.admins.list, data)
    if (response.error) throw new Error(response.error.message)
    if (!response.data) throw new Error('Failed to create admin')
    return mapAdmin(response.data)
  },

  async updateAdmin(id: string, data: AdminUpdateInput): Promise<Admin> {
    const response = await httpClient.put<AdminResource>(ENDPOINTS.admins.detail(id), data)
    if (response.error) throw new Error(response.error.message)
    if (!response.data) throw new Error('Failed to update admin')
    return mapAdmin(response.data)
  },

  async deleteAdmin(id: string): Promise<void> {
    const response = await httpClient.delete<void>(ENDPOINTS.admins.detail(id))
    if (response.error) throw new Error(response.error.message)
  },
}

export default adminService
