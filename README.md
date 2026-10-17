# Dashboard Starter Kit

A production-ready, reusable React dashboard starter kit with a clean, scalable, feature-based architecture.

## Tech Stack

- **React 19** with TypeScript
- **Vite** as the development and build tool
- **React Router DOM v7** for client-side routing
- **TanStack Query v5** for server state management
- **Zustand** for global client state management
- **Zod** for schema validation
- **React Hook Form** with `@hookform/resolvers/zod` for form handling
- **shadcn/ui** (Radix UI primitives) for accessible UI components
- **Tailwind CSS v4** for styling
- **Lucide React** for icons
- **Native Fetch API** for HTTP requests

## Project Structure

```
src/
├── assets/                 # Static assets
├── components/
│   ├── ui/                 # shadcn/ui components (generated)
│   ├── layout/             # Dashboard layout components
│   │   ├── Sidebar.tsx     # Responsive sidebar navigation
│   │   ├── Header.tsx      # Top header with breadcrumbs & user menu
│   │   ├── DashboardLayout.tsx # Main layout wrapper
│   │   ├── ProtectedRoute.tsx  # Auth guard for protected routes
│   │   └── NotFoundPage.tsx    # 404 page
│   ├── providers/          # Context providers
│   │   ├── ThemeProvider.tsx   # Light/dark/system theme
│   │   └── SidebarProvider.tsx # Sidebar state
│   └── shared/             # Truly shared components
├── modules/                # Feature modules (each owns its logic)
│   ├── auth/               # Authentication module
│   │   ├── pages/
│   │   │   └── LoginPage.tsx
│   │   ├── route.tsx       # /login route
│   │   ├── service.ts      # Auth API calls
│   │   └── types.ts        # Auth types
│   ├── users/              # Users CRUD module (complete example)
│   │   ├── list/           # User list page
│   │   │   ├── page.tsx
│   │   │   └── components/
│   │   │       ├── UserTable.tsx
│   │   │       ├── UserSearch.tsx
│   │   │       └── UsersPagination.tsx
│   │   ├── create/         # Create user page
│   │   │   ├── page.tsx
│   │   │   └── components/UserForm.tsx
│   │   ├── edit/           # Edit user page
│   │   │   ├── page.tsx
│   │   │   └── components/UserForm.tsx (shared)
│   │   ├── view/           # View user details
│   │   │   ├── page.tsx
│   │   │   └── components/UserDetail.tsx
│   │   ├── hooks/          # TanStack Query hooks
│   │   │   └── useUsers.ts
│   │   ├── route.tsx       # User routes
│   │   ├── service.ts      # Users API (mock implementation)
│   │   └── types.ts        # User types
│   └── admin/              # Admin module (skeleton)
│       ├── route.tsx
│       ├── service.ts
│       └── types.ts
├── routes/                 # Main router configuration
│   ├── index.tsx
│   └── router.tsx
├── schemas/                # Zod validation schemas
│   ├── user.schema.ts
│   ├── auth.schema.ts
│   └── common.schema.ts
├── stores/                 # Zustand stores
│   ├── auth.store.ts       # Authentication state
│   ├── sidebar.store.ts    # Sidebar UI state
│   └── theme.store.ts      # Theme preference
├── hooks/                  # Shared custom hooks
│   └── useDebounce.ts
├── lib/                    # Utility libraries
│   ├── utils.ts            # Class merging, formatters
│   ├── http-client.ts      # HTTP client with interceptors
│   └── query-client.ts     # TanStack Query configuration
├── constants/              # Application constants
├── types/                  # Global TypeScript types
│   ├── api.ts              # API response types
│   └── common.ts           # Common types
├── mocks/                  # Mock data (for demo)
│   └── users.mock.ts
├── App.tsx                 # Root app component
├── main.tsx                # Entry point
└── index.css               # Global styles + Tailwind
```

## Getting Started

### Prerequisites

- Node.js 18+ (LTS recommended)
- npm 9+

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd dashboard-starter-kit

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start development server
npm run dev
```

### Environment Variables

Create a `.env` file from `.env.example`:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3000/api

# App Configuration
VITE_APP_NAME=Dashboard Starter Kit
```

## Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run TypeScript type checking
npm run typecheck

