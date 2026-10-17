import { useParams } from 'react-router-dom'
import { UserForm } from '../create/components/UserForm'
import { useUser } from '@/modules/users/hooks/useUsers'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'

export default function UsersEditPage() {
  const { id } = useParams<{ id: string }>()
  const { data: user, isLoading, isError } = useUser(id || '')

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isError || !user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-destructive">User not found</h2>
        <p className="text-muted-foreground mt-2">The user you're looking for doesn't exist or has been removed.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit User</h1>
        <p className="text-muted-foreground">Update user information</p>
      </div>
      <UserForm initialData={user} isEditing={true} />
    </div>
  )
}