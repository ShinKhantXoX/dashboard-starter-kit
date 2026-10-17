import { Outlet, type RouteObject } from 'react-router-dom'
import { RequireAbility } from '@/components/layout/RequireAbility'
import AdminListPage from './list/page'
import AdminCreatePage from './create/page'
import AdminEditPage from './edit/page'
import AdminViewPage from './view/page'

export const adminRoutes: RouteObject[] = [
  {
    path: 'admins',
    handle: { breadcrumb: 'Admins' },
    element: (
      <RequireAbility action="manage" subject="Admin">
        <Outlet />
      </RequireAbility>
    ),
    children: [
      {
        index: true,
        element: <AdminListPage />,
      },
      {
        path: 'create',
        element: <AdminCreatePage />,
        handle: { breadcrumb: 'Create Admin' },
      },
      {
        path: ':id',
        element: <AdminViewPage />,
        handle: { breadcrumb: 'Admin Details' },
      },
      {
        path: ':id/edit',
        element: <AdminEditPage />,
        handle: { breadcrumb: 'Edit Admin' },
      },
    ],
  },
]

export default adminRoutes
