"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { Logo } from "../ui/logo";
import { cn } from '@/lib/utils';


export function BookShopHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className={cn(
      "px-4 lg:px-6 h-14 flex items-center sticky top-0 z-40 w-full bg-background/95 backdrop-blur-sm transition-all duration-300",
      scrolled ? "border-b shadow-sm" : "border-b border-transparent"
    )}>
      <div className="container mx-auto flex items-center justify-between">
        <a className="flex items-center justify-center" href="/">
          <div className="flex items-center gap-2">
            <Logo className="h-8 w-auto" />
            <span className="font-headline font-semibold text-lg ml-2 hidden sm:inline">Paulik & Reisch</span>
          </div>
        </a>
        
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button size="sm" variant="secondary">
                    Bücher
                    <ChevronDown className="ml-2 h-4 w-4"/>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Wählen Sie ein Buch</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link href="/">
                    <DropdownMenuItem>
                        Mehr zu "Hallo Welt 1" erfahren
                    </DropdownMenuItem>
                </Link>
                <Link href="/lp2">
                    <DropdownMenuItem>
                        Mehr zu "Hallo Welt 2" erfahren
                    </DropdownMenuItem>
                </Link>
            </DropdownMenuContent>
        </DropdownMenu>

      </div>
    </header>
  );
}
