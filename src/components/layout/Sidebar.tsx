'use client'

import { useNavigate } from 'react-router-dom'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from '@/components/ui/sidebar'
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Users,
  Settings,
  Shield,
  type LucideIcon,
} from 'lucide-react'
import { useSidebarStore } from '@/stores/sidebar.store'
import { useAppAbility } from '@/lib/ability/use-app-ability'
import type { AppActions, AppSubjects } from '@/lib/ability/types'

interface NavItem {
  name: string
  path: string
  icon: LucideIcon
  /** When set, the item is only shown if the ability allows it. */
  action?: AppActions
  subject?: AppSubjects
}

const navigation: NavItem[] = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Users', path: '/users', icon: Users, action: 'read', subject: 'User' },
  { name: 'Admins', path: '/admins', icon: Shield, action: 'manage', subject: 'Admin' },
  { name: 'Settings', path: '/settings', icon: Settings },
]

export function SidebarComponent() {
  const navigate = useNavigate()
  const { setOpen } = useSidebarStore()
  const { state, toggleSidebar } = useSidebar()
  const ability = useAppAbility()

  const visibleItems = navigation.filter(
    (item) =>
      item.action === undefined ||
      (item.subject !== undefined && ability.can(item.action, item.subject))
  )

  const handleNavigation = (path: string) => {
    navigate(path)
    setOpen(false)
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {visibleItems.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton
                    onClick={() => handleNavigation(item.path)}
                    tooltip={item.name}
                  >
                    <item.icon className="h-5 w-5" aria-hidden="true" />
                    <span className="group-data-[collapsible=icon]:hidden">{item.name}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarSeparator />
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                variant="outline"
                className="w-full justify-start"
                onClick={toggleSidebar}
              >
                {state === 'collapsed' ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
                <span className="group-data-[collapsible=icon]:hidden">Collapse</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  )
}
