'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

const POPUP_STORAGE_KEY = 'worthaft_popup_seen_v1';

export function WorthaftPopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasSeenPopup = sessionStorage.getItem(POPUP_STORAGE_KEY);
    if (!hasSeenPopup) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        sessionStorage.setItem(POPUP_STORAGE_KEY, 'true');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, []);

  const closePopup = () => {
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closePopup}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className="relative p-4"
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={closePopup}
              className="absolute -top-2 -right-2 z-10 h-9 w-9 rounded-full bg-background/80 text-foreground/80 hover:bg-background hover:text-foreground"
              aria-label="Schließen"
            >
              <X className="h-5 w-5" />
            </Button>
            <Link href="/worthaft" passHref>
              <motion.div
                whileHover={{ scale: 1.05, rotate: -1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                className="cursor-pointer"
              >
                <Image
                  src="https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulikreisch.firebasestorage.app/o/logos%2Fworthaft-svg-pop.svg?alt=media&token=58d0f0ef-bbfc-4b8a-9a37-360ab65bbd8c"
                  alt="Worthaft Spiel Popup"
                  width={500}
                  height={500}
                  priority
                  className="drop-shadow-2xl"
                />
              </motion.div>
            </Link>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
