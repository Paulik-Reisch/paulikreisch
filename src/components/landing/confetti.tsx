"use client";

import { useEffect, useState } from 'react';

const NUM_CONFETTI = 50;
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

export function Confetti({ onComplete }: { onComplete: () => void }) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    const newPieces: ConfettiPiece[] = Array.from({ length: NUM_CONFETTI }).map((_, i) => {
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
    
    const animationFrame = requestAnimationFrame(animate);

    function animate() {
      setPieces(currentPieces => {
        const updatedPieces = currentPieces.map(p => {
          // Apply gravity
          p.vy += 0.2;
          // Update position
          p.x += p.vx;
          p.y += p.vy;
          // Update rotation
          p.rotation += p.rotationSpeed;
          // Fade out
          if (p.y > 100) {
              p.opacity -= 0.02;
          }
          return p;
        }).filter(p => p.opacity > 0);

        if (updatedPieces.length === 0) {
            onComplete();
            return [];
        }

        return updatedPieces;
      });

      requestAnimationFrame(animate);
    }
    
    return () => cancelAnimationFrame(animationFrame);

  }, [onComplete]);


  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
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
            transition: 'transform 0.1s linear',
          }}
        />
      ))}
    </div>
  );
}