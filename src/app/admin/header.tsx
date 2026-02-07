
"use client";

import Link from "next/link";
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
import {
  Search,
  User,
  LogOut,
  Settings,
  HelpCircle,
  Bell,
  HomeIcon,
  Menu
} from "lucide-react";
import { logoutAction } from "@/app/admin/actions";
import { useSidebar } from "@/components/ui/sidebar";
import { Logo } from "@/components/ui/logo";
import { PremiumBanner } from "@/components/landing/premium-banner";

export function AdminHeader() {
  const { toggleSidebar } = useSidebar();

  return (
    <>
      <header className="header sticky top-0 z-20 flex h-12 items-center gap-4 border-b bg-primary px-4 text-primary-foreground shadow-md">
        <Button variant="ghost" size="icon" className="sm:hidden -ml-2 text-white hover:bg-white/10 hover:text-white" onClick={toggleSidebar}>
          <Menu className="h-6 w-6" />
        </Button>

        <div className="flex items-center gap-3">
          <Logo className="h-6 w-auto text-white hidden sm:block"/>
          <span className="text-lg font-semibold text-white">
                IMCORE
          </span>
        </div>
        
        <div className="project-picker ml-4 hidden md:flex">
              <span className="font-medium mr-2">paulik-reisch-prod</span>
              <svg style={{width:'18px',height:'18px',fill:'white',marginLeft:'auto'}} viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z"/></svg>
          </div>

        <div className="relative ml-auto flex-1 md:grow-0">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-white/70" />
          <Input
            type="search"
            placeholder="Produkte durchsuchen..."
            className="search-input w-full rounded-sm bg-white/10 pl-8 h-9 text-white placeholder:text-white/70"
          />
        </div>
        <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 hover:text-white">
          <HelpCircle className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 hover:text-white">
          <Bell className="h-5 w-5" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full bg-pink-200 text-pink-800 w-8 h-8 hover:bg-pink-300"
            >
              <span>I</span>
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
            <Link href="/">
                  <DropdownMenuItem>
                      <HomeIcon className="mr-2 h-4 w-4" />
                      <span>Zur Hauptseite</span>
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
      <PremiumBanner />
    </>
  );
}
