import { UserForm } from './components/UserForm'

export default function UsersCreatePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create User</h1>
        <p className="text-muted-foreground">Add a new user to the system</p>
      </div>
      <UserForm isEditing={false} />
    </div>
  )
}