import Breadcrumb from '@/components/shared/Breadcrumb'
import { AdminForm } from './components/AdminForm'

export default function AdminCreatePage() {
  return (
    <div className="space-y-6">
      <Breadcrumb />
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Admin</h1>
        <p className="text-muted-foreground">Add a new admin to the system</p>
      </div>
      <AdminForm isEditing={false} />
    </div>
  )
}
