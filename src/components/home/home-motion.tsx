'use client';

import { useEffect } from 'react';

/** Progressive enhancement: all text remains visible without JS or motion. */
export function HomeMotion() {
  useEffect(() => {
    const media = window.matchMedia('(min-width: 960px) and (prefers-reduced-motion: no-preference) and (pointer: fine)');
    const image = document.querySelector<HTMLElement>('[data-home-parallax]');
    if (!image) return;
    let frame = 0;
    const render = () => {
      frame = 0;
      if (!media.matches) { image.style.transform = ''; return; }
      const rect = image.parentElement?.getBoundingClientRect();
      if (!rect || rect.bottom < 0 || rect.top > window.innerHeight) return;
      const offset = Math.max(-24, Math.min(24, -rect.top * .045));
      image.style.transform = `translate3d(0, ${offset}px, 0) scale(1.06)`;
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(render); };
    window.addEventListener('scroll', schedule, { passive: true });
    media.addEventListener('change', schedule);
    schedule();
    return () => {
      window.removeEventListener('scroll', schedule);
      media.removeEventListener('change', schedule);
      cancelAnimationFrame(frame);
      image.style.transform = '';
    };
  }, []);
  return null;
}
