import { Outlet } from 'react-router-dom'
import { SidebarComponent } from './Sidebar'
import { Header } from './Header'
import { useSidebarStore } from '@/stores/sidebar.store'
import {
  SidebarProvider,
  SidebarInset,
} from '@/components/ui/sidebar'

export function DashboardLayout() {
  const { isCollapsed, setCollapsed } = useSidebarStore()

  return (
    <SidebarProvider open={!isCollapsed} onOpenChange={(open) => setCollapsed(!open)}>
      <SidebarComponent />
      <SidebarInset>
        <Header />
        <main className="flex-1 p-4 lg:p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}