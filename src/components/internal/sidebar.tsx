

"use client"

import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { LogOut, LayoutDashboard, Database, HardDrive, Users, Home, BrainCircuit, TestTube2, Palette, Navigation, Cloud, Component, LineChart, History, Newspaper, FileText } from "lucide-react"
import { usePathname } from "next/navigation"
import { logoutAction } from "@/app/admin/actions"
import Link from "next/link"

const isdmItems = [
  { href: "/internal/isdm/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/internal/isdm/analytics", label: "Analytics", icon: LineChart },
  { href: "/internal/isdm/auth", label: "Benutzer", icon: Users },
  { href: "/internal/isdm/database", label: "Firestore DB", icon: Database },
  { href: "/internal/isdm/storage", label: "Cloud Storage", icon: HardDrive },
  { href: "/internal/isdm/genkit", label: "Genkit AI", icon: BrainCircuit },
  { href: "/internal/isdm/cloud", label: "Google Cloud", icon: Cloud },
  { href: "/internal/logs", label: "Logs", icon: History },
];

const femItems = [
  { href: "/internal/fem/content", label: "Content", icon: Cloud },
  { href: "/internal/fem/ab-testing", label: "A/B-Tests", icon: TestTube2 },
  { href: "/internal/fem/navigation", label: "Navigation", icon: Navigation },
  { href: "/internal/fem/theme", label: "Theme", icon: Palette },
];

const idxItems = [
    { href: "/internal/idx/lp", label: "Landing Pages", icon: FileText },
    { href: "/internal/idx/nl", label: "Newsletters", icon: Newspaper },
];


export function InternalSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
           <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-accent text-accent-foreground">
                <Component className="h-5 w-5"/>
           </div>
           <span className="text-base font-semibold text-gray-800 group-data-[collapsible=icon]:hidden">
                M-Dashboard
           </span>
        </div>
      </SidebarHeader>
      
      <SidebarMenu>
        <SidebarGroup>
          <SidebarGroupLabel>ISDM</SidebarGroupLabel>
          {isdmItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} className="w-full">
                <SidebarMenuButton isActive={pathname === item.href} tooltip={item.label} variant="ghost" className="justify-start data-[active=true]:bg-accent data-[active=true]:text-accent-foreground data-[active=true]:font-semibold hover:bg-gray-100 rounded-sm">
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarGroup>
        
        <SidebarSeparator />

        <SidebarGroup>
           <SidebarGroupLabel>FEM</SidebarGroupLabel>
           {femItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} className="w-full">
                <SidebarMenuButton isActive={pathname === item.href} tooltip={item.label} variant="ghost" className="justify-start data-[active=true]:bg-accent data-[active=true]:text-accent-foreground data-[active=true]:font-semibold hover:bg-gray-100 rounded-sm">
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
           <SidebarGroupLabel>IDX</SidebarGroupLabel>
           {idxItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} className="w-full">
                <SidebarMenuButton isActive={pathname === item.href} tooltip={item.label} variant="ghost" className="justify-start data-[active=true]:bg-accent data-[active=true]:text-accent-foreground data-[active=true]:font-semibold hover:bg-gray-100 rounded-sm">
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarGroup>
      </SidebarMenu>
      
      <SidebarFooter>
        <Separator className="my-2" />
        <SidebarMenu>
            <SidebarMenuItem>
                 <Link href="/admin" className="w-full">
                    <SidebarMenuButton tooltip="Zum Admin Dashboard" variant="ghost" className="justify-start hover:bg-gray-100 rounded-sm">
                        <Home/>
                        <span>Admin</span>
                    </SidebarMenuButton>
                </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <form action={logoutAction} className="w-full">
                    <SidebarMenuButton tooltip="Abmelden" variant="ghost" className="justify-start hover:bg-gray-100 rounded-sm">
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
