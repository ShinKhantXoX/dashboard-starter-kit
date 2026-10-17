import { useEffect, useState } from 'react'
import { format, parseISO } from 'date-fns'
import type { DateRange } from 'react-day-picker'
import { Search, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DateRangePicker } from '@/components/ui/date-range-picker'
import { ROLE_OPTIONS } from '@/modules/admin/constants'
import type { AdminListQuery } from '@/modules/admin/types'

interface AdminToolbarProps {
  query: AdminListQuery
  /** Merge a partial change; non-page changes reset to page 1. */
  onChange: (patch: Partial<AdminListQuery>) => void
}

export function AdminToolbar({ query, onChange }: AdminToolbarProps) {
  const [searchInput, setSearchInput] = useState(query.search ?? '')

  // Debounce the search box so we don't fire a request per keystroke.
  useEffect(() => {
    const timer = setTimeout(() => {
      if ((query.search ?? '') !== searchInput) {
        onChange({ search: searchInput })
      }
    }, 350)
    return () => clearTimeout(timer)
  }, [searchInput, query.search, onChange])

  const dateRange: DateRange | undefined = query.startDate
    ? { from: parseISO(query.startDate), to: query.endDate ? parseISO(query.endDate) : undefined }
    : undefined

  const hasActiveFilters = Boolean(
    query.search || query.role || query.startDate || query.endDate
  )

  const reset = () => {
    setSearchInput('')
    onChange({ search: '', role: undefined, startDate: undefined, endDate: undefined })
  }

  return (
    <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search admins by name or email..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <DateRangePicker
          value={dateRange}
          onChange={(range) =>
            onChange({
              startDate: range?.from ? format(range.from, 'yyyy-MM-dd') : undefined,
              endDate: range?.to ? format(range.to, 'yyyy-MM-dd') : undefined,
            })
          }
          className="w-[240px]"
        />

        <Select
          value={query.role ?? 'all'}
          onValueChange={(value) => onChange({ role: value === 'all' ? undefined : value })}
        >
          <SelectTrigger className="w-[170px]">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All roles</SelectItem>
            {ROLE_OPTIONS.map((role) => (
              <SelectItem key={role} value={role}>
                {role}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={String(query.perPage ?? 10)}
          onValueChange={(value) => onChange({ perPage: Number(value) })}
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

        {hasActiveFilters && (
          <Button variant="ghost" onClick={reset}>
            <X className="mr-2 h-4 w-4" />
            Reset
          </Button>
        )}
      </div>
    </div>
  )
}

export default AdminToolbar
