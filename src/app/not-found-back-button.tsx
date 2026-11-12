'use client';

import { ArrowLeft } from 'lucide-react';

export function NotFoundBackButton() {
  return (
    <button
      type="button"
      onClick={() => window.history.back()}
      className="inline-flex h-12 items-center justify-center gap-2 rounded-[10px] border-2 border-[#1d1a15] bg-white px-5 text-[0.9rem] font-semibold text-[#1d1a15] shadow-[0_3px_0_#1d1a15] transition-[transform,box-shadow,background-color] hover:-translate-y-px hover:bg-[#f7f2e7] hover:shadow-[0_4px_0_#1d1a15] active:translate-y-px active:shadow-[0_1px_0_#1d1a15] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2268ff] focus-visible:ring-offset-2 dark:border-[#6b6353] dark:bg-[#2a251e] dark:text-[#f2ede3] dark:hover:bg-[#332d24] dark:shadow-[0_3px_0_#000000] dark:hover:shadow-[0_4px_0_#000000] dark:active:shadow-[0_1px_0_#000000]"
    >
      <ArrowLeft aria-hidden="true" className="h-4 w-4 shrink-0" />
      Zurück
    </button>
  );
}
