import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { cn } from '@/lib/utils'
import type { PaginationMeta } from '@/types/api'

interface DataTablePaginationProps {
  meta: PaginationMeta
  onPageChange: (page: number) => void
  className?: string
}

/** Page numbers to render, collapsing long ranges with ellipses. */
function getVisiblePages(currentPage: number, totalPages: number): number[] {
  return Array.from({ length: totalPages }, (_, i) => i + 1).filter((page) => {
    if (totalPages <= 7) return true
    if (page <= 2) return true
    if (page >= totalPages - 1) return true
    if (page >= currentPage - 1 && page <= currentPage + 1) return true
    return false
  })
}

export function DataTablePagination({ meta, onPageChange, className }: DataTablePaginationProps) {
  const { currentPage, totalPages } = meta

  if (totalPages <= 1) return null

  return (
    <Pagination className={cn(className)}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault()
              if (currentPage > 1) onPageChange(currentPage - 1)
            }}
            className={currentPage === 1 ? 'pointer-events-none opacity-50' : undefined}
          />
        </PaginationItem>

        {getVisiblePages(currentPage, totalPages).map((page, index, array) => {
          const prevPage = array[index - 1]
          if (prevPage && page - prevPage > 1) {
            return (
              <PaginationItem key={`ellipsis-${page}`}>
                <PaginationEllipsis />
              </PaginationItem>
            )
          }
          return (
            <PaginationItem key={page}>
              <PaginationLink
                href="#"
                isActive={page === currentPage}
                onClick={(e) => {
                  e.preventDefault()
                  onPageChange(page)
                }}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          )
        })}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault()
              if (currentPage < totalPages) onPageChange(currentPage + 1)
            }}
            className={currentPage === totalPages ? 'pointer-events-none opacity-50' : undefined}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

export default DataTablePagination
