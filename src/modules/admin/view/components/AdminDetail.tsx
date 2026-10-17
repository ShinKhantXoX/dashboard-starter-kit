import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { formatDateTime } from '@/lib/utils'
import { ArrowLeft, Calendar, Edit2, KeyRound, Mail, Shield } from 'lucide-react'
import type { Admin } from '@/modules/admin/types'

interface AdminDetailProps {
  admin: Admin
  onEdit: () => void
  onBack: () => void
}

export function AdminDetail({ admin, onEdit, onBack }: AdminDetailProps) {
  const displayName = admin.name || admin.email
  const initials = displayName.charAt(0).toUpperCase()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{displayName}</h1>
          <p className="text-muted-foreground">Admin details and access</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button onClick={onEdit}>
            <Edit2 className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold">
                  {initials}
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{admin.name || '—'}</h3>
                  <p className="text-muted-foreground">{admin.email}</p>
                </div>
              </div>
              <Separator />
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-sm text-muted-foreground">Email</label>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{admin.email}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-sm text-muted-foreground">Roles</label>
                  <div className="flex flex-wrap items-center gap-2">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    {admin.roles.length > 0 ? (
                      admin.roles.map((role) => (
                        <Badge
                          key={role}
                          variant={
                            role === 'SUPER_ADMIN'
                              ? 'default'
                              : role === 'ADMIN'
                                ? 'secondary'
                                : 'outline'
                          }
                        >
                          {role}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Permissions</CardTitle>
            </CardHeader>
            <CardContent>
              {admin.permissions.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {admin.permissions.map((permission) => (
                    <Badge key={permission} variant="outline" className="font-mono text-xs">
                      <KeyRound className="mr-1 h-3 w-3" />
                      {permission}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">No explicit permissions.</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground">Admin ID</label>
                <p className="font-mono text-sm break-all">{admin.id}</p>
              </div>
              <Separator />
              <div className="space-y-1">
                <label className="text-sm text-muted-foreground">Created</label>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{admin.createdAt ? formatDateTime(admin.createdAt) : '—'}</span>
                </div>
              </div>
              <Separator />
              <div>
                <label className="text-sm text-muted-foreground">Last Updated</label>
                <p>{admin.updatedAt ? formatDateTime(admin.updatedAt) : '—'}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default AdminDetail
