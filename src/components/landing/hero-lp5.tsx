"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export function HeroLP5() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  return (
    <section
      ref={containerRef}
      className="relative h-[80vh] w-full overflow-hidden"
    >
      <motion.div
        className="absolute inset-0 z-0"
        style={{ y }}
      >
        <Image
          src="/images/book-cover-hw1.jpg"
          alt="Buchcover Hallo Welt"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/30" />
      </motion.div>
      
      <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white p-4">
        <div className="space-y-6">
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                 <Badge variant="secondary" className="text-lg">Exklusiv</Badge>
            </motion.div>
            <motion.h1 
                className="font-headline text-4xl font-bold tracking-tighter sm:text-6xl xl:text-8xl/none text-balance"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
            >
            Das Original. Ungefiltert.
          </motion.h1>
          <motion.p 
            className="mx-auto max-w-[700px] md:text-xl"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            Tauchen Sie ein in das Buch, mit dem alles begann. Eine satirische Reise, die Sie zum Lachen, Weinen und Kopfschütteln bringen wird.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <Link href="/buchhandlung-paulik-reisch">
              <Button size="lg">
                Jetzt Exemplar sichern
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
