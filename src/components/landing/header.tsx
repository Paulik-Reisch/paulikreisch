"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Logo } from "../ui/logo";
import { cn } from '@/lib/utils';
import { AmazonIcon } from '@/components/ui/icons/amazon-icon';
import { GooglePlayIcon } from '@/components/ui/icons/google-play-icon';
import { ElevenReaderIcon } from '@/components/ui/icons/eleven-reader-icon';
import { WorthaftIcon } from '../ui/icons/worthaft-icon';

const amazonLink = "https://amzn.eu/d/0CdFeZ3";
const googlePlayLink = "https://play.google.com/store/books/details?id=HZb3EAAAQBAJ&rdid=book-HZb3EAAAQBAJ&rdot=1&source=gbs_atb&pcampaignid=books_booksearch_atb";
const elevenReaderLink = "https://elevenreader.io/audiobooks/hallo-welt/PNgTk712as4goF7HwxJJ";


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
                    <Button variant="default">Lustige Artikel</Button>
                </Link>
                <Link href="/worthaft">
                    <Button variant="outline">
                        <WorthaftIcon className="mr-2 h-4 w-4" />
                        Worthaft Spiel
                    </Button>
                </Link>
            </nav>
          {/* We use a wrapper Link with `group` to control the hover state on child elements */}
          <Link href={amazonLink} target="_blank" rel="noopener noreferrer" className="group" aria-label="Bei Amazon kaufen">
            <Button
              variant="secondary"
              className="justify-start gap-2 w-10 md:group-hover:w-44 p-0 px-2.5 h-10 overflow-hidden transition-all duration-300 ease-in-out"
            >
              <AmazonIcon className="h-5 w-5 shrink-0" />
              <span className="whitespace-nowrap opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 delay-150">Bei Amazon kaufen</span>
            </Button>
          </Link>

          <Link href={googlePlayLink} target="_blank" rel="noopener noreferrer" className="group" aria-label="Bei Google Play kaufen">
            <Button
              variant="outline"
              className="justify-start gap-2 w-10 md:group-hover:w-40 p-0 px-2.5 h-10 overflow-hidden transition-all duration-300 ease-in-out"
            >
              <GooglePlayIcon className="h-5 w-5 shrink-0" />
              <span className="whitespace-nowrap opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 delay-150">Bei Google Play</span>
            </Button>
          </Link>

          <Link href={elevenReaderLink} target="_blank" rel="noopener noreferrer" className="group" aria-label="Auf 11Reader hören">
             <Button
              variant="outline"
              className="justify-start gap-2 w-10 md:group-hover:w-[220px] p-0 px-2.5 h-10 overflow-hidden transition-all duration-300 ease-in-out"
            >
              <ElevenReaderIcon className="h-4 w-4 shrink-0" />
              <span className="whitespace-nowrap opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 delay-150 text-xs sm:text-sm">
                <span className="font-bold text-destructive">GRATIS</span> hören auf 11Reader
              </span>
            </Button>
          </Link>
        </div>

      </div>
    </header>
  );
}
