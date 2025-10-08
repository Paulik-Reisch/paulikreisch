
"use client";

import FallingText from '@/components/landing/FallingText';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-[100dvh] items-center justify-center bg-background text-foreground relative overflow-hidden">
      <div className="absolute inset-0 z-10 pointer-events-none">
        <FallingText
          text={`404 Seite nicht gefunden! Hier fliegen Wörter, nicht Seiten. Digitales Pech. Versuch's nochmal, Kumpel! Oder weine leise. Ist auch okay.`}
          highlightWords={["404", "Pech", "weine"]}
          highlightClass="highlighted"
          trigger="auto"
          backgroundColor="transparent"
          wireframes={false}
          gravity={0.3}
          fontSize="2rem"
          mouseConstraintStiffness={0.1}
        />
      </div>
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-center relative z-0"
      >
        <h1 className="font-headline font-extrabold text-[12rem] sm:text-[18rem] md:text-[24rem] leading-none tracking-tighter text-primary/10">
          404
        </h1>
      </motion.div>
    </div>
  );
}
