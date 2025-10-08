"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const EMOJIS = ['🤯', '😵', '🤔', '🤷', '💥', '🔥', '❓', '🚫', '💔', '💀', '👻', '🛰️', '🗺️', '🧭'];

interface Emoji {
  id: number;
  emoji: string;
  x: number;
  y: number;
  size: number;
  speed: number;
  rotation: number;
}

const FallingEmojis = () => {
  const [emojis, setEmojis] = useState<Emoji[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameId = useRef<number>();

  useEffect(() => {
    const generateEmoji = () => {
      if (!containerRef.current) return;
      const newEmoji: Emoji = {
        id: Date.now() + Math.random(),
        emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
        x: Math.random() * 100,
        y: -10,
        size: Math.random() * 24 + 16,
        speed: Math.random() * 2 + 1,
        rotation: Math.random() * 360,
      };
      setEmojis((prev) => [...prev, newEmoji]);
    };

    const emojiInterval = setInterval(generateEmoji, 200);

    const animate = () => {
      setEmojis((currentEmojis) =>
        currentEmojis.map(emoji => ({
          ...emoji,
          y: emoji.y + emoji.speed,
        })).filter(emoji => emoji.y < 120) // Remove when off-screen
      );
      animationFrameId.current = requestAnimationFrame(animate);
    };

    animationFrameId.current = requestAnimationFrame(animate);

    return () => {
      clearInterval(emojiInterval);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 -z-10 overflow-hidden">
      {emojis.map(({ id, emoji, x, y, size, rotation }) => (
        <div
          key={id}
          className="absolute"
          style={{
            left: `${x}vw`,
            top: `${y}vh`,
            fontSize: `${size}px`,
            transform: `rotate(${rotation}deg)`,
            userSelect: 'none',
          }}
        >
          {emoji}
        </div>
      ))}
    </div>
  );
};

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-[100dvh] items-center justify-center bg-background text-foreground relative overflow-hidden">
      <FallingEmojis />
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="font-headline font-extrabold text-[12rem] sm:text-[18rem] md:text-[24rem] leading-none tracking-tighter text-primary/80">
          404
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground -mt-8 md:-mt-12">
          Seite nicht gefunden. Das Internet ist wohl kaputt.
        </p>
      </motion.div>
    </div>
  );
}
