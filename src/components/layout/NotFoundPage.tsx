import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Home, Search, AlertCircle } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center px-4">
      <AlertCircle className="h-16 w-16 text-destructive/50 mb-6" />
      <h1 className="text-6xl font-bold tracking-tight">404</h1>
      <h2 className="mt-4 text-2xl font-semibold">Page Not Found</h2>
      <p className="mt-2 text-muted-foreground max-w-md">
        Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
      </p>
      <div className="mt-6 flex gap-4">
        <Button asChild>
          <Link to="/users">
            <Home className="mr-2 h-4 w-4" />
            Go to Dashboard
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/">
            <Search className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </div>
    </div>
  )
}