import { useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, useLocation, Navigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Loader2, Eye, EyeOff } from 'lucide-react'
import { loginSchema, type LoginInput } from '@/schemas/auth.schema'
import { useAuthStore } from '@/stores/auth.store'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, isSubmitting, isAuthenticated } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const rawFrom = (location.state as { from?: Location })?.from?.pathname
  // Never restore to /login (guaranteed loop) or /403.
  const from = rawFrom && rawFrom !== '/login' && rawFrom !== '/403' ? rawFrom : '/users'

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  })

  if (isAuthenticated) {
    return <Navigate to={from} replace />
  }

  const onSubmit = async (data: LoginInput) => {
    setError(null)
    try {
      await login(data)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    }
  }

  const renderEmailField = () => (
    <FormField
      control={form.control}
      name="email"
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input placeholder="you@example.com" type="email" {...field} disabled={isSubmitting} />
          </FormControl>
          <FormMessage>{fieldState.error?.message}</FormMessage>
        </FormItem>
      )}
    />
  )

  const renderPasswordField = () => (
    <FormField
      control={form.control}
      name="password"
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel>Password</FormLabel>
          <div className="relative">
            <FormControl>
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="pr-10"
                {...field}
                disabled={isSubmitting}
              />
            </FormControl>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setShowPassword((value) => !value)}
              disabled={isSubmitting}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground hover:bg-transparent hover:text-foreground"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
          <FormMessage>{fieldState.error?.message}</FormMessage>
        </FormItem>
      )}
    />
  )

  const renderRememberMeField = () => (
    <FormField
      control={form.control}
      name="rememberMe"
      render={({ field }) => (
        <FormItem className="flex items-center space-x-2">
          <FormControl>
            <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={isSubmitting} />
          </FormControl>
          <FormLabel className="cursor-pointer">Remember me</FormLabel>
        </FormItem>
      )}
    />
  )

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Sign in</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access the dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {renderEmailField()}
              {renderPasswordField()}
              {renderRememberMeField()}

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign in'
                )}
              </Button>
            </form>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  )
}