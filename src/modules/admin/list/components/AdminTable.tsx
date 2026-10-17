import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ArrowDown, ArrowUp, ArrowUpDown, Edit, Eye, MoreHorizontal, Trash2 } from 'lucide-react'
import { cn, formatDate } from '@/lib/utils'
import type { Admin } from '@/modules/admin/types'

interface AdminTableProps {
  admins: Admin[]
  order: string
  sort: 'ASC' | 'DESC'
  onSortChange: (column: string) => void
  onView: (admin: Admin) => void
  onEdit: (admin: Admin) => void
  onDelete: (admin: Admin) => void
}

function SortableHead({
  label,
  column,
  order,
  sort,
  onSortChange,
  className,
}: {
  label: string
  column: string
  order: string
  sort: 'ASC' | 'DESC'
  onSortChange: (column: string) => void
  className?: string
}) {
  const active = order === column
  const Icon = active ? (sort === 'ASC' ? ArrowUp : ArrowDown) : ArrowUpDown

  return (
    <TableHead className={className}>
      <button
        type="button"
        onClick={() => onSortChange(column)}
        className={cn(
          'inline-flex items-center gap-1 text-sm font-medium transition-colors hover:text-foreground',
          active ? 'text-foreground' : 'text-muted-foreground'
        )}
      >
        {label}
        <Icon className="h-3.5 w-3.5" />
      </button>
    </TableHead>
  )
}

function RoleBadges({ roles }: { roles: string[] }) {
  if (!roles || roles.length === 0) {
    return <span className="text-muted-foreground">—</span>
  }

  return (
    <div className="flex flex-wrap gap-1">
      {roles.map((role) => (
        <Badge
          key={role}
          variant={role === 'SUPER_ADMIN' ? 'default' : role === 'ADMIN' ? 'secondary' : 'outline'}
        >
          {role}
        </Badge>
      ))}
    </div>
  )
}

export function AdminTable({
  admins,
  order,
  sort,
  onSortChange,
  onView,
  onEdit,
  onDelete,
}: AdminTableProps) {
  if (admins.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No admins found</p>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="border-b">
            <TableHead className="w-[40px]"></TableHead>
            <SortableHead label="Name" column="name" order={order} sort={sort} onSortChange={onSortChange} />
            <SortableHead label="Email" column="email" order={order} sort={sort} onSortChange={onSortChange} />
            <TableHead>Roles</TableHead>
            <SortableHead
              label="Created"
              column="created_at"
              order={order}
              sort={sort}
              onSortChange={onSortChange}
              className="text-right"
            />
            <TableHead className="w-[100px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {admins.map((admin) => (
            <TableRow key={admin.id} className="border-b transition-colors hover:bg-muted/50">
              <TableCell>
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                  {(admin.name || admin.email).charAt(0).toUpperCase()}
                </div>
              </TableCell>
              <TableCell className="font-medium">{admin.name || '—'}</TableCell>
              <TableCell>{admin.email}</TableCell>
              <TableCell>
                <RoleBadges roles={admin.roles} />
              </TableCell>
              <TableCell className="text-right text-sm text-muted-foreground">
                {admin.createdAt ? formatDate(admin.createdAt) : '—'}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onView(admin)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(admin)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDelete(admin)}
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

export default AdminTable
