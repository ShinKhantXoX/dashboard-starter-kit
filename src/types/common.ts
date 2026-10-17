export type Status = 'active' | 'inactive' | 'pending' | 'archived'

export interface BaseEntity {
  id: string
  createdAt: string
  updatedAt: string
}

export interface SelectOption<T = string> {
  label: string
  value: T
  disabled?: boolean
}

export type SortOrder = 'asc' | 'desc'

export interface SortConfig<T = string> {
  key: T
  order: SortOrder
}

export interface FileUpload {
  file: File
  preview?: string
  progress?: number
}

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}