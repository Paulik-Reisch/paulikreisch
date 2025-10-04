

"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Home,
  Search,
  PanelLeft,
  User,
  LogOut,
  Settings,
  HelpCircle,
  Bell,
  HomeIcon,
} from "lucide-react";
import { logoutAction } from "@/app/admin/actions";
import { SidebarTrigger, useSidebar } from "../ui/sidebar";

const pathToTitle: Record<string, string> = {
    '/internal/isdm/dashboard': 'ISDM Dashboard',
    '/internal/isdm/auth': 'Benutzerverwaltung',
    '/internal/isdm/database': 'Firestore Database',
    '/internal/isdm/storage': 'Cloud Storage',
    '/internal/isdm/genkit': 'Genkit AI Monitoring',
    '/internal/isdm/cloud': 'Google Cloud',
    '/internal/fem/content': 'Global Content Management',
    '/internal/fem/ab-testing': 'A/B-Testing',
    '/internal/fem/navigation': 'Navigations-Editor',
    '/internal/fem/theme': 'Theme & Style-Editor',
};

function BreadcrumbNav() {
    const pathname = usePathname();
    const parts = pathname.split('/').filter(p => p);
    
    return (
         <Breadcrumb className="hidden md:flex">
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                        <Link href="/internal">Internal</Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>
                {parts.length > 1 && <BreadcrumbSeparator />}
                {parts.length > 1 && (
                     <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                             <Link href={`/internal/${parts[1]}`}>{parts[1].toUpperCase()}</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                )}
                {parts.length > 2 && <BreadcrumbSeparator />}
                 {parts.length > 2 && (
                    <BreadcrumbItem>
                        <BreadcrumbPage>{pathToTitle[pathname] || parts[2]}</BreadcrumbPage>
                    </BreadcrumbItem>
                )}
            </BreadcrumbList>
        </Breadcrumb>
    )
}


export function InternalHeader() {
  const { toggleSidebar } = useSidebar();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-white px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <SidebarTrigger className="sm:hidden gcp-icon-button" />
      
      <BreadcrumbNav />

      <div className="relative ml-auto flex-1 md:grow-0">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          type="search"
          placeholder="Suchen..."
          className="w-full rounded-sm bg-gray-100 pl-8 md:w-[200px] lg:w-[320px] h-9"
        />
      </div>
      <Button variant="ghost" size="icon" className="gcp-icon-button">
        <HelpCircle className="h-5 w-5" />
      </Button>
       <Button variant="ghost" size="icon" className="gcp-icon-button">
        <Bell className="h-5 w-5" />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="gcp-icon-button rounded-full"
          >
            <User className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Mein Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
             <Settings className="mr-2 h-4 w-4" />
            Einstellungen
          </DropdownMenuItem>
          <DropdownMenuItem>
            <HelpCircle className="mr-2 h-4 w-4" />
            Support
          </DropdownMenuItem>
          <DropdownMenuSeparator />
           <Link href="/admin">
                <DropdownMenuItem>
                    <HomeIcon className="mr-2 h-4 w-4" />
                    <span>Admin-Dashboard</span>
                </DropdownMenuItem>
            </Link>
          <DropdownMenuSeparator />
          <form action={logoutAction} className="w-full">
             <button type="submit" className="w-full">
                <DropdownMenuItem>
                    <LogOut className="mr-2 h-4 w-4" />
                    Abmelden
                </DropdownMenuItem>
            </button>
          </form>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
