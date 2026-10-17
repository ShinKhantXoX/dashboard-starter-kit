import type { RouteObject } from 'react-router-dom'
import UsersListPage from './list/page'
import UsersCreatePage from './create/page'
import UsersEditPage from './edit/page'
import UsersViewPage from './view/page'

export const usersRoutes: RouteObject[] = [
  {
    path: 'users',
    handle: { breadcrumb: 'Users' },
    children: [
      {
        index: true,
        element: <UsersListPage />,
      },
      {
        path: 'create',
        element: <UsersCreatePage />,
        handle: { breadcrumb: 'Create User' },
      },
      {
        path: ':id',
        element: <UsersViewPage />,
        handle: { breadcrumb: 'User Details' },
      },
      {
        path: ':id/edit',
        element: <UsersEditPage />,
        handle: { breadcrumb: 'Edit User' },
      },
    ],
  },
]

export default usersRoutes