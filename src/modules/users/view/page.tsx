import { useParams, useNavigate } from 'react-router-dom'
import { UserDetail } from './components/UserDetail'
import { useUser } from '@/modules/users/hooks/useUsers'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'

export default function UsersViewPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: user, isLoading, isError } = useUser(id || '')

  const handleEdit = () => {
    navigate(`/users/${id}/edit`)
  }

  const handleBack = () => {
    navigate('/users')
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64 mt-2" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="space-y-4">
              <Skeleton className="h-40 w-full" />
            </div>
          </div>
          <div className="space-y-6">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (isError || !user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-destructive">User not found</h2>
        <p className="text-muted-foreground mt-2">The user you're looking for doesn't exist or has been removed.</p>
        <Button onClick={handleBack} className="mt-4">
          Back to Users
        </Button>
      </div>
    )
  }

  return (
    <UserDetail user={user} onEdit={handleEdit} onBack={handleBack} />
  )
}