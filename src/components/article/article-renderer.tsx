'use client';

import { useState, useEffect, useRef } from 'react';
import { type Article } from '@/lib/firestore';
import { LeadWall } from './lead-wall';
import { ShareWall } from './share-wall';
import { SocialShare } from '@/components/ui/social-share';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { useUser } from '@/firebase/provider';
import { logEventAction } from '@/app/actions';
import { usePathname } from 'next/navigation';

export function ArticleRenderer({ article }: { article: Article }) {
  const [isUnlocked, setIsUnlocked] = useState(article.accessLevel === 'free');
  const contentRef = useRef<HTMLDivElement>(null);
  const { user, isUserLoading } = useUser();
  const pathname = usePathname();
  const trackedPercentages = useRef<Set<number>>(new Set());

  const wallActive = article.accessLevel !== 'free' && !isUnlocked;

  const handleUnlock = () => {
    setIsUnlocked(true);
  };
  
  useEffect(() => {
    if (!isUnlocked || isUserLoading || !user || !contentRef.current) return;

    const handleScroll = () => {
      if (!contentRef.current) return;

      const { top, bottom, height } = contentRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      const scrollPosition = window.scrollY + windowHeight;
      const elementBottom = window.scrollY + bottom;
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
    // Initial check in case article is already visible
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
          'transition-all duration-500',
          wallActive && 'max-h-[30rem] overflow-hidden'
        )}
        dangerouslySetInnerHTML={{ __html: article.content }}
      />
      <AnimatePresence>
        {wallActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-muted to-transparent" />
            <div className="relative pt-4">
              <WallComponent />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isUnlocked && <SocialShare article={article} />}
    </div>
  );
}
