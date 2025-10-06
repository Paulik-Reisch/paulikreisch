
"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { textToSpeechAction } from "@/app/admin/actions";
import { useActionState } from "react-dom";
import { Palabrota } from "@/lib/firestore";
import { X, ChevronLeft, ChevronRight, Volume2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type View = "word" | "sentence";

function ProgressBar({ count, current, onSegmentClick }: { count: number; current: number; onSegmentClick: (index: number) => void; }) {
  return (
    <div className="flex gap-1 p-2">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          onClick={() => onSegmentClick(i)}
          className="h-1 rounded-full flex-1 cursor-pointer bg-white/20"
        >
          <motion.div
            className="h-full rounded-full bg-white"
            initial={{ width: i < current ? "100%" : "0%" }}
            animate={{ width: i === current ? "100%" : (i < current ? "100%" : "0%") }}
            transition={{ duration: 5, ease: "linear" }}
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
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  
  const [ttsState, ttsAction, isTtsPending] = useActionState(textToSpeechAction, { audio: undefined, error: undefined });

  const currentWord = words[currentIndex];

  const paginate = (newDirection: number) => {
    const newIndex = currentIndex + newDirection;
    if (newIndex >= 0 && newIndex < words.length) {
      setDirection(newDirection);
      setCurrentIndex(newIndex);
      setView('word');
      setAudioSrc(null);
    }
  };
  
  const handlePlaySound = useCallback(() => {
    const textToSpeak = view === 'word' ? currentWord.es : currentWord.beispiel;
    const formData = new FormData();
    formData.append("text", textToSpeak);
    ttsAction(formData);
  }, [view, currentWord, ttsAction]);
  
  useEffect(() => {
    if (ttsState.audio) {
      setAudioSrc(ttsState.audio);
      const audio = new Audio(ttsState.audio);
      audio.play();
      audio.onended = () => setAudioSrc(null);
    }
  }, [ttsState.audio]);
  
  useEffect(() => {
    const timer = setTimeout(() => {
        paginate(1);
    }, 5000);
    return () => clearTimeout(timer);
  }, [currentIndex]);


  const variants = {
    enter: (direction: number) => {
      return {
        x: direction > 0 ? "100%" : "-100%",
        opacity: 0,
      };
    },
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => {
      return {
        zIndex: 0,
        x: direction < 0 ? "100%" : "-100%",
        opacity: 0,
      };
    },
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black z-50 flex flex-col justify-between"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <header className="absolute top-0 left-0 right-0 z-20">
        <ProgressBar count={words.length} current={currentIndex} onSegmentClick={setCurrentIndex} />
        <button onClick={onClose} className="absolute top-4 right-4 text-white/50 hover:text-white">
          <X size={32} />
        </button>
      </header>

      <div className="absolute left-0 top-1/2 -translate-y-1/2 z-20">
          <button onClick={() => paginate(-1)} className="p-4 text-white/50 hover:text-white" disabled={currentIndex === 0}>
             <ChevronLeft size={48} />
          </button>
      </div>
      <div className="absolute right-0 top-1/2 -translate-y-1/2 z-20">
          <button onClick={() => paginate(1)} className="p-4 text-white/50 hover:text-white" disabled={currentIndex === words.length - 1}>
            <ChevronRight size={48} />
          </button>
      </div>

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
          className="flex-grow flex flex-col justify-center items-center text-white text-center px-12"
        >
          {view === "word" ? (
            <>
                <p className="text-2xl text-white/70">{currentWord.de}</p>
                <div className="relative overflow-hidden my-4">
                    <h1 className="text-8xl font-bold tracking-tighter" style={{ color: `hsl(${currentIndex * 10}, 80%, 70%)` }}>
                        {currentWord.es}
                    </h1>
                     {audioSrc && <GlareEffect />}
                </div>
            </>
          ) : (
            <div className="relative overflow-hidden">
                <p className="text-3xl italic">"{currentWord.beispiel}"</p>
                {audioSrc && <GlareEffect />}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <footer className="w-full max-w-sm mx-auto p-4 z-20 flex items-center justify-center gap-4">
        <button
            onClick={handlePlaySound}
            className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20"
            disabled={isTtsPending}
        >
            {isTtsPending ? <Loader2 className="animate-spin" size={28}/> : <Volume2 size={28} />}
        </button>
        <div className="flex items-center bg-black/30 rounded-full p-1">
            <button
              onClick={() => setView("word")}
              className={cn("px-6 py-2 rounded-full text-white/70 font-semibold", view === "word" && "bg-white/20 text-white")}
            >
              Wort
            </button>
            <button
              onClick={() => setView("sentence")}
              className={cn("px-6 py-2 rounded-full text-white/70 font-semibold", view === "sentence" && "bg-white/20 text-white")}
            >
              Satz
            </button>
        </div>
      </footer>
    </motion.div>
  );
}
