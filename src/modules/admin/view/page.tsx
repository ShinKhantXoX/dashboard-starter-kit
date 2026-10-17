import { useNavigate, useParams } from 'react-router-dom'
import Breadcrumb from '@/components/shared/Breadcrumb'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { AdminDetail } from './components/AdminDetail'
import { useAdmin } from '@/modules/admin/hooks/useAdmins'

export default function AdminViewPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: admin, isLoading, isError } = useAdmin(id || '')

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Breadcrumb />
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
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
          <Skeleton className="h-56 w-full" />
        </div>
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
          <Button onClick={() => navigate('/admins')} className="mt-4">
            Back to Admins
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <AdminDetail
        admin={admin}
        onEdit={() => navigate(`/admins/${admin.id}/edit`)}
        onBack={() => navigate('/admins')}
      />
    </div>
  )
}
