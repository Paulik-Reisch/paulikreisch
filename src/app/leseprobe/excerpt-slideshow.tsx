'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import styles from './leseprobe.module.css';

type Slide = {
  src: string;
  alt: string;
  type: 'image' | 'pdf';
};

export function ExcerptSlideshow({ slides }: { slides: Slide[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const pointerStartX = useRef<number | null>(null);

  if (slides.length === 0) {
    throw new Error('The excerpt slideshow requires at least one slide.');
  }

  const showSlide = (index: number) => {
    setActiveIndex((index + slides.length) % slides.length);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      showSlide(activeIndex - 1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      showSlide(activeIndex + 1);
    }
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLElement>) => {
    if (pointerStartX.current === null) return;

    const distance = event.clientX - pointerStartX.current;
    pointerStartX.current = null;
    if (Math.abs(distance) < 40) return;

    showSlide(activeIndex + (distance < 0 ? 1 : -1));
  };

  return (
    <section
      className={styles.slideshow}
      aria-label="Ausgewählte Seiten aus dem Buch"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onPointerDown={(event) => { pointerStartX.current = event.clientX; }}
      onPointerUp={handlePointerUp}
      onPointerCancel={() => { pointerStartX.current = null; }}
    >
      <div className={styles.slideFrame}>
        <div className={styles.slideTrack} style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
          {slides.map((slide, index) => (
            <figure
              key={slide.src}
              className={styles.slide}
              data-slide-type={slide.type}
              aria-hidden={activeIndex !== index}
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                sizes="(max-width: 760px) 90vw, 48vw"
                draggable={false}
                priority={index === 0}
                unoptimized={slide.type === 'pdf'}
              />
              {slide.type === 'image' && <figcaption>Screenshot folgt</figcaption>}
            </figure>
          ))}
        </div>
        <button
          type="button"
          className={`${styles.control} ${styles.previous}`}
          aria-label="Vorherige Seite"
          onClick={() => showSlide(activeIndex - 1)}
        >
          <ArrowLeft size={19} aria-hidden="true" />
        </button>
        <button
          type="button"
          className={`${styles.control} ${styles.next}`}
          aria-label="Nächste Seite"
          onClick={() => showSlide(activeIndex + 1)}
        >
          <ArrowRight size={19} aria-hidden="true" />
        </button>
      </div>
      <div className={styles.slideFooter}>
        <p aria-live="polite" aria-atomic="true">Seite {activeIndex + 1} von {slides.length}</p>
        <div className={styles.indicators} aria-label="Seite auswählen">
          {slides.map((slide, index) => (
            <button
              key={slide.src}
              type="button"
              aria-label={`Seite ${index + 1} anzeigen`}
              aria-current={activeIndex === index ? 'true' : undefined}
              className={activeIndex === index ? styles.activeIndicator : undefined}
              onClick={() => showSlide(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
