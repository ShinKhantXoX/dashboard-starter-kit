import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, ArrowLeft } from 'lucide-react'
import { userCreateSchema, userUpdateSchema, type UserCreateInput, type UserUpdateInput } from '@/schemas/user.schema'
import { useCreateUser, useUpdateUser } from '@/modules/users/hooks/useUsers'
import type { User } from '@/modules/users/types'

interface UserFormProps {
  initialData?: User
  isEditing?: boolean
  onCancel?: () => void
}

export function UserForm({ initialData, isEditing = false, onCancel }: UserFormProps) {
  const navigate = useNavigate()
  const schema = isEditing ? userUpdateSchema : userCreateSchema
  const createMutation = useCreateUser()
  const updateMutation = useUpdateUser()
  const isSubmitting = isEditing ? updateMutation.isPending : createMutation.isPending

  const form = useForm<UserCreateInput | UserUpdateInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      role: 'user',
      status: 'active',
      ...(isEditing && initialData),
    },
  })

  const onSubmit = async (data: UserCreateInput | UserUpdateInput) => {
    try {
      if (isEditing && initialData) {
        await updateMutation.mutateAsync({ id: initialData.id, data })
      } else {
        await createMutation.mutateAsync(data)
      }
      navigate('/users')
    } catch (error) {
      console.error('Failed to save user:', error)
    }
  }

  const handleCancel = () => {
    onCancel?.()
    navigate('/users')
  }

  const renderNameField = () => (
    <FormField
      control={form.control}
      name="name"
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel>Name</FormLabel>
          <FormControl>
            <Input placeholder="John Doe" {...field} disabled={isSubmitting} />
          </FormControl>
          <FormMessage>{fieldState.error?.message}</FormMessage>
        </FormItem>
      )}
    />
  )

  const renderEmailField = () => (
    <FormField
      control={form.control}
      name="email"
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input type="email" placeholder="john@example.com" {...field} disabled={isSubmitting} />
          </FormControl>
          <FormMessage>{fieldState.error?.message}</FormMessage>
        </FormItem>
      )}
    />
  )

  const renderRoleField = () => (
    <FormField
      control={form.control}
      name="role"
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel>Role</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger disabled={isSubmitting}>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="admin">Administrator</SelectItem>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="viewer">Viewer</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage>{fieldState.error?.message}</FormMessage>
        </FormItem>
      )}
    />
  )

  const renderStatusField = () => (
    <FormField
      control={form.control}
      name="status"
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel>Status</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger disabled={isSubmitting}>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage>{fieldState.error?.message}</FormMessage>
        </FormItem>
      )}
    />
  )

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{isEditing ? 'Edit User' : 'Create User'}</CardTitle>
            <CardDescription>
              {isEditing
                ? 'Update the user information below.'
                : 'Fill in the details below to create a new user.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              {renderNameField()}
              {renderEmailField()}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {renderRoleField()}
              {renderStatusField()}
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
                'Update User'
              ) : (
                'Create User'
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </FormProvider>
  )
}