import { useCallback } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Filter } from 'lucide-react'
import type { UserListQuery } from '@/modules/users/types'

export function UserSearch({
  initialQuery,
  onQueryChange,
}: {
  initialQuery?: UserListQuery
  onQueryChange: (query: UserListQuery) => void
}) {
  const handleSearchChange = useCallback(
    (value: string) => {
      onQueryChange({ ...initialQuery, search: value || undefined, page: 1 })
    },
    [initialQuery, onQueryChange]
  )

  const handleSortChange = useCallback(
    (value: string) => {
      onQueryChange({ ...initialQuery, sortBy: value || 'name', sortOrder: 'asc', page: 1 })
    },
    [initialQuery, onQueryChange]
  )

  const handlePerPageChange = useCallback(
    (value: string) => {
      onQueryChange({ ...initialQuery, perPage: Number(value), page: 1 })
    },
    [initialQuery, onQueryChange]
  )

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search users..."
          value={initialQuery?.search || ''}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="flex items-center gap-2">
        <Select
          value={String(initialQuery?.perPage || 10)}
          onValueChange={handlePerPageChange}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Per page" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5 per page</SelectItem>
            <SelectItem value="10">10 per page</SelectItem>
            <SelectItem value="25">25 per page</SelectItem>
            <SelectItem value="50">50 per page</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={initialQuery?.sortBy || ''}
          onValueChange={handleSortChange}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="role">Role</SelectItem>
            <SelectItem value="status">Status</SelectItem>
            <SelectItem value="createdAt">Created</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" size="icon" className="hidden sm:flex">
          <Filter className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}