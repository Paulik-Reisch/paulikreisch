"use client";

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Link from "next/link";
import { Logo } from "../ui/logo";
import { cn } from '@/lib/utils';
import { WorthaftIcon } from '../ui/icons/worthaft-icon';
import { Menu, X } from 'lucide-react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { ThemeToggle } from '@/components/theme-toggle';

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // A hidden mobile dialog must not leave the desktop page inert after resize.
  useEffect(() => {
    const media = window.matchMedia('(min-width: 768px)');
    const closeOnDesktop = () => { if (media.matches) setOpen(false); };
    media.addEventListener('change', closeOnDesktop);
    return () => media.removeEventListener('change', closeOnDesktop);
  }, []);

  useEffect(() => {
    let sx = 0, sy = 0;
    const onStart = (e: TouchEvent) => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; };
    const onEnd = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - sx;
      const dy = e.changedTouches[0].clientY - sy;
      if (Math.abs(dy) > Math.abs(dx)) return;
      const w = window.innerWidth;
      if (!open && sx > w - 32 && dx < -50) setOpen(true);
      if (open && dx > 70) setOpen(false);
    };
    window.addEventListener('touchstart', onStart, { passive: true } as AddEventListenerOptions);
    window.addEventListener('touchend', onEnd, { passive: true } as AddEventListenerOptions);
    return () => {
      window.removeEventListener('touchstart', onStart as EventListener);
      window.removeEventListener('touchend', onEnd as EventListener);
    };
  }, [open]);

  useEffect(() => {
    const el = panelRef.current;
    if (!el || !open) return;
    let startX = 0, curX = 0, dragging = false;
    const onTouchStart = (e: TouchEvent) => { startX = e.touches[0].clientX; dragging = true; el.style.transition = 'none'; };
    const onTouchMove = (e: TouchEvent) => {
      if (!dragging) return;
      curX = e.touches[0].clientX - startX;
      if (curX > 0) el.style.transform = `translateX(${curX}px)`;
    };
    const onTouchEnd = () => {
      if (!dragging) return;
      dragging = false;
      el.style.transition = '';
      el.style.transform = '';
      if (curX > 80) setOpen(false);
      curX = 0;
    };
    el.addEventListener('touchstart', onTouchStart, { passive: true } as AddEventListenerOptions);
    el.addEventListener('touchmove', onTouchMove, { passive: true } as AddEventListenerOptions);
    el.addEventListener('touchend', onTouchEnd);
    return () => {
      el.removeEventListener('touchstart', onTouchStart as EventListener);
      el.removeEventListener('touchmove', onTouchMove as EventListener);
      el.removeEventListener('touchend', onTouchEnd as EventListener);
    };
  }, [open]);

  const isWorthaftPage = pathname === '/worthaft';
  const tBar90 = isWorthaftPage ? 'dark:bg-[hsl(240_4%_12%_/_0.9)]' : 'dark:bg-[#211d17]/90';
  const tDrawer95 = isWorthaftPage ? 'dark:bg-[hsl(240_4%_12%_/_0.95)]' : 'dark:bg-[#211d17]/95';
  const tPanel = isWorthaftPage ? 'dark:bg-[hsl(240_4%_18%)]' : 'dark:bg-[#2a251e]';
  const tPanelHover = isWorthaftPage ? 'dark:hover:bg-[hsl(240_4%_25%)]' : 'dark:hover:bg-[#332d24]';
  const tLine = isWorthaftPage ? 'dark:border-[hsl(240_4%_25%)]' : 'dark:border-[#3a352d]';
  const tLine80 = isWorthaftPage ? 'dark:border-[hsl(240_4%_25%_/_0.8)]' : 'dark:border-[#3a352d]/80';
  const tEdgeWorthaft = isWorthaftPage ? 'dark:border-[hsl(240_5%_45%)]' : 'dark:border-[#6b6353]';
  const darkTonalYellow = 'dark:border-[#bfa100] dark:shadow-[0_3px_0_#6b5700] dark:hover:shadow-[0_4px_0_#6b5700] dark:active:shadow-[0_1px_0_#6b5700]';
  const tInk = isWorthaftPage ? 'dark:text-[hsl(0_0%_98%)]' : 'dark:text-[#f2ede3]';
  const showWorthaftLink = !isWorthaftPage;
  const showShopLink = pathname !== '/shop';
  // Z-flow on the index: the primary CTA closes the desktop bar on the far right.
  const shopCtaLast = pathname === '/';
  const desktopShopLink = showShopLink ? (
    <Link
      href="/shop"
      className={`inline-flex items-center justify-center rounded-[10px] border-2 border-[#1d1a15] bg-[#ffe14d] px-5 py-2 text-[0.9rem] font-bold text-[#1d1a15] shadow-[0_3px_0_#1d1a15] hover:translate-y-[-1px] hover:shadow-[0_4px_0_#1d1a15] active:translate-y-[1px] active:shadow-[0_1px_0_#1d1a15] transition-[transform,box-shadow] ${darkTonalYellow}`}
    >
      Buch kaufen
    </Link>
  ) : null;

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <header className={cn(
        `px-4 lg:px-6 h-[64px] flex items-center sticky top-0 z-40 w-full bg-white/95 backdrop-blur-sm transition-all duration-300 ${tBar90}`,
        scrolled ? `border-b border-[#e8ddd0] shadow-[0_2px_16px_rgba(0,0,0,0.06)] ${tLine}` : "border-b border-transparent"
      )}>
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            <a className="flex items-center justify-center" href="/">
              <div className="flex items-center gap-2">
                <Logo className="h-8 w-auto" />
                <span className={`font-headline font-semibold text-lg ml-2 hidden sm:inline text-[#1d1a15] ${tInk}`}>Paulik &amp; Reisch</span>
              </div>
            </a>
            {isWorthaftPage && (
              <div className={`flex items-center gap-2 border-l border-[#e8ddd0] pl-3 sm:pl-4 ${tLine}`}>
                <span className="worthaft-icon-shimmer shrink-0">
                  <WorthaftIcon className="h-6 w-6 text-primary" />
                </span>
                <h1 className={`font-headline text-lg font-bold text-[#1d1a15] sm:text-xl ${tInk}`}>Worthaft</h1>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            {/* Desktop — Landing-Look */}
            <nav className="hidden md:flex items-center gap-3">
              {showWorthaftLink && (
                <Link
                  href="/worthaft"
                  className={`inline-flex items-center gap-2 rounded-[10px] border-2 border-[#1d1a15] bg-white px-4 py-2 text-[0.9rem] font-semibold text-[#1d1a15] shadow-[0_3px_0_#1d1a15] hover:translate-y-[-1px] hover:shadow-[0_4px_0_#1d1a15] active:translate-y-[1px] active:shadow-[0_1px_0_#1d1a15] hover:bg-[#f7f2e7] transition-[transform,box-shadow,background-color] ${tEdgeWorthaft} ${tPanel} ${tInk} dark:shadow-[0_3px_0_#000000] dark:hover:shadow-[0_4px_0_#000000] ${tPanelHover} dark:active:shadow-[0_1px_0_#000000]`}
                >
                  <span className="worthaft-icon-shimmer">
                    <WorthaftIcon className="h-4 w-4" />
                  </span>
                  Worthaft
                </Link>
              )}
              {!shopCtaLast && desktopShopLink}
              {shopCtaLast && desktopShopLink}
            </nav>

            {/* Mobile burger */}
            <div className="md:hidden">
              <DialogPrimitive.Trigger asChild><button
                aria-label={open ? "Menü schließen" : "Menü öffnen"}
                aria-expanded={open}
                className={`inline-flex h-10 w-10 items-center justify-center rounded-[10px] border border-[#e8ddd0] bg-white shadow-sm transition-colors hover:bg-[#f7f2e7] ${tLine} ${tPanel} ${tPanelHover}`}
              >
                {open ? <X className={`h-5 w-5 text-[#1d1a15] ${tInk}`} /> : <Menu className={`h-5 w-5 text-[#1d1a15] ${tInk}`} />}
              </button></DialogPrimitive.Trigger>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <DialogPrimitive.Portal><div
        aria-hidden={!open}
        className={cn(
          "fixed inset-0 z-50 md:hidden",
          open ? "pointer-events-auto visible" : "pointer-events-none invisible"
        )}
      >
        <DialogPrimitive.Overlay asChild><button
          tabIndex={-1}
          aria-label="Menü schließen"
          onClick={() => setOpen(false)}
          className={cn(
            "absolute inset-0 bg-[#1a1815]/40 backdrop-blur-[2px] transition-opacity duration-300",
            open ? "opacity-100" : "opacity-0"
          )}
        /></DialogPrimitive.Overlay>
        <DialogPrimitive.Content asChild aria-describedby={undefined} onOpenAutoFocus={event => {
          event.preventDefault();
          closeRef.current?.focus();
        }}><div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation"
          className={cn(
            `absolute right-3 top-3 h-auto max-h-[calc(100dvh-1.5rem)] w-[82vw] max-w-[340px] rounded-[24px] border border-[#e8ddd0] bg-[#fdf8ee]/95 shadow-[-12px_12px_40px_rgba(0,0,0,0.18)] backdrop-blur-xl flex flex-col transition-transform duration-[320ms] ease-[cubic-bezier(0.32,0.72,0,1)] will-change-transform ${tLine} ${tDrawer95}`,
            open ? "translate-x-0" : "translate-x-full"
          )}
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          <DialogPrimitive.Title className="sr-only">Navigation</DialogPrimitive.Title>
          <div className="absolute left-0 top-0 h-full w-[18px] -translate-x-full touch-manipulation" aria-hidden="true" />
          <div className={`flex items-center justify-between px-6 pt-6 pb-4 border-b border-[#e8ddd0]/80 ${tLine80}`}>
            <Link href="/" onClick={() => setOpen(false)} className="flex items-center gap-2">
              <Logo className="h-7 w-auto" />
              <span className={`font-headline font-semibold text-[1.05rem] text-[#1d1a15] ${tInk}`}>Paulik &amp; Reisch</span>
            </Link>
            <button
              ref={closeRef}
              aria-label="Menü schließen"
              onClick={() => setOpen(false)}
              className={`inline-flex h-9 w-9 items-center justify-center rounded-full bg-white border border-[#e8ddd0] shadow-sm ${tPanel} ${tLine}`}
            >
              <X className={`h-4 w-4 text-[#1d1a15] ${tInk}`} />
            </button>
          </div>

          <nav aria-label="Hauptnavigation" className="flex max-h-[calc(100dvh-7rem)] justify-center overflow-y-auto px-6 py-6">
            <div className="mx-auto flex w-full flex-col items-stretch gap-4">
              {showShopLink && (
                <Link
                  href="/shop"
                  onClick={() => setOpen(false)}
                  className={`inline-flex min-h-12 w-full items-center justify-center self-start rounded-[10px] border-2 border-[#1d1a15] bg-[#ffe14d] px-5 py-2 text-[0.9rem] font-bold text-[#1d1a15] shadow-[0_3px_0_#1d1a15] transition-[transform,box-shadow] hover:-translate-y-px hover:shadow-[0_4px_0_#1d1a15] active:translate-y-px active:shadow-[0_1px_0_#1d1a15] ${darkTonalYellow}`}
                >
                  Buch kaufen
                </Link>
              )}
              {showWorthaftLink && (
                <Link
                  href="/worthaft"
                  onClick={() => setOpen(false)}
                  className={`inline-flex min-h-12 w-full items-center justify-center gap-2 self-start rounded-[10px] border-2 border-[#1d1a15] bg-white px-4 py-2 text-[0.9rem] font-semibold text-[#1d1a15] shadow-[0_3px_0_#1d1a15] transition-[transform,box-shadow,background-color] hover:-translate-y-px hover:bg-[#f7f2e7] hover:shadow-[0_4px_0_#1d1a15] active:translate-y-px active:shadow-[0_1px_0_#1d1a15] ${tEdgeWorthaft} ${tPanel} ${tInk} dark:shadow-[0_3px_0_#000000] ${tPanelHover} dark:hover:shadow-[0_4px_0_#000000] dark:active:shadow-[0_1px_0_#000000]`}
                >
                  <span className="worthaft-icon-shimmer shrink-0">
                    <WorthaftIcon className="h-4 w-4" />
                  </span>
                  Worthaft
                </Link>
              )}
            </div>
          </nav>

          <div className={`flex items-center justify-between gap-3 border-t border-[#e8ddd0]/80 px-6 py-4 ${tLine80}`}>
            <span className={`text-[0.9rem] font-semibold text-[#1d1a15] ${tInk}`}>Dunkelmodus</span>
            <ThemeToggle />
          </div>
        </div></DialogPrimitive.Content>
      </div></DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
