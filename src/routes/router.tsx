import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from '@/components/ui/sonner'
import { queryClient } from '@/lib/query-client'
import { usersRoutes } from '@/modules/users/route'
import { authRoutes } from '@/modules/auth/route'
import { adminRoutes } from '@/modules/admin/route'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { ProtectedRoute } from '@/components/layout/ProtectedRoute'
import NotFoundPage from '@/components/layout/NotFoundPage'
import ForbiddenPage from '@/components/layout/ForbiddenPage'
import { useAuthStore } from '@/stores/auth.store'
import { useEffect } from 'react'

// Created ONCE at module scope. Never recreate it on render, otherwise
// in-flight navigations target a detached router and the UI gets stuck.
const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/users" replace />,
  },
  ...authRoutes,
  {
    path: '/403',
    element: <ForbiddenPage />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    handle: { breadcrumb: 'Dashboard' },
    children: [...usersRoutes, ...adminRoutes],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])

function AppRoutes() {
  const isLoading = useAuthStore((state) => state.isLoading)
  const initialize = useAuthStore((state) => state.initialize)

  useEffect(() => {
    initialize()
  }, [initialize])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster position="top-right" />
    </QueryClientProvider>
  )
}

export default AppRoutes