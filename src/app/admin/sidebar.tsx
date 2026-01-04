
"use client"

import {
  Sidebar,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { LogOut, LayoutDashboard, Database, HardDrive, Users, Home, BrainCircuit, LineChart, Newspaper, FileText, VenetianMask, Sparkles, BookOpen, Settings } from "lucide-react"
import { usePathname } from "next/navigation"
import { logoutAction } from "@/app/admin/actions"
import Link from "next/link"

const mainNav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/database", label: "Datenbank", icon: Database },
  { href: "/admin/storage", label: "Storage", icon: HardDrive },
  { href: "/admin/analytics", label: "Analytics", icon: LineChart },
  { href: "/admin/genkit", label: "KI-Flows", icon: BrainCircuit },
];

const contentNav = [
    { href: "/admin/marketing", label: "Marketing", icon: Newspaper, subItems: [
        { href: "/admin/marketing/nl", label: "Newsletter" },
        { href: "/admin/marketing/editor", label: "Editor" },
        { href: "/admin/marketing/leads", label: "Leads" },
    ]},
    { href: "/admin/lp", label: "Dynamische LPs", icon: FileText },
    { href: "/admin/excerpts", label: "Exzerpte", icon: BookOpen },
    { href: "/admin/seo", label: "SEO", icon: Sparkles },
]

const funNav = [
    { href: "/admin/palabrotas", label: "Palabrotas", icon: VenetianMask },
    { href: "/admin/chistes", label: "Chistes", icon: VenetianMask },
]


export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar>
        <SidebarMenu>
          <SidebarGroup>
             <SidebarGroupLabel>Core</SidebarGroupLabel>
            {mainNav.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} className="w-full">
                  <SidebarMenuButton isActive={pathname.startsWith(item.href)} tooltip={item.label} variant="ghost">
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarGroup>
          
          <SidebarSeparator />

          <SidebarGroup>
            <SidebarGroupLabel>Content & Marketing</SidebarGroupLabel>
            {contentNav.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} className="w-full">
                  <SidebarMenuButton isActive={pathname.startsWith(item.href)} tooltip={item.label} variant="ghost">
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarGroup>

          <SidebarSeparator />

          <SidebarGroup>
            <SidebarGroupLabel>Fun Stuff</SidebarGroupLabel>
            {funNav.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} className="w-full">
                  <SidebarMenuButton isActive={pathname.startsWith(item.href)} tooltip={item.label} variant="ghost">
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarGroup>
        </SidebarMenu>
    </Sidebar>
  )
}
