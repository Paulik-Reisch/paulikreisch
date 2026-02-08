"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Logo } from "../ui/logo";
import { cn } from '@/lib/utils';
import { AmazonIcon } from '@/components/ui/icons/amazon-icon';
import { GooglePlayIcon } from '@/components/ui/icons/google-play-icon';
import { ElevenReaderIcon } from '@/components/ui/icons/eleven-reader-icon';

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
      scrolled ? "border-b shadow-sm" : "border-b border-transparent"
    )}>
      <div className="container mx-auto flex items-center justify-between">
        <a className="flex items-center justify-center" href="/">
          <div className="flex items-center gap-2">
            <Logo className="h-8 w-auto" />
            <span className="font-headline font-semibold text-lg ml-2 hidden sm:inline">Paulik & Reisch</span>
          </div>
        </a>
        
        <div className="flex items-center gap-2">
          <Link href={amazonLink} target="_blank" rel="noopener noreferrer">
            <Button
              variant="secondary"
              className="flex items-center justify-center sm:justify-start gap-2 w-10 h-10 overflow-hidden transition-all duration-300 ease-in-out p-0 sm:px-2 sm:hover:w-40"
              aria-label="Bei Amazon kaufen"
            >
              <AmazonIcon className="h-5 w-5 shrink-0" />
              <span className="whitespace-nowrap hidden sm:inline">Bei Amazon kaufen</span>
            </Button>
          </Link>

          <Link href={googlePlayLink} target="_blank" rel="noopener noreferrer">
            <Button
              variant="outline"
              className="flex items-center justify-center sm:justify-start gap-2 w-10 h-10 overflow-hidden transition-all duration-300 ease-in-out p-0 sm:px-2 sm:hover:w-40"
              aria-label="Bei Google Play kaufen"
            >
              <GooglePlayIcon className="h-5 w-5 shrink-0" />
              <span className="whitespace-nowrap hidden sm:inline">Bei Google Play</span>
            </Button>
          </Link>

          <Link href={elevenReaderLink} target="_blank" rel="noopener noreferrer">
            <Button
              variant="outline"
              className="flex items-center justify-center sm:justify-start gap-2 w-10 h-10 overflow-hidden transition-all duration-300 ease-in-out p-0 sm:px-2 sm:hover:w-56"
              aria-label="Auf 11Reader hören"
            >
              <ElevenReaderIcon className="h-4 w-4 shrink-0" />
              <span className="whitespace-nowrap text-xs sm:text-sm hidden sm:inline">
                <span className="font-bold text-destructive">GRATIS</span> hören auf 11Reader
              </span>
            </Button>
          </Link>
        </div>

      </div>
    </header>
  );
}
