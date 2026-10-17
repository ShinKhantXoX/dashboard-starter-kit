import { useForm, FormProvider, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { ArrowLeft, Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { adminCreateSchema, adminUpdateSchema, type AdminFormValues } from '@/schemas/admin.schema'
import { useCreateAdmin, useUpdateAdmin } from '@/modules/admin/hooks/useAdmins'
import { PERMISSION_OPTIONS, ROLE_OPTIONS } from '@/modules/admin/constants'
import type { Admin } from '@/modules/admin/types'

interface AdminFormProps {
  admin?: Admin
  isEditing?: boolean
  onCancel?: () => void
}

export function AdminForm({ admin, isEditing = false, onCancel }: AdminFormProps) {
  const navigate = useNavigate()
  const createMutation = useCreateAdmin()
  const updateMutation = useUpdateAdmin()
  const isSubmitting = isEditing ? updateMutation.isPending : createMutation.isPending

  const resolver = zodResolver(
    isEditing ? adminUpdateSchema : adminCreateSchema
  ) as Resolver<AdminFormValues>

  const form = useForm<AdminFormValues>({
    resolver,
    defaultValues: {
      name: admin?.name ?? '',
      email: admin?.email ?? '',
      password: '',
      roles: admin?.roles ?? ['ADMIN'],
      permissions: admin?.permissions ?? [],
    },
  })

  const onSubmit = async (values: AdminFormValues) => {
    try {
      if (isEditing && admin) {
        await updateMutation.mutateAsync({
          id: admin.id,
          data: { ...values, password: values.password || undefined },
        })
        toast.success('Admin updated successfully')
      } else {
        await createMutation.mutateAsync({ ...values, password: values.password ?? '' })
        toast.success('Admin created successfully')
      }
      navigate('/admins')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save admin')
    }
  }

  const handleCancel = () => {
    onCancel?.()
    navigate('/admins')
  }

  const renderCheckboxGroup = (name: 'roles' | 'permissions', options: readonly string[]) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field, fieldState }) => {
        const selected = field.value ?? []
        return (
          <FormItem>
            <FormLabel>{name === 'roles' ? 'Roles' : 'Permissions'}</FormLabel>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {options.map((option) => {
                const checked = selected.includes(option)
                return (
                  <label key={option} className="flex items-center gap-2 text-sm capitalize">
                    <Checkbox
                      checked={checked}
                      disabled={isSubmitting}
                      onCheckedChange={(value) => {
                        const next = value
                          ? [...selected, option]
                          : selected.filter((item) => item !== option)
                        field.onChange(next)
                      }}
                    />
                    {option.replace(/_/g, ' ').toLowerCase()}
                  </label>
                )
              })}
            </div>
            <FormMessage>{fieldState.error?.message}</FormMessage>
          </FormItem>
        )
      }}
    />
  )

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{isEditing ? 'Edit Admin' : 'Create Admin'}</CardTitle>
            <CardDescription>
              {isEditing
                ? 'Update the admin information, roles and permissions below.'
                : 'Fill in the details below to create a new admin.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Jane Doe" {...field} disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage>{fieldState.error?.message}</FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="jane@example.com"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage>{fieldState.error?.message}</FormMessage>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="password"
              render={({ field, fieldState }) => (
                <FormItem className="sm:max-w-sm">
                  <FormLabel>{isEditing ? 'New Password' : 'Password'}</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      autoComplete="new-password"
                      placeholder={
                        isEditing ? 'Leave blank to keep the current password' : '••••••••'
                      }
                      {...field}
                      value={field.value ?? ''}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage>{fieldState.error?.message}</FormMessage>
                </FormItem>
              )}
            />

            <div className="grid gap-6 sm:grid-cols-2">
              {renderCheckboxGroup('roles', ROLE_OPTIONS)}
              {renderCheckboxGroup('permissions', PERMISSION_OPTIONS)}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row sm:justify-end gap-2">
            <Button type="button" variant="outline" onClick={handleCancel} disabled={isSubmitting}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : isEditing ? (
                'Update Admin'
              ) : (
                'Create Admin'
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </FormProvider>
  )
}

export default AdminForm
