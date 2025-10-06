

"use client";

import { useState, useEffect, useMemo, useCallback, useTransition } from "react";
import { AnimatePresence, motion, useAnimationControls } from "framer-motion";
import { Palabrota } from "@/lib/firestore";
import { X, ChevronLeft, ChevronRight, Volume2, Loader2, Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

type View = "word" | "sentence";

function ProgressBar({ count, current, onSegmentClick, isPaused, onAnimationComplete }: { count: number; current: number; onSegmentClick: (index: number) => void; isPaused: boolean; onAnimationComplete: () => void; }) {
  const controls = useAnimationControls();
  
  useEffect(() => {
    if (isPaused) {
      controls.stop();
    } else {
      controls.start({
        width: "100%",
        transition: { duration: 5, ease: "linear" }
      });
    }
  }, [isPaused, controls, current]); // Rerun effect when current index changes to restart animation

  return (
    <div className="flex w-full gap-1 px-4 pt-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          onClick={() => onSegmentClick(i)}
          className="h-1 rounded-full flex-1 cursor-pointer bg-white/30 overflow-hidden"
        >
          <motion.div
            className="h-full rounded-full bg-white"
            initial={{ width: i < current ? "100%" : "0%" }}
            animate={ i === current ? controls : { width: i < current ? "100%" : "0%" }}
            transition={ i < current ? { duration: 0.1, ease: "linear" } : undefined}
            onAnimationComplete={() => {
                if (i === current && !isPaused) {
                    onAnimationComplete();
                }
            }}
          />
        </div>
      ))}
    </div>
  );
}


function GlareEffect() {
    return (
        <motion.div
            className="absolute inset-0 z-10"
            style={{
                background: "linear-gradient(135deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.4) 45%, rgba(255,255,255,0.4) 55%, rgba(255,255,255,0) 100%)",
                transform: "translateX(-100%) skewX(-25deg)",
            }}
            animate={{
                transform: ["translateX(-100%) skewX(-25deg)", "translateX(100%) skewX(-25deg)"],
            }}
            transition={{
                duration: 0.75,
                ease: "easeInOut",
            }}
        />
    )
}


export function PalabrotasStory({ words, onClose }: { words: Palabrota[], onClose: () => void }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [view, setView] = useState<View>("word");
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const currentWord = words[currentIndex];

  const paginate = useCallback((newDirection: number) => {
    let newIndex = currentIndex + newDirection;
    if (newIndex < 0) {
      newIndex = 0;
      return;
    } else if (newIndex >= words.length) {
      onClose(); // Close story when it ends
      return;
    }
    setDirection(newDirection);
    setCurrentIndex(newIndex);
    setView('word');
    setIsPaused(false);
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, [currentIndex, words.length, onClose]);
  
  const handlePlaySound = useCallback(() => {
    if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        setIsPaused(false);
        return;
    }

    const textToSpeak = view === 'word' ? currentWord.es : currentWord.beispiel;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = 'es-ES';
    
    utterance.onstart = () => {
        setIsPaused(true);
        setIsSpeaking(true);
    };

    utterance.onend = () => {
        setIsPaused(false);
        setIsSpeaking(false);
    };
    
    utterance.onerror = () => {
        setIsPaused(false);
        setIsSpeaking(false);
    }
    
    window.speechSynthesis.speak(utterance);
  }, [view, currentWord, isSpeaking]);
  
  const handleSegmentClick = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
    setView('word');
    setIsPaused(false);
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? "100%" : "-100%",
      opacity: 0,
    }),
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black z-50 flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
        <header className="absolute top-0 left-0 right-0 z-20">
            <ProgressBar 
              count={words.length} 
              current={currentIndex} 
              onSegmentClick={handleSegmentClick} 
              isPaused={isPaused}
              onAnimationComplete={() => paginate(1)} 
            />
             <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-2">
                    <Image
                      src="https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/p_und_r-logo.png?alt=media&token=e1b7c172-fa61-47f4-a4e4-f92fe0ffa522"
                      alt="Paulik & Reisch Logo"
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                    <span className="hidden sm:block font-headline font-semibold text-white">Paulik & Reisch</span>
                </div>
                <button onClick={onClose} className="text-white/50 hover:text-white">
                    <X size={32} />
                </button>
            </div>
        </header>

        {/* Mobile Navigation Tappable Areas */}
        <div className="md:hidden absolute top-12 left-0 h-full w-1/2 z-10" onClick={() => paginate(-1)}></div>
        <div className="md:hidden absolute top-12 right-0 h-full w-1/2 z-10" onClick={() => paginate(1)}></div>
        
        {/* Desktop Navigation Arrows */}
        <div className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 z-20">
            <button onClick={() => paginate(-1)} className="p-4 text-white/50 hover:text-white" disabled={currentIndex === 0}>
                <ChevronLeft size={48} />
            </button>
        </div>
        <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 z-20">
            <button onClick={() => paginate(1)} className="p-4 text-white/50 hover:text-white">
                <ChevronRight size={48} />
            </button>
        </div>

        <div className="flex-grow flex flex-col justify-center items-center overflow-hidden relative">
            <AnimatePresence initial={false} custom={direction}>
                <motion.div
                key={currentIndex}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 },
                }}
                className="absolute flex flex-col justify-center items-center text-white text-center px-12 w-full"
                >
                {view === "word" ? (
                    <>
                        <p className="text-2xl text-white/70">{currentWord.de}</p>
                        <div className="relative overflow-hidden my-4">
                            <h1 className="text-7xl md:text-8xl font-bold tracking-tighter text-balance" style={{ color: `hsl(${currentIndex * 10}, 80%, 70%)` }}>
                                {currentWord.es}
                            </h1>
                            {isSpeaking && <GlareEffect />}
                        </div>
                    </>
                ) : (
                    <div className="relative overflow-hidden">
                        <p className="text-2xl md:text-3xl italic">"{currentWord.beispiel}"</p>
                        {isSpeaking && <GlareEffect />}
                    </div>
                )}
                </motion.div>
            </AnimatePresence>
        </div>


        <footer className="w-full max-w-sm mx-auto p-4 z-20 flex items-center justify-center gap-4">
             <button
                onClick={() => setIsPaused(!isPaused)}
                className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                title={isPaused ? "Play" : "Pause"}
            >
                {isPaused ? <Play size={20} className="ml-0.5" /> : <Pause size={20} />}
            </button>
            <button
                onClick={handlePlaySound}
                className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                disabled={false}
            >
                {isSpeaking ? <Loader2 className="animate-spin" size={28}/> : <Volume2 size={28} />}
            </button>
            <div className="flex items-center bg-black/30 rounded-full p-1">
                <button
                onClick={() => setView("word")}
                className={cn("px-6 py-2 rounded-full text-white/70 font-semibold transition-colors", view === "word" && "bg-white/20 text-white")}
                >
                Wort
                </button>
                <button
                onClick={() => setView("sentence")}
                className={cn("px-6 py-2 rounded-full text-white/70 font-semibold transition-colors", view === "sentence" && "bg-white/20 text-white")}
                >
                Satz
                </button>
            </div>
        </footer>
    </motion.div>
  );
}
