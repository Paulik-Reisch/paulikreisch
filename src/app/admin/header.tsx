'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Button } from '@/components/ui/button';
import { LogoutButton } from './logout-button';
import Link from 'next/link';
import { Logo } from '@/components/ui/logo';
import { Home, BarChart3, Presentation, Sparkles, Users, BookOpen, Menu, Files, X } from 'lucide-react';

export function AdminHeader({ showUploads = false }: { showUploads?: boolean }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    const media = window.matchMedia('(min-width: 1280px)');
    const closeOnDesktop = () => { if (media.matches) setOpen(false); };
    media.addEventListener('change', closeOnDesktop);
    return () => media.removeEventListener('change', closeOnDesktop);
  }, []);
  const links = [
    { href: '/authors', label: 'Autoren', icon: Users },
    { href: '/lp', label: 'Landing Pages', icon: Presentation },
    { href: 'https://analytics.paulikreisch.de/', label: 'Analytics', icon: BarChart3 },
    ...(showUploads ? [{ href: '/upload', label: 'Dateien', icon: Files }] : []),
    { href: '/worthaft', label: 'Worthaft', icon: BookOpen },
    { href: '/seo', label: 'SEO', icon: Sparkles },
  ];
  const mobileLink = 'inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-[10px] border-2 border-[#1d1a15] bg-white px-4 py-2 text-[0.9rem] font-semibold text-[#1d1a15] shadow-[0_3px_0_#1d1a15] transition-[transform,box-shadow,background-color] hover:-translate-y-px hover:bg-[#f7f2e7] active:translate-y-px dark:border-[#6b6353] dark:bg-[#2a251e] dark:text-[#f2ede3] dark:shadow-[0_3px_0_#000000] dark:hover:bg-[#332d24]';
  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <header className="sticky top-0 z-40 flex h-16 w-full shrink-0 items-center border-b bg-background/95 px-4 backdrop-blur-sm lg:px-6">
        <div className="container mx-auto flex min-w-0 items-center justify-between gap-3">
          <Link href="/authors" aria-label="Admin-Startseite" className="flex shrink-0 items-center gap-3"><Logo className="h-8 w-auto" /><span className="font-headline text-lg font-semibold">Admin</span></Link>
          <nav aria-label="Verwaltung" className="hidden items-center gap-1 xl:flex">
            {links.map(({ href, label, icon: Icon }) => <Button key={href} variant="ghost" asChild><Link href={href} aria-current={pathname === href ? 'page' : undefined}><Icon className="mr-2 h-4 w-4" />{label}</Link></Button>)}
          </nav>
          <div className="hidden shrink-0 items-center gap-2 xl:flex"><Button variant="ghost" size="sm" asChild><Link href="https://paulikreisch.de/" aria-label="Zur Hauptseite"><Home className="h-4 w-4" /></Link></Button><LogoutButton /></div>
          <DialogPrimitive.Trigger asChild><Button variant="outline" size="icon" className="h-10 w-10 rounded-[10px] xl:hidden" aria-label="Menü öffnen"><Menu className="h-5 w-5" /></Button></DialogPrimitive.Trigger>
        </div>
      </header>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-[#1a1815]/40 backdrop-blur-[2px]" />
        <DialogPrimitive.Content aria-describedby={undefined} className="fixed right-3 top-3 z-50 flex max-h-[calc(100dvh-1.5rem)] w-[82vw] max-w-[340px] flex-col overflow-hidden rounded-[24px] border border-[#e8ddd0] bg-[#fdf8ee]/95 text-[#1d1a15] shadow-[-12px_12px_40px_rgba(0,0,0,0.18)] backdrop-blur-xl dark:border-[#3a352d] dark:bg-[#211d17]/95 dark:text-[#f2ede3]">
          <div className="flex items-center justify-between gap-3 border-b border-[#e8ddd0]/80 px-6 pb-4 pt-6 dark:border-[#3a352d]/80">
            <DialogPrimitive.Title className="flex items-center gap-2 font-headline text-[1.05rem] font-semibold"><Logo className="h-7 w-auto" />Admin</DialogPrimitive.Title>
            <DialogPrimitive.Close className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#e8ddd0] bg-white shadow-sm dark:border-[#3a352d] dark:bg-[#2a251e]" aria-label="Menü schließen"><X className="h-4 w-4" /></DialogPrimitive.Close>
          </div>
          <nav aria-label="Mobile Verwaltung" className="flex min-h-0 flex-col gap-4 overflow-y-auto px-6 py-6">
            {links.map(({ href, label, icon: Icon }) => <DialogPrimitive.Close key={href} asChild><Link href={href} className={mobileLink} aria-current={pathname === href ? 'page' : undefined}><Icon className="h-4 w-4 shrink-0" />{label}</Link></DialogPrimitive.Close>)}
            <DialogPrimitive.Close asChild><Link href="https://paulikreisch.de/" className={mobileLink}><Home className="h-4 w-4 shrink-0" />Zur Hauptseite</Link></DialogPrimitive.Close>
          </nav>
          <div className="border-t border-[#e8ddd0]/80 px-6 py-4 dark:border-[#3a352d]/80"><LogoutButton /></div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
