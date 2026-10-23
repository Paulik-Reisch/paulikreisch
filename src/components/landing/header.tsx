"use client";

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Link from "next/link";
import { Logo } from "../ui/logo";
import { cn } from '@/lib/utils';
import { WorthaftIcon } from '../ui/icons/worthaft-icon';
import { Menu, X } from 'lucide-react';

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
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
  const showWorthaftLink = !isWorthaftPage;

  return (
    <>
      <header className={cn(
        "px-4 lg:px-6 h-[64px] flex items-center sticky top-0 z-40 w-full bg-white/95 backdrop-blur-sm transition-all duration-300",
        scrolled ? "border-b border-[#e8ddd0] shadow-[0_2px_16px_rgba(0,0,0,0.06)]" : "border-b border-transparent"
      )}>
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            <a className="flex items-center justify-center" href="/">
              <div className="flex items-center gap-2">
                <Logo className="h-8 w-auto" />
                <span className="font-headline font-semibold text-lg ml-2 hidden sm:inline text-[#1d1a15]">Paulik &amp; Reisch</span>
              </div>
            </a>
            {isWorthaftPage && (
              <div className="flex items-center gap-2 border-l border-[#e8ddd0] pl-3 sm:pl-4">
                <span className="worthaft-icon-shimmer shrink-0">
                  <WorthaftIcon className="h-6 w-6 text-primary" />
                </span>
                <h1 className="font-headline text-lg font-bold text-[#1d1a15] sm:text-xl">Worthaft</h1>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            {/* Desktop — Landing-Look */}
            <nav className="hidden md:flex items-center gap-3">
              {showWorthaftLink && (
                <Link
                  href="/worthaft"
                  className="inline-flex items-center gap-2 rounded-[10px] border-2 border-[#1d1a15] bg-white px-4 py-2 text-[0.9rem] font-semibold text-[#1d1a15] shadow-[0_3px_0_#1d1a15] hover:translate-y-[-1px] hover:shadow-[0_4px_0_#1d1a15] active:translate-y-[1px] active:shadow-[0_1px_0_#1d1a15] hover:bg-[#f7f2e7] transition-[transform,box-shadow,background-color]"
                >
                  <span className="worthaft-icon-shimmer">
                    <WorthaftIcon className="h-4 w-4" />
                  </span>
                  Worthaft
                </Link>
              )}
              <Link
                href="/shop"
                className="inline-flex items-center justify-center rounded-[10px] border-2 border-[#1d1a15] bg-[#ffe14d] px-5 py-2 text-[0.9rem] font-bold text-[#1d1a15] shadow-[0_3px_0_#1d1a15] hover:translate-y-[-1px] hover:shadow-[0_4px_0_#1d1a15] active:translate-y-[1px] active:shadow-[0_1px_0_#1d1a15] transition-[transform,box-shadow]"
              >
                Buch kaufen
              </Link>
            </nav>

            {/* Mobile burger */}
            <div className="md:hidden">
              <button
                aria-label={open ? "Menü schließen" : "Menü öffnen"}
                aria-expanded={open}
                onClick={() => setOpen(v => !v)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-[10px] border border-[#e8ddd0] bg-white shadow-sm transition-colors hover:bg-[#f7f2e7]"
              >
                {open ? <X className="h-5 w-5 text-[#1d1a15]" /> : <Menu className="h-5 w-5 text-[#1d1a15]" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <div
        aria-hidden={!open}
        className={cn(
          "fixed inset-0 z-50 md:hidden",
          open ? "pointer-events-auto visible" : "pointer-events-none invisible"
        )}
      >
        <button
          aria-label="Menü schließen"
          onClick={() => setOpen(false)}
          className={cn(
            "absolute inset-0 bg-[#1a1815]/40 backdrop-blur-[2px] transition-opacity duration-300",
            open ? "opacity-100" : "opacity-0"
          )}
        />
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation"
          className={cn(
            "absolute right-0 top-0 h-[100dvh] w-[88vw] max-w-[380px] bg-[#fdf8ee] shadow-[-20px_0_60px_rgba(0,0,0,0.18)] flex flex-col transition-transform duration-[320ms] ease-[cubic-bezier(0.32,0.72,0,1)] will-change-transform",
            open ? "translate-x-0" : "translate-x-full"
          )}
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          <div className="absolute left-0 top-0 h-full w-[18px] -translate-x-full touch-manipulation" aria-hidden="true" />
          <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-[#e8ddd0]/80">
            <Link href="/" onClick={() => setOpen(false)} className="flex items-center gap-2">
              <Logo className="h-7 w-auto" />
              <span className="font-headline font-semibold text-[1.05rem] text-[#1d1a15]">Paulik &amp; Reisch</span>
            </Link>
            <button
              aria-label="Menü schließen"
              onClick={() => setOpen(false)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white border border-[#e8ddd0] shadow-sm"
            >
              <X className="h-4 w-4 text-[#1d1a15]" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-6 py-8">
            <div className="flex flex-col">
              {showWorthaftLink && (
                <Link
                  href="/worthaft"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 py-4 text-[1.55rem] font-bold leading-tight tracking-[-0.015em] text-[#1d1a15] border-b border-[#e8ddd0] hover:text-[#9c2d22] transition-colors"
                >
                  <WorthaftIcon className="h-5 w-5" />
                  Worthaft
                </Link>
              )}
              <Link
                href="/shop"
                onClick={() => setOpen(false)}
                className="mt-6 inline-flex items-center justify-center rounded-[10px] border-2 border-[#1d1a15] bg-[#ffe14d] px-6 py-[14px] text-[1.05rem] font-bold text-[#1d1a15] shadow-[0_3px_0_#1d1a15] transition-[transform,box-shadow] active:translate-y-[1px] active:shadow-[0_1px_0_#1d1a15]"
              >
                Buch kaufen · 10,99 €
              </Link>
              <p className="mt-3 text-center text-[0.9rem] leading-snug text-[#6b6256]">
                5,0★ bei Amazon · 106 Seiten
              </p>

              <div className="mt-8 flex flex-col gap-2 text-[0.95rem]">
                <Link href="/impressum" onClick={() => setOpen(false)} className="text-[#6b6256] hover:text-[#1d1a15] hover:underline underline-offset-4">Impressum</Link>
                <Link href="/datenschutz" onClick={() => setOpen(false)} className="text-[#6b6256] hover:text-[#1d1a15] hover:underline underline-offset-4">Datenschutz</Link>
              </div>
            </div>
          </nav>

          <div className="px-6 pb-6 pt-4 text-[0.82rem] leading-relaxed text-[#9a9184] border-t border-[#e8ddd0]/60">
            Paulik &amp; Reisch · Satire, die den Schulwahnsinn ernst nimmt.
          </div>
        </div>
      </div>
    </>
  );
}
