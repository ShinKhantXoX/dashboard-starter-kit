import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Home, ShieldAlert } from 'lucide-react'

export default function ForbiddenPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center px-4">
      <ShieldAlert className="h-16 w-16 text-destructive/50 mb-6" />
      <h1 className="text-6xl font-bold tracking-tight">403</h1>
      <h2 className="mt-4 text-2xl font-semibold">Access Denied</h2>
      <p className="mt-2 text-muted-foreground max-w-md">
        You don't have permission to view this page. If you believe this is a mistake,
        contact your administrator.
      </p>
      <div className="mt-6">
        <Button asChild>
          <Link to="/users">
            <Home className="mr-2 h-4 w-4" />
            Go to Dashboard
          </Link>
        </Button>
      </div>
    </div>
  )
}
