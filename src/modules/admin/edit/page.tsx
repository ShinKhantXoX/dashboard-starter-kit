import { useParams } from 'react-router-dom'
import Breadcrumb from '@/components/shared/Breadcrumb'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'
import { AdminForm } from '../create/components/AdminForm'
import { useAdmin } from '@/modules/admin/hooks/useAdmins'

export default function AdminEditPage() {
  const { id } = useParams<{ id: string }>()
  const { data: admin, isLoading, isError } = useAdmin(id || '')

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Breadcrumb />
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
              <Skeleton className="h-10 w-full max-w-sm" />
              <Skeleton className="h-24 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isError || !admin) {
    return (
      <div className="space-y-6">
        <Breadcrumb />
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-destructive">Admin not found</h2>
          <p className="text-muted-foreground mt-2">
            The admin you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Admin</h1>
        <p className="text-muted-foreground">Update admin information and access</p>
      </div>
      <AdminForm admin={admin} isEditing />
    </div>
  )
}
