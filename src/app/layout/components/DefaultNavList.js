import { IconChartArea, IconChecklist, IconCircle, IconHome2, IconLockAccess, IconMap2, IconReport, IconSettings, IconShoppingCart, IconUserCheck, IconUserHeart, IconUsers } from "@tabler/icons-react";

export const navList = [
    { icon: <IconHome2 />, label: "Dashboard", url: "/dashboard", children: [] },
    { icon: <IconShoppingCart />, label: "Sale", url: "/sale", children: [] },
    { icon: <IconChecklist />, label: "Inventory", url: null, children: [
      { icon: <IconCircle />, label: "Item", url: '/inventory/item' },
      { icon: <IconCircle />, label: "Category", url: '/inventory/category' }
    ] },
    { icon: <IconUserHeart />, label: "CRM", url: null, children: [
      { icon: <IconCircle />, label: "Customer", url: '/crm/customer' },
    ] },
    { icon: <IconChartArea />, label: "Sale Report", url: null, children: [] },
    { icon: <IconUserCheck />, label: "Supplier", url: null, children: [] },
    { icon: <IconMap2 />, label: "Delivery", url: null, children: [] },
    { icon: <IconLockAccess />, label: "Role & Permission", url: null, children: [] },
    { icon: <IconUsers />, label: "User", url: null,  children: [
      { icon: <IconCircle />, label: "List", url: '/user' }
    ]},
    { icon: <IconReport />, label: "Report", url: null, children: [] },
    { icon: <IconSettings />, label: "Setting", url: null, children: [] },
]