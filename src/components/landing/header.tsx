
"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Logo } from "../ui/logo";
import { cn } from '@/lib/utils';
import { WorthaftIcon } from '../ui/icons/worthaft-icon';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Menu, Infinity } from 'lucide-react';


export function Header() {
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
      scrolled ? "border-b shadow-sm" : ""
    )}>
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
            <a className="flex items-center justify-center" href="/">
            <div className="flex items-center gap-2">
                <Logo className="h-8 w-auto" />
                <span className="font-headline font-semibold text-lg ml-2 hidden sm:inline">Paulik & Reisch</span>
            </div>
            </a>
        </div>
        
        <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-4">
                <Link href="/a">
                    <Button variant="ghost">Paulik & Reisch Satire-Magazin</Button>
                </Link>
                <Link href="/worthaft">
                    <Button variant="ghost">
                        <WorthaftIcon className="mr-2 h-4 w-4" />
                        Worthaft
                    </Button>
                </Link>
                <Link href="/shop">
                    <Button variant="secondary">Buch kaufen</Button>
                </Link>
            </nav>
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Menü öffnen</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <div className="flex flex-col gap-4 py-6">
                    <a className="flex items-center justify-center mb-4" href="/">
                      <div className="flex items-center gap-2">
                          <Logo className="h-8 w-auto" />
                          <span className="font-headline font-semibold text-lg ml-2">Paulik & Reisch</span>
                      </div>
                    </a>
                    <Link href="/a">
                        <Button variant="default" className="w-full">Paulik & Reisch Satire-Magazin</Button>
                    </Link>
                    <Link href="/worthaft">
                        <Button variant="outline" className="w-full">
                            <WorthaftIcon className="mr-2 h-4 w-4" />
                            Worthaft Spiel
                        </Button>
                    </Link>
                    <Link href="/shop">
                        <Button variant="secondary" className="w-full">Buch kaufen</Button>
                    </Link>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
        </div>

      </div>
    </header>
  );
}