# Run ESLint
npm run lint
```

## Architecture Overview

### Feature-Based Modules

Each business feature lives in its own module under `src/modules/`. A module owns:

- **Pages & Components** - Feature-specific UI
- **API Service** - Data fetching/mutations
- **Types** - TypeScript interfaces
- **Routes** - Route configuration
- **Hooks** - TanStack Query hooks

This ensures **high cohesion** and **low coupling** - modules don't import from each other.

### Routing

Routes are configured per-module in `route.tsx` files and composed in `src/routes/router.tsx`:

```typescript
// src/modules/users/route.tsx
export const usersRoutes: RouteObject[] = [
  {
    path: 'users',
    children: [
      { index: true, element: <UsersListPage /> },
      { path: 'create', element: <UsersCreatePage /> },
      { path: ':id', element: <UsersViewPage /> },
      { path: ':id/edit', element: <UsersEditPage /> },
    ],
  },
];

// src/routes/router.tsx
const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/users" replace /> },
  ...authRoutes,
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [...usersRoutes, ...adminRoutes],
  },
  { path: '*', element: <NotFoundPage /> },
]);
```

### State Management

| State Type | Solution | Location |
|------------|----------|----------|
| Server State | TanStack Query | `src/modules/*/hooks/` |
| Global Client State | Zustand | `src/stores/` |
| Form State | React Hook Form | In components |
| Theme | Zustand + Context | `src/stores/theme.store.ts` |
| Sidebar | Zustand + Context | `src/stores/sidebar.store.ts` |

### Validation

Zod schemas in `src/schemas/` are shared between forms and API:

```typescript
// src/schemas/user.schema.ts
export const userCreateSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  role: z.enum({ admin: 'admin', user: 'user', viewer: 'viewer' }),
  status: z.enum({ active: 'active', inactive: 'inactive' }),
  password: z.string().min(8).optional(),
});

export type UserCreateInput = z.infer<typeof userCreateSchema>;

// In component
const form = useForm<UserCreateInput>({
  resolver: zodResolver(userCreateSchema),
});
```

### HTTP Client

The HTTP client in `src/lib/http-client.ts` provides:

- Configurable base URL from `VITE_API_BASE_URL`
- Automatic auth token injection from localStorage
- Consistent error handling with typed `ApiError`
- Request/response interceptors pattern

### Mock API

The Users module includes a complete mock implementation in `src/modules/users/service.ts` that simulates:

- Network delays
- CRUD operations
- Search, pagination, sorting
- In-memory data persistence

Replace with real API by uncommenting the `httpClient` calls and removing mock logic.

## Adding a New Module

1. Create module directory: `src/modules/products/`
2. Add types: `src/modules/products/types.ts`
3. Add schemas: `src/schemas/product.schema.ts`
4. Create service: `src/modules/products/service.ts`
5. Create hooks: `src/modules/products/hooks/useProducts.ts`
6. Build pages in `list/`, `create/`, `edit/`, `view/`
7. Export routes: `src/modules/products/route.tsx`
8. Import in `src/routes/router.tsx`

## Theming

Light/dark/system theme support via `ThemeProvider`:

```tsx
<ThemeProvider
  attribute="class"
  defaultTheme="system"
  enableSystem
>
  <App />
</ThemeProvider>
```

CSS variables in `src/index.css` define the color palette. Customize `--primary`, `--background`, etc.

## Dashboard Layout

The layout (`DashboardLayout`) includes:

- **Responsive Sidebar** - Collapsible, mobile drawer
- **Header** - Breadcrumbs, theme toggle, user dropdown
- **Main Content** - Max-width container with `Outlet`

## Path Aliases

Configured in `tsconfig.app.json` and `vite.config.ts`:

```typescript
"@/*": ["src/*"]
"@components/*": ["src/components/*"]
"@modules/*": ["src/modules/*"]
"@schemas/*": ["src/schemas/*"]
"@stores/*": ["src/stores/*"]
"@hooks/*": ["src/hooks/*"]
"@lib/*": ["src/lib/*"]
"@constants/*": ["src/constants/*"]
"@types/*": ["src/types/*"]
```

## Code Quality

- **Strict TypeScript** - No `any`, strict null checks
- **ESLint** - React hooks, TypeScript, unused vars
- **Prettier** - With Tailwind CSS plugin
- **Path aliases** - For clean imports

## License

MIT