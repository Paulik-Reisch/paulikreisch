'use client';

import { useState } from 'react';
import { type Article } from '@/lib/firestore';
import { LeadWall } from './lead-wall';
import { ShareWall } from './share-wall';
import { SocialShare } from '@/components/ui/social-share';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';

export function ArticleRenderer({ article }: { article: Article }) {
  const [isUnlocked, setIsUnlocked] = useState(article.accessLevel === 'free');

  const wallActive = article.accessLevel !== 'free' && !isUnlocked;

  const handleUnlock = () => {
    setIsUnlocked(true);
  };

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
            <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-background to-transparent" />
            <div className="relative pt-24">
              <WallComponent />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isUnlocked && <SocialShare article={article} />}
    </div>
  );
}
