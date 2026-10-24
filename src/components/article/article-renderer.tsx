'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { type Article } from '@/lib/firestore';
import { LeadWall } from './lead-wall';
import { ShareWall } from './share-wall';
import { SocialShare } from '@/components/ui/social-share';
import { InArticleBookBanner } from './in-article-book-banner';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { useUser } from '@/firebase/provider';
import { logEventAction } from '@/app/actions';
import { usePathname } from 'next/navigation';
import { FUNNEL, isSnoozed, isUnlocked as checkFunnelUnlocked, setUnlocked } from '@/lib/funnel';

function injectContextualShop(html: string): string {
  // Insert after 2nd </p> — contextual, not banner-blind
  const parts = html.split('</p>');
  if (parts.length < 3) return html;
  const injection = `
<div class="not-prose my-8 rounded-xl border border-amber-200 bg-amber-50/70 dark:bg-amber-950/15 dark:border-amber-900/30 p-4 md:p-5 flex gap-4 items-start">
  <img src="https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/buecher-cover%2Fhw1%2Fcover-hw1_900px.png?alt=media&token=42ce90a3-ed34-49d2-8e09-5258d0dfc484"
       alt="Hallo Welt Cover" class="w-14 h-20 md:w-16 md:h-22 object-cover rounded-md shadow-sm shrink-0" loading="lazy" />
  <div class="flex-1 min-w-0">
    <p class="text-[11px] font-bold tracking-widest uppercase text-amber-700 dark:text-amber-300 flex items-center gap-1.5"><span class="inline-block w-1.5 h-1.5 rounded-full bg-amber-500"></span> Aus dem Buch — Kapitel 3</p>
    <p class="text-sm md:text-[15px] leading-snug font-medium mt-1 text-foreground">Diese Szene stammt aus <em>Hallo Welt</em> — dort geht es noch tiefer in den Wahnsinn. 106 Seiten, 4.8★ bei echten Lesern.</p>
    <a href="/shop" data-shop-inject="true" class="inline-flex items-center gap-1.5 mt-2 text-sm font-bold text-primary hover:underline">Hier weiterlesen — 10,99&nbsp;€ auf Amazon &rarr;</a>
  </div>
</div>`;
  // Rejoin: first 2 paragraphs + injection + rest
  const before = parts.slice(0, 2).join('</p>') + '</p>';
  const after = parts.slice(2).join('</p>');
  return before + injection + after;
}

export function ArticleRenderer({ article }: { article: Article }) {
  const [isUnlocked, setIsUnlocked] = useState(article.accessLevel === 'free');
  const [showWall, setShowWall] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const { user, isUserLoading } = useUser();
  const pathname = usePathname();
  const trackedPercentages = useRef<Set<number>>(new Set());
  const wallTriggerRef = useRef(false);

  const wallActive = article.accessLevel !== 'free' && !isUnlocked;

  const injectedHtml = useMemo(() => injectContextualShop(article.content), [article.content]);

  // Initial unlock check: free OR already unlocked via cookie
  useEffect(() => {
    if (article.accessLevel === 'free') {
      setIsUnlocked(true);
      setShowWall(false);
      return;
    }
    if (checkFunnelUnlocked()) {
      setIsUnlocked(true);
      setShowWall(false);
      return;
    }
    setShowWall(false);
  }, [article.accessLevel]);

  const handleUnlock = () => {
    setIsUnlocked(true);
    setShowWall(false);
    setUnlocked();
  };

  // Track clicks on injected shop link
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const handler = (e: Event) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a[data-shop-inject]') as HTMLAnchorElement | null;
      if (link) {
        const uid = user?.uid ?? 'anon';
        logEventAction(FUNNEL.events.bookClick, uid, pathname, { from: 'in-article-inject' });
      }
    };
    el.addEventListener('click', handler);
    return () => el.removeEventListener('click', handler);
  }, [user, pathname, injectedHtml]);

  // Trigger: 60% scroll OR 45s timeout
  useEffect(() => {
    if (!wallActive || wallTriggerRef.current) return;
    const tryTrigger = () => {
      if (wallTriggerRef.current) return;
      if (isSnoozed(FUNNEL.storageKeys.wallDismissed)) return;
      wallTriggerRef.current = true;
      setShowWall(true);
    };
    const onScroll = () => {
      if (!contentRef.current || wallTriggerRef.current) return;
      const rect = contentRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const scrollPosition = window.scrollY + windowHeight;
      const elementTop = window.scrollY + rect.top;
      const height = rect.height;
      if (height <= 0) return;
      const totalScrolled = (scrollPosition - elementTop) / height * 100;
      if (totalScrolled >= FUNNEL.scrollTriggerPercent) tryTrigger();
    };
    const timer = setTimeout(tryTrigger, FUNNEL.timeTriggerMs);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', onScroll);
    };
  }, [wallActive]);

  useEffect(() => {
    if (!isUnlocked || isUserLoading || !user || !contentRef.current) return;
    const handleScroll = () => {
      if (!contentRef.current) return;
      const { top, height } = contentRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const scrollPosition = window.scrollY + windowHeight;
      const elementTop = window.scrollY + top;
      const totalScrolled = (scrollPosition - elementTop) / height * 100;
      const checkpoints = [25, 50, 75, 90];
      checkpoints.forEach(point => {
        if (totalScrolled >= point && !trackedPercentages.current.has(point)) {
          logEventAction('article_scroll_depth', user.uid, pathname, {
            articleSlug: article.slug,
            scrollPercentage: point,
          });
          trackedPercentages.current.add(point);
        }
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isUnlocked, isUserLoading, user, pathname, article.slug]);

  const WallComponent = () => {
    switch (article.accessLevel) {
      case 'leadwall':
        return <LeadWall onUnlock={handleUnlock} />;
      case 'sharewall':
        return <ShareWall article={article} onUnlock={handleUnlock} />;
      default:
        return null;
    }
  };

  return (
    <div className="relative">
      <div
        ref={contentRef}
        className={cn(
          'transition-all duration-500 prose prose-lg prose-serif dark:prose-invert max-w-none',
          wallActive && !showWall && 'max-h-[50rem] overflow-hidden relative',
          wallActive && showWall && 'max-h-[32rem] overflow-hidden relative'
        )}
        dangerouslySetInnerHTML={{ __html: injectedHtml }}
      />
      {wallActive && !showWall && (
        <div className="pointer-events-none absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-background to-transparent" />
      )}
      {(isUnlocked || !wallActive) && <InArticleBookBanner />}
      <AnimatePresence>
        {wallActive && showWall && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
            className="relative"
          >
            <div className="absolute bottom-full left-0 w-full h-32 bg-gradient-to-t from-muted via-muted/80 to-transparent pointer-events-none -mb-1" />
            <div className="relative pt-2">
              <WallComponent />
              <div className="mt-6">
                <InArticleBookBanner compact />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {isUnlocked && <SocialShare article={article} />}
      <div className="not-prose mt-10 flex flex-wrap gap-2 text-xs">
        <Link href="/a" className="inline-flex items-center rounded-full border px-3 py-1.5 hover:bg-muted transition-colors">
          Alle Artikel
        </Link>
        <Link href="/shop" className="inline-flex items-center rounded-full bg-primary text-primary-foreground px-3 py-1.5 font-semibold hover:opacity-90 transition-opacity">
          Buch entdecken — 10,99 €
        </Link>
      </div>
    </div>
  );
}
