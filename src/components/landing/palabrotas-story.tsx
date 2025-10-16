
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { AnimatePresence, motion, useDragControls } from "framer-motion";
import { Palabrota } from "@/lib/firestore";
import { X, ChevronLeft, ChevronRight, Volume2, Pause, Play, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { ImageWithLoader as Image } from "@/components/ui/image-with-loader";
import { Badge } from "../ui/badge";

function ProgressBar({ count, current, onSegmentClick, isPaused, onAnimationComplete }: { count: number; current: number; onSegmentClick: (index: number) => void; isPaused: boolean; onAnimationComplete: () => void; }) {
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
              initial={{ width: i < current ? '100%' : '0%' }}
              animate={i === current && !isPaused ? { width: '100%' } : { width: i < current ? '100%' : '0%' }}
              transition={i === current && !isPaused ? { duration: 5, ease: "linear" } : { duration: 0 }}
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

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
    if (!children) return null;
    return (
        <div>
            <span className="text-xs text-neutral-400 font-semibold uppercase tracking-wider">{label}</span>
            <div className="mt-1 text-white">{children}</div>
        </div>
    )
}

function InfoSheet({ word, onClose }: { word: Palabrota, onClose: () => void }) {
    const controls = useDragControls();
    
    return (
         <motion.div
            className="absolute bottom-0 left-0 right-0 h-[85%] bg-neutral-900 rounded-t-3xl shadow-2xl z-30"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            drag="y"
            dragControls={controls}
            dragListener={false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.5 }}
            onDragEnd={(event, info) => {
              if (info.offset.y > 100) {
                onClose();
              }
            }}
        >
            <div 
                className="w-full h-8 flex justify-center items-center cursor-grab touch-none"
                onPointerDown={(e) => controls.start(e)}
            >
                <div className="w-10 h-1.5 bg-neutral-700 rounded-full"/>
            </div>
            <div className="p-6 pt-0 space-y-6 overflow-y-auto h-[calc(100%-2rem)]">
                <DetailRow label="Wortart">
                    <p className="font-semibold">{word.wortart}</p>
                </DetailRow>
                 <div className="grid grid-cols-2 gap-4">
                    <DetailRow label="Geschlecht">
                      <p>{word.geschlecht === 'm' ? 'Männlich' : word.geschlecht === 'w' ? 'Weiblich' : word.geschlecht || ''}</p>
                    </DetailRow>
                    <DetailRow label="Artikel">
                      <p>{word.artikel}</p>
                    </DetailRow>
                </div>
                <DetailRow label="Mehrzahl">
                    <p>{word.mehrzahl}</p>
                </DetailRow>
                <DetailRow label="Region">
                    <p>{word.region}</p>
                </DetailRow>
                 <DetailRow label="Anwendung">
                    <p>{word.anwendung}</p>
                </DetailRow>
                 <DetailRow label="Synonyme">
                    <p className="italic">{word.synonyme}</p>
                </DetailRow>
                <DetailRow label="Beispielsatz">
                    <blockquote className="border-l-4 border-white/30 pl-4 py-1 my-0 text-lg">"{word.beispiel}"</blockquote>
                </DetailRow>
                <DetailRow label="Kontext & Nuancen">
                    <p>{word.kontext}</p>
                </DetailRow>
                 <DetailRow label="Steigerung">
                    <p>{word.steigerung}</p>
                </DetailRow>
            </div>
        </motion.div>
    )
}


export function PalabrotasStory({ words, onClose }: { words: Palabrota[], onClose: () => void }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  
  const currentWord = words[currentIndex];
  const currentColor = `hsl(${currentIndex * 10}, 80%, 70%)`;


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
    setIsInfoOpen(false);
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, [currentIndex, words.length, onClose]);
  
  const handlePlaySound = useCallback(() => {
    if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
    }

    const textToSpeak = currentWord.es;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = 'es-ES';
    
    utterance.onstart = () => {
        setIsSpeaking(true);
    };

    utterance.onend = () => {
        setIsSpeaking(false);
    };
    
    utterance.onerror = () => {
        setIsSpeaking(false);
    }
    
    window.speechSynthesis.speak(utterance);
  }, [currentWord, isSpeaking]);
  
  const handleSegmentClick = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
    setIsInfoOpen(false);
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
              isPaused={isPaused || isSpeaking || isInfoOpen}
              onAnimationComplete={() => paginate(1)} 
            />
             <div className="flex items-center justify-between p-4">
                 <div className="flex items-center gap-3">
                    <Image
                      src="https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/p_und_r-logo.png?alt=media&token=e1b7c172-fa61-47f4-a4e4-f92fe0ffa522"
                      alt="Paulik & Reisch Logo"
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                    <span className="hidden sm:block font-headline font-semibold text-white">Paulik & Reisch</span>
                     <Badge
                        style={{ backgroundColor: currentColor, color: 'black' }}
                        className="border-none transition-colors duration-300"
                    >
                        BETA
                    </Badge>
                </div>
                <button onClick={onClose} className="text-white/50 hover:text-white">
                    <X size={32} />
                </button>
            </div>
        </header>

        {/* Mobile Navigation Tappable Areas */}
        <div className="md:hidden absolute top-12 left-0 h-full w-1/2 z-10" onMouseDown={() => setIsPaused(true)} onMouseUp={() => setIsPaused(false)} onTouchStart={() => setIsPaused(true)} onTouchEnd={() => setIsPaused(false)} onClick={() => paginate(-1)}></div>
        <div className="md:hidden absolute top-12 right-0 h-full w-1/2 z-10" onMouseDown={() => setIsPaused(true)} onMouseUp={() => setIsPaused(false)} onTouchStart={() => setIsPaused(true)} onTouchEnd={() => setIsPaused(false)} onClick={() => paginate(1)}></div>
        
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
                    <>
                        <p className="text-2xl text-white/70">{currentWord.de}</p>
                        <div className="relative overflow-hidden my-4">
                            <h1 className="text-7xl md:text-8xl font-bold tracking-tighter text-balance" style={{ color: currentColor }}>
                                {currentWord.es}
                            </h1>
                            {isSpeaking && <GlareEffect />}
                        </div>
                        {currentWord.phonetik && <p className="text-lg text-white/50 italic">{currentWord.phonetik}</p>}
                    </>
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
            >
                <Volume2 size={28} />
            </button>
            <button
                onClick={() => setIsInfoOpen(!isInfoOpen)}
                className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                title="Info"
            >
                <Info size={20} />
            </button>
        </footer>

        <AnimatePresence>
            {isInfoOpen && <InfoSheet word={currentWord} onClose={() => setIsInfoOpen(false)} />}
        </AnimatePresence>
    </motion.div>
  );
}
