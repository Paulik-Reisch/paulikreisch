'use client';

import { useState, useEffect, useRef } from 'react';
import { type Article } from '@/lib/firestore';
import { LeadWall } from './lead-wall';
import { ShareWall } from './share-wall';
import { SocialShare } from '@/components/ui/social-share';
import { InArticleBookBanner } from './in-article-book-banner';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { useUser } from '@/firebase/provider';
import { logEventAction } from '@/app/actions';
import { usePathname } from 'next/navigation';
import { FUNNEL, isSnoozed, isUnlocked, setUnlocked } from '@/lib/funnel';

export function ArticleRenderer({ article }: { article: Article }) {
  const [isUnlocked, setIsUnlocked] = useState(article.accessLevel === 'free');
  const [showWall, setShowWall] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const { user, isUserLoading } = useUser();
  const pathname = usePathname();
  const trackedPercentages = useRef<Set<number>>(new Set());
  const wallTriggerRef = useRef(false);

  const wallActive = article.accessLevel !== 'free' && !isUnlocked;

  // Initial unlock check: free OR already unlocked via cookie
  useEffect(() => {
    if (article.accessLevel === 'free') {
      setIsUnlocked(true);
      setShowWall(false);
      return;
    }
    if (isUnlocked()) {
      setIsUnlocked(true);
      setShowWall(false);
      return;
    }
    if (isSnoozed(FUNNEL.storageKeys.wallDismissed)) {
      // still gated but we respect snooze? No, we still show after trigger but don't annoy
      // keep wallActive true, but showWall will be delayed anyway
    }
    // gated: don't show wall immediately — wait for trigger
    setShowWall(false);
  }, [article.accessLevel]);

  const handleUnlock = () => {
    setIsUnlocked(true);
    setShowWall(false);
    setUnlocked();
  };

  // Trigger: 60% scroll OR 45s timeout
  useEffect(() => {
    if (!wallActive || wallTriggerRef.current) return;

    const tryTrigger = () => {
      if (wallTriggerRef.current) return;
      if (isSnoozed(FUNNEL.storageKeys.wallDismissed)) {
        // if snoozed, never trigger in this session
        return;
      }
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
      if (totalScrolled >= FUNNEL.scrollTriggerPercent) {
        tryTrigger();
      }
    };

    const timer = setTimeout(tryTrigger, FUNNEL.timeTriggerMs);
    window.addEventListener('scroll', onScroll, { passive: true });
    // initial check (for short articles)
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
      const { top, bottom, height } = contentRef.current.getBoundingClientRect();
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
        dangerouslySetInnerHTML={{ __html: article.content }}
      />
      {/* Soft gradient when wall not yet triggered but content is gated */}
      {wallActive && !showWall && (
        <div className="pointer-events-none absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-background to-transparent" />
      )}
      {/* In-article banner: shown either after unlock OR as teaser before wall */}
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
              {/* Even when walled, show teaser banner below wall for SEO/upsell */}
              <div className="mt-6">
                <InArticleBookBanner compact />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {isUnlocked && <SocialShare article={article} />}
    </div>
  );
}
