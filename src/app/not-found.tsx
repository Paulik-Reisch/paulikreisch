import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/landing/header';
import { Footer } from '@/components/landing/footer';
import { Home } from 'lucide-react';
import { NotFoundBackButton } from './not-found-back-button';

export const metadata: Metadata = {
  title: 'Seite nicht gefunden',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-[#fffaf0] text-[#1d1a15] dark:bg-[#211d17] dark:text-[#f2ede3]">
      <Header />
      <main className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="grid w-full max-w-5xl items-center gap-10 rounded-[24px] border-2 border-[#e8ddd0] bg-white p-6 shadow-[0_6px_0_#e8ddd0] dark:border-[#3a352d] dark:bg-[#2a251e] dark:shadow-[0_6px_0_#0a0a0a] sm:p-10 md:grid-cols-[1fr_0.9fr] md:gap-10 lg:gap-14 lg:p-14">
          <div className="text-center md:text-left">
            <p className="inline-flex items-center gap-2 rounded-full border border-[#d8e4ff] bg-[#f1f5ff] px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-[#174bc2] dark:border-[#1a5aa8] dark:bg-[#16233b] dark:text-[#8fb8ff]">
              <span aria-hidden="true" className="h-2 w-2 rounded-full bg-[#2268ff]" />
              Seite nicht gefunden
            </p>
            <h1 className="mt-5 font-headline text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
              Hoppla. Diese Seite existiert nicht.
            </h1>
            <p className="mx-auto mt-4 max-w-md text-[#6d6459] dark:text-[#b6ad9c] md:mx-0">
              Die Adresse ist möglicherweise falsch oder die Seite wurde
              verschoben. Über die Startseite findest Du schnell zurück.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 md:justify-start">
              <Link
                href="/"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-[10px] border-2 border-[#1d1a15] bg-[#ffe14d] px-5 text-[0.9rem] font-bold text-[#1d1a15] shadow-[0_3px_0_#1d1a15] transition-[transform,box-shadow,background-color] hover:-translate-y-px hover:bg-[#ffeb7a] hover:shadow-[0_4px_0_#1d1a15] active:translate-y-px active:shadow-[0_1px_0_#1d1a15] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2268ff] focus-visible:ring-offset-2 dark:border-[#bfa100] dark:shadow-[0_3px_0_#6b5700] dark:hover:shadow-[0_4px_0_#6b5700] dark:active:shadow-[0_1px_0_#6b5700]"
              >
                <Home aria-hidden="true" className="h-4 w-4 shrink-0" />
                Zur Startseite
              </Link>
              <NotFoundBackButton />
            </div>
          </div>

          <div
            aria-hidden="true"
            className="relative mx-auto aspect-[4/3] w-full max-w-[440px] overflow-hidden rounded-[20px] border-2 border-dashed border-[#d9cdbb] bg-[#f7f2e7] dark:border-[#3a352d] dark:bg-[#241f19]"
          >
            <div className="absolute inset-5 rounded-[14px] border border-[#e8ddd0] bg-[linear-gradient(to_bottom,transparent_31px,#e8ddd0_32px)] bg-[length:100%_32px] dark:border-[#3a352d] dark:bg-[linear-gradient(to_bottom,transparent_31px,#3a352d_32px)]" />
            <svg
              viewBox="0 0 440 330"
              fill="none"
              className="absolute inset-0 h-full w-full"
            >
              <path
                d="M28 261C79 260 66 188 124 207S168 275 221 238 265 116 315 143 357 207 405 70"
                stroke="#2268ff"
                strokeDasharray="7 9"
                strokeLinecap="round"
                strokeWidth="4"
              />
              <path
                d="m394 78 13-12 3 18"
                stroke="#2268ff"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="4"
              />
              <circle cx="28" cy="261" r="8" fill="#ffe14d" stroke="#1d1a15" strokeWidth="3" />
            </svg>
            <div className="absolute left-1/2 top-[46%] flex h-[112px] w-[220px] -translate-x-1/2 -translate-y-1/2 rotate-[-7deg] items-center justify-center rounded-[18px] border-[3px] border-[#1d1a15] bg-[#ffe14d] shadow-[0_7px_0_#1d1a15] sm:h-[132px] sm:w-[260px]">
              <span className="font-headline text-[5.5rem] font-black leading-none tracking-[-0.08em] text-[#1d1a15] sm:text-[6.5rem]">
                404
              </span>
            </div>
            <div className="absolute bottom-5 right-4 rotate-[5deg] rounded-[8px] border-2 border-[#174bc2] bg-[#2268ff] px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-white shadow-[0_3px_0_#174bc2] sm:bottom-7 sm:right-7">
              Nicht verfügbar
            </div>
            <div className="absolute left-4 top-4 rounded-full border border-[#e8ddd0] bg-white/90 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-[#6d6459] dark:border-[#3a352d] dark:bg-[#2a251e]/90 dark:text-[#b6ad9c] sm:left-6 sm:top-6">
              ERROR
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
