"use client";

import { useState, useEffect } from "react";

interface TypewriterProps {
  texts: string[];
}

export function Typewriter({ texts }: TypewriterProps) {
  const [textIndex, setTextIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const typeSpeed = 100;
  const deleteSpeed = 50;
  const delay = 2000;

  useEffect(() => {
    // If deleting, delete one char at a time
    if (isDeleting) {
      if (subIndex > 0) {
        const timeoutId = setTimeout(() => {
          setSubIndex((prev) => prev - 1);
        }, deleteSpeed);
        return () => clearTimeout(timeoutId);
      } else {
        // Finished deleting, switch to next text and start typing
        setIsDeleting(false);
        setTextIndex((prev) => (prev + 1) % texts.length);
        return;
      }
    }

    // If typing, type one char at a time
    if (subIndex < texts[textIndex].length) {
      const timeoutId = setTimeout(() => {
        setSubIndex((prev) => prev + 1);
      }, typeSpeed);
      return () => clearTimeout(timeoutId);
    }
    
    // Finished typing, wait then start deleting
    const timeoutId = setTimeout(() => {
      setIsDeleting(true);
    }, delay);
    return () => clearTimeout(timeoutId);
    
  }, [subIndex, isDeleting, textIndex, texts]);

  return (
    <>
      {texts[textIndex].substring(0, subIndex)}
      <span className="animate-pulse font-light text-primary">|</span>
    </>
  );
}
