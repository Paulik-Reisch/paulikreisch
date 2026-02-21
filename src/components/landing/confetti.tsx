"use client";

import { useEffect, useState, useRef } from 'react';

const COLORS = ['#fde132', '#00b3e3', '#ff6b6b', '#6bff6b'];

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  color: string;
  size: number;
}

export function Confetti({ onComplete, count = 150 }: { onComplete: () => void; count?: number }) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);
  const animationFrameIdRef = useRef<number>();

  useEffect(() => {
    const newPieces: ConfettiPiece[] = Array.from({ length: count }).map((_, i) => {
      const angle = Math.random() * Math.PI - 1.5 * Math.PI; // Shoot upwards
      const velocity = Math.random() * 8 + 4; // Initial velocity
      return {
        id: i,
        x: 50, // Start at horizontal center of the parent
        y: 100, // Start at the bottom of the parent
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        opacity: 1,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: Math.random() * 6 + 4,
      };
    });
    setPieces(newPieces);

    const animate = () => {
      setPieces(currentPieces => {
        const updatedPieces = currentPieces.map(p => {
          p.vy += 0.2; // Gravity
          p.x += p.vx;
          p.y += p.vy;
          p.rotation += p.rotationSpeed;
          if (p.y > 100) {
            p.opacity -= 0.02;
          }
          return p;
        }).filter(p => p.opacity > 0);

        if (updatedPieces.length === 0) {
          onComplete();
          return [];
        }

        animationFrameIdRef.current = requestAnimationFrame(animate);
        return updatedPieces;
      });
    };

    animationFrameIdRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };

  }, [onComplete, count]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-[100]">
      {pieces.map(p => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            opacity: p.opacity,
            transform: `translate(-50%, -50%) rotate(${p.rotation}deg)`,
          }}
        />
      ))}
    </div>
  );
}
