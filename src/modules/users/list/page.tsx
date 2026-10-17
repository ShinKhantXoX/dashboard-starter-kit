import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { UserTable } from './components/UserTable'
import { UserSearch } from './components/UserSearch'
import { UsersPagination } from './components/UsersPagination'
import { useUsers, useDeleteUser } from '@/modules/users/hooks/useUsers'
import type { UserListQuery } from '@/modules/users/types'
import Breadcrumb from '@/components/shared/Breadcrumb'

export default function UsersListPage() {
  const navigate = useNavigate()
  const [query, setQuery] = useState<UserListQuery>({
    page: 1,
    perPage: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  })

  const { data, isLoading, isError, error, refetch } = useUsers(query)
  const deleteUserMutation = useDeleteUser()

  const handleQueryChange = useCallback((newQuery: UserListQuery) => {
    setQuery(newQuery)
  }, [])

  const handleEdit = useCallback((user: { id: string }) => {
    navigate(`/users/${user.id}/edit`)
  }, [navigate])

  const handleView = useCallback((user: { id: string }) => {
    navigate(`/users/${user.id}`)
  }, [navigate])

  const handleDelete = useCallback((user: { id: string; name: string }) => {
    if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
      deleteUserMutation.mutate(user.id)
    }
  }, [deleteUserMutation])

  const handleCreate = () => {
    navigate('/users/create')
  }

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">Manage user accounts and permissions</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <UserSearch initialQuery={query} onQueryChange={handleQueryChange} />

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
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-24" />
                </div>
              ))}
            </div>
          ) : isError ? (
            <div className="text-center py-8 text-destructive">
              <p>Failed to load users: {error instanceof Error ? error.message : 'Unknown error'}</p>
              <Button variant="outline" onClick={() => refetch()} className="mt-4">
                <Loader2 className="mr-2 h-4 w-4" />
                Retry
              </Button>
            </div>
          ) : (
            <>
              <UserTable
                users={data?.data || []}
                onEdit={handleEdit}
                onView={handleView}
                onDelete={handleDelete}
              />
              {data && <UsersPagination meta={data.meta} onPageChange={(page) => setQuery((q) => ({ ...q, page }))} />}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}