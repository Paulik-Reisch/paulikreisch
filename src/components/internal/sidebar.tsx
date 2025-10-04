"use client"

import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { LogOut, LayoutDashboard, Database, HardDrive, Cloud, Home } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { logoutAction } from "@/app/admin/actions"
import Link from "next/link"

const menuItems = [
  { href: "/internal", label: "Dashboard", icon: LayoutDashboard },
  { href: "/internal/database", label: "Firestore DB", icon: Database },
  { href: "/internal/storage", label: "Cloud Storage", icon: HardDrive },
  { href: "/internal/cloud", label: "Google Cloud", icon: Cloud },
]

export function InternalSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
           <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Database className="h-5 w-5"/>
           </div>
           <span className="text-base font-semibold text-primary group-data-[collapsible=icon]:hidden">
                IDSM
           </span>
        </div>
      </SidebarHeader>
      
      <SidebarMenu>
        {menuItems.map((item) => (
          <SidebarMenuItem key={item.href}>
            <Link href={item.href} className="w-full">
              <SidebarMenuButton isActive={pathname === item.href} tooltip={item.label}>
                <item.icon />
                <span>{item.label}</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
      
      <SidebarFooter>
        <Separator className="my-2" />
        <SidebarMenu>
            <SidebarMenuItem>
                 <Link href="/admin" className="w-full">
                    <SidebarMenuButton tooltip="Zum Admin Dashboard">
                        <Home/>
                        <span>Admin</span>
                    </SidebarMenuButton>
                </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <form action={logoutAction} className="w-full">
                    <SidebarMenuButton tooltip="Abmelden">
                        <LogOut/>
                        <span>Abmelden</span>
                    </SidebarMenuButton>
                </form>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
