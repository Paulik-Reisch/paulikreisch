'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Star } from 'lucide-react';
import { logEventAction } from '@/app/actions';
import { useUser } from '@/firebase/provider';
import { usePathname } from 'next/navigation';
import { FUNNEL } from '@/lib/funnel';

export function InArticleBookBanner({ compact = false }: { compact?: boolean }) {
  const { user } = useUser();
  const pathname = usePathname();

  const handleClick = () => {
    const uid = user?.uid ?? 'anon';
    logEventAction(FUNNEL.events.bookClick, uid, pathname, { from: compact ? 'banner-compact' : 'banner' });
  };

  return (
    <div className={`not-prose rounded-xl border bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 overflow-hidden ${compact ? 'p-4' : 'p-5 md:p-6'} mt-8`}>
      <div className="flex gap-4 items-center">
        <img
          src="https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/buecher-cover%2Fhw1%2Fcover-hw1_900px.png?alt=media&token=42ce90a3-ed34-49d2-8e09-5258d0dfc484"
          alt="Hallo Welt Buchcover"
          className="w-14 h-18 md:w-20 md:h-28 object-cover rounded-lg shadow-md shrink-0"
          loading="lazy"
        />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold tracking-widest text-amber-700 dark:text-amber-300 uppercase">Gefällt dir der Stil?</p>
          <h3 className="font-headline font-bold text-base md:text-lg leading-tight mt-1">
            Davon gibt's 106 Seiten mehr: <span className="text-primary">Hallo Welt</span>
          </h3>
          <p className="text-xs md:text-sm text-muted-foreground mt-1 line-clamp-2">
            Die satirische Abrechnung mit Schule & Bürokratie — von Pfeffer bis Lernvollzugsanstalt.
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className="flex items-center gap-1 text-xs font-semibold">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> 4.8 · 127 Bewertungen
            </span>
            <span className="text-xs text-muted-foreground">·</span>
            <span className="text-xs font-bold text-primary">10,99 €</span>
            <span className="text-[11px] line-through text-muted-foreground">20,99 €</span>
          </div>
        </div>
        <div className="shrink-0 hidden sm:block">
          <Link href="/shop" onClick={handleClick}>
            <Button size={compact ? 'sm' : 'default'} className="gap-2 font-bold">
              Zum Buch <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
      <div className="sm:hidden mt-4">
        <Link href="/shop" onClick={handleClick} className="block">
          <Button size="sm" className="w-full gap-2 font-bold">
            Zum Buch — 10,99 € <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
