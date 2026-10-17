import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MoreHorizontal, Edit, Trash2, Eye } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { formatDate } from '@/lib/utils'
import type { User } from '@/modules/users/types'

interface UserTableProps {
  users: User[]
  onEdit: (user: User) => void
  onView: (user: User) => void
  onDelete: (user: User) => void
}

function StatusBadge({ status }: { status: User['status'] }) {
  return (
    <Badge variant={status === 'active' ? 'default' : 'secondary'}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  )
}

function RoleBadge({ role }: { role: User['role'] }) {
  const variants: Record<User['role'], 'default' | 'secondary' | 'outline'> = {
    admin: 'default',
    user: 'secondary',
    viewer: 'outline',
  }
  return <Badge variant={variants[role]}>{role.charAt(0).toUpperCase() + role.slice(1)}</Badge>
}

export function UserTable({ users, onEdit, onView, onDelete }: UserTableProps) {
  if (users.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No users found</p>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="border-b">
            <TableHead className="w-[40px]"></TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Created</TableHead>
            <TableHead className="w-[100px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id} className="border-b transition-colors hover:bg-muted/50">
              <TableCell>
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              </TableCell>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell><RoleBadge role={user.role} /></TableCell>
              <TableCell><StatusBadge status={user.status} /></TableCell>
              <TableCell className="text-right text-sm text-muted-foreground">
                {formatDate(user.createdAt)}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onView(user)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(user)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDelete(user)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}