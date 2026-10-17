import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2, Plus, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import Breadcrumb from '@/components/shared/Breadcrumb'
import { DataTablePagination } from '@/components/shared/DataTablePagination'
import { AdminTable } from './components/AdminTable'
import { AdminToolbar } from './components/AdminToolbar'
import { useAdmins, useDeleteAdmin } from '@/modules/admin/hooks/useAdmins'
import type { Admin, AdminListQuery } from '@/modules/admin/types'

const DEFAULT_QUERY: AdminListQuery = {
  page: 1,
  perPage: 10,
  search: '',
  order: 'created_at',
  sort: 'DESC',
}

export default function AdminListPage() {
  const navigate = useNavigate()
  const [query, setQuery] = useState<AdminListQuery>(DEFAULT_QUERY)

  const { data, isLoading, isFetching, isError, error, refetch } = useAdmins(query)
  const deleteAdminMutation = useDeleteAdmin()

  /** Patch the query; any change other than `page` resets to the first page. */
  const handleQueryChange = useCallback((patch: Partial<AdminListQuery>) => {
    setQuery((prev) => ({
      ...prev,
      ...patch,
      ...(patch.page === undefined ? { page: 1 } : {}),
    }))
  }, [])

  const handleSortChange = useCallback((column: string) => {
    setQuery((prev) =>
      prev.order === column
        ? { ...prev, sort: prev.sort === 'ASC' ? 'DESC' : 'ASC', page: 1 }
        : { ...prev, order: column, sort: 'ASC', page: 1 }
    )
  }, [])

  const handleView = useCallback(
    (admin: Admin) => navigate(`/admins/${admin.id}`),
    [navigate]
  )
  const handleEdit = useCallback(
    (admin: Admin) => navigate(`/admins/${admin.id}/edit`),
    [navigate]
  )

  const handleDelete = useCallback(
    (admin: Admin) => {
      if (!window.confirm(`Are you sure you want to delete ${admin.name || admin.email}?`)) return
      deleteAdminMutation.mutate(admin.id, {
        onSuccess: () => toast.success('Admin deleted'),
        onError: (err) =>
          toast.error(err instanceof Error ? err.message : 'Failed to delete admin'),
      })
    },
    [deleteAdminMutation]
  )

  const admins = data?.data ?? []

  return (
    <div className="space-y-6">
      <Breadcrumb />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admins</h1>
          <p className="text-muted-foreground">Manage admin accounts, roles and permissions</p>
        </div>
        <Button onClick={() => navigate('/admins/create')}>
          <Plus className="mr-2 h-4 w-4" />
          Add Admin
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle>All Admins</CardTitle>
          {isFetching && !isLoading && (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <AdminToolbar query={query} onChange={handleQueryChange} />

          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/3" />
                  </div>
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-24" />
                </div>
              ))}
            </div>
          ) : isError ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Couldn&apos;t load admins</AlertTitle>
              <AlertDescription>
                <p>{error instanceof Error ? error.message : 'Unknown error'}</p>
                <p className="mt-1 text-xs opacity-80">
                  A 401 here usually means the API session failed or the endpoint is
                  not permitted — it no longer signs you out.
                </p>
                <Button variant="outline" size="sm" onClick={() => refetch()} className="mt-3">
                  <Loader2 className="mr-2 h-4 w-4" />
                  Retry
                </Button>
              </AlertDescription>
            </Alert>
          ) : (
            <>
              <AdminTable
                admins={admins}
                order={query.order}
                sort={query.sort}
                onSortChange={handleSortChange}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
              {data && data.meta.total > 0 && (
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-muted-foreground">
                    Showing {admins.length} of {data.meta.total} admins
                  </p>
                  <DataTablePagination
                    meta={data.meta}
                    onPageChange={(page) => handleQueryChange({ page })}
                    className="mx-0 w-auto sm:justify-end"
                  />
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
