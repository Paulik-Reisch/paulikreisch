
"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palabrota } from '@/lib/firestore';
import { GraduationCap, Volume2 } from 'lucide-react';
import { ImageWithLoader as Image } from '@/components/ui/image-with-loader';

const mockWords: Partial<Palabrota>[] = [
    { de: "Dummkopf", es: "Gilipollas", phonetik: "chili-poy-yas" },
    { de: "Scheiße", es: "Mierda", phonetik: "mjer-da" },
    { de: "Verdammt", es: "Joder", phonetik: "cho-der" },
];

export function PalabrotasStoryMockup() {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % mockWords.length);
        }, 5000); // Switch every 5 seconds

        return () => clearInterval(interval);
    }, []);

    const currentWord = mockWords[currentIndex];

    return (
        <div className="my-8 flex justify-center">
            <div className="w-[280px] h-[500px] bg-neutral-900 rounded-3xl border-4 border-neutral-800 shadow-2xl overflow-hidden relative">
                {/* Header */}
                <div className="absolute top-0 left-0 right-0 z-20 p-3 space-y-2">
                    <div className="flex w-full gap-1">
                        {mockWords.map((_, i) => (
                            <div key={i} className="h-1 rounded-full flex-1 bg-white/30 overflow-hidden">
                                <AnimatePresence>
                                    {i < currentIndex && <motion.div className="h-full bg-white" initial={{ width: 0 }} animate={{ width: "100%" }} exit={{ width: "100%" }} />}
                                </AnimatePresence>
                                {i === currentIndex && <motion.div className="h-full bg-white" initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 5, ease: "linear" }} />}
                            </div>
                        ))}
                    </div>
                     <div className="flex items-center gap-2">
                        <Image
                            src="https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/p_und_r-logo.png?alt=media&amp;token=e1b7c172-fa61-47f4-a4e4-f92fe0ffa522"
                            alt="Logo"
                            width={24}
                            height={24}
                            className="rounded-full"
                        />
                        <span className="text-xs font-semibold text-white">Paulik &amp; Reisch</span>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-grow flex flex-col justify-center items-center text-white text-center px-4 w-full h-full">
                     <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            className="flex flex-col justify-center items-center"
                        >
                            <p className="text-lg text-white/70">{currentWord.de}</p>
                            <h2 className="text-5xl font-bold tracking-tighter text-balance" style={{ color: `hsl(${currentIndex * 60}, 80%, 70%)` }}>
                                {currentWord.es}
                            </h2>
                            <p className="text-md text-white/50 italic mt-2">{currentWord.phonetik}</p>
                        </motion.div>
                    </AnimatePresence>
                </div>

                 {/* Footer */}
                <div className="absolute bottom-0 left-0 right-0 z-20 p-4 flex justify-center">
                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white">
                        <Volume2 size={20} />
                    </div>
                </div>
            </div>
        </div>
    );
}
