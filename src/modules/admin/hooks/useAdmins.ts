import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { AdminCreateInput, AdminUpdateInput } from '@/schemas/admin.schema'
import { adminService } from '../service'
import type { AdminListQuery } from '../types'

export const adminKeys = {
  all: ['admins'] as const,
  lists: () => [...adminKeys.all, 'list'] as const,
  list: (query: AdminListQuery) => [...adminKeys.lists(), query] as const,
  details: () => [...adminKeys.all, 'detail'] as const,
  detail: (id: string) => [...adminKeys.details(), id] as const,
}

export function useAdmins(query: AdminListQuery) {
  return useQuery({
    queryKey: adminKeys.list(query),
    queryFn: () => adminService.getAdmins(query),
    placeholderData: (previousData) => previousData,
  })
}

export function useAdmin(id: string) {
  return useQuery({
    queryKey: adminKeys.detail(id),
    queryFn: () => adminService.getAdmin(id),
    enabled: !!id,
  })
}

export function useCreateAdmin() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: AdminCreateInput) => adminService.createAdmin(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.lists() })
    },
  })
}

export function useUpdateAdmin() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: AdminUpdateInput }) =>
      adminService.updateAdmin(id, data),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.lists() })
      queryClient.setQueryData(adminKeys.detail(updated.id), updated)
    },
  })
}

export function useDeleteAdmin() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => adminService.deleteAdmin(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.lists() })
    },
  })
}
