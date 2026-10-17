import type { User, UserCreateInput, UserUpdateInput, UserListQuery, UserListResponse } from './types'

// Mock data for demo purposes - replace with real API
const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'admin',
    status: 'active',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'user',
    status: 'active',
    createdAt: '2024-01-20T14:20:00Z',
    updatedAt: '2024-01-20T14:20:00Z',
  },
  {
    id: '3',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    role: 'viewer',
    status: 'inactive',
    createdAt: '2024-02-01T09:15:00Z',
    updatedAt: '2024-02-01T09:15:00Z',
  },
  {
    id: '4',
    name: 'Alice Williams',
    email: 'alice@example.com',
    role: 'user',
    status: 'active',
    createdAt: '2024-02-10T16:45:00Z',
    updatedAt: '2024-02-10T16:45:00Z',
  },
  {
    id: '5',
    name: 'Charlie Brown',
    email: 'charlie@example.com',
    role: 'admin',
    status: 'active',
    createdAt: '2024-02-15T11:30:00Z',
    updatedAt: '2024-02-15T11:30:00Z',
  },
  {
    id: '6',
    name: 'Diana Prince',
    email: 'diana@example.com',
    role: 'user',
    status: 'inactive',
    createdAt: '2024-02-20T13:20:00Z',
    updatedAt: '2024-02-20T13:20:00Z',
  },
  {
    id: '7',
    name: 'Edward Norton',
    email: 'edward@example.com',
    role: 'viewer',
    status: 'active',
    createdAt: '2024-03-01T10:00:00Z',
    updatedAt: '2024-03-01T10:00:00Z',
  },
  {
    id: '8',
    name: 'Fiona Gallagher',
    email: 'fiona@example.com',
    role: 'user',
    status: 'active',
    createdAt: '2024-03-05T15:30:00Z',
    updatedAt: '2024-03-05T15:30:00Z',
  },
]

let mockUserData = [...mockUsers]

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const filterAndSortUsers = (users: User[], query: UserListQuery): User[] => {
  let result = [...users]

  if (query.search) {
    const search = query.search.toLowerCase()
    result = result.filter(
      (user) =>
        user.name.toLowerCase().includes(search) ||
        user.email.toLowerCase().includes(search) ||
        user.role.toLowerCase().includes(search) ||
        user.status.toLowerCase().includes(search)
    )
  }

  if (query.sortBy) {
    result.sort((a, b) => {
      const aVal = a[query.sortBy as keyof User]
      const bVal = b[query.sortBy as keyof User]
      if (aVal < bVal) return query.sortOrder === 'asc' ? -1 : 1
      if (aVal > bVal) return query.sortOrder === 'asc' ? 1 : -1
      return 0
    })
  }

  return result
}

const paginateUsers = (users: User[], page: number, perPage: number): UserListResponse => {
  const total = users.length
  const totalPages = Math.ceil(total / perPage)
  const start = (page - 1) * perPage
  const end = start + perPage
  const data = users.slice(start, end)

  return {
    data,
    meta: {
      currentPage: page,
      perPage,
      total,
      totalPages,
    },
  }
}

export const usersService = {
  async getUsers(query: UserListQuery = {}): Promise<UserListResponse> {
    // Uncomment to use real API
    // const response = await httpClient.get<UserListResponse>(USERS_ENDPOINT, query as Record<string, string | number | boolean | undefined>)
    // if (response.error) throw new Error(response.error.message)
    // return response.data!

    await delay(500)
    const filtered = filterAndSortUsers(mockUserData, query)
    return paginateUsers(filtered, query.page || 1, query.perPage || 10)
  },

  async getUser(id: string): Promise<User> {
    // Uncomment to use real API
    // const response = await httpClient.get<User>(`${USERS_ENDPOINT}/${id}`)
    // if (response.error) throw new Error(response.error.message)
    // return response.data!

    await delay(300)
    const user = mockUserData.find((u) => u.id === id)
    if (!user) throw new Error('User not found')
    return { ...user }
  },

  async createUser(data: UserCreateInput): Promise<User> {
    // Uncomment to use real API
    // const response = await httpClient.post<User>(USERS_ENDPOINT, data)
    // if (response.error) throw new Error(response.error.message)
    // return response.data!

    await delay(800)
    const newUser: User = {
      id: crypto.randomUUID(),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    mockUserData.unshift(newUser)
    return { ...newUser }
  },

  async updateUser(id: string, data: UserUpdateInput): Promise<User> {
    // Uncomment to use real API
    // const response = await httpClient.put<User>(`${USERS_ENDPOINT}/${id}`, data)
    // if (response.error) throw new Error(response.error.message)
    // return response.data!

    await delay(600)
    const index = mockUserData.findIndex((u) => u.id === id)
    if (index === -1) throw new Error('User not found')
    mockUserData[index] = {
      ...mockUserData[index],
      ...data,
      updatedAt: new Date().toISOString(),
    }
    return { ...mockUserData[index] }
  },

  async deleteUser(id: string): Promise<void> {
    // Uncomment to use real API
    // const response = await httpClient.delete<void>(`${USERS_ENDPOINT}/${id}`)
    // if (response.error) throw new Error(response.error.message)
    // return

    await delay(400)
    mockUserData = mockUserData.filter((u) => u.id !== id)
  },
}