'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import styles from './leseprobe.module.css';

const MIN_ZOOM = 1;
const MAX_ZOOM = 4;

type Slide = {
  src: string;
  alt: string;
  type: 'image' | 'pdf';
};

export function ExcerptSlideshow({ slides }: { slides: Slide[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [zoomScale, setZoomScale] = useState(MIN_ZOOM);
  const [zoomOffset, setZoomOffset] = useState({ x: 0, y: 0 });
  const pointerStartX = useRef<number | null>(null);
  const zoomPointers = useRef(new Map<number, { x: number; y: number }>());
  const zoomGesture = useRef<{
    startDistance: number;
    startScale: number;
    startX: number;
    startY: number;
    startOffset: { x: number; y: number };
  } | null>(null);

  if (slides.length === 0) {
    throw new Error('The excerpt slideshow requires at least one slide.');
  }

  const showSlide = (index: number) => {
    setActiveIndex((index + slides.length) % slides.length);
  };
  const activeSlide = slides[activeIndex];

  const updateZoom = (scale: number) => {
    const nextScale = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, scale));
    setZoomScale(nextScale);
    if (nextScale === MIN_ZOOM) setZoomOffset({ x: 0, y: 0 });
  };

  const resetZoom = () => {
    setZoomScale(MIN_ZOOM);
    setZoomOffset({ x: 0, y: 0 });
  };

  // Navigation inside the zoom dialog always starts from a clean, unzoomed page.
  const navigateSlide = (delta: number) => {
    showSlide(activeIndex + delta);
    resetZoom();
  };

  const getPointerDistance = () => {
    const [first, second] = [...zoomPointers.current.values()];
    if (!first || !second) return 0;
    return Math.hypot(second.x - first.x, second.y - first.y);
  };

  const startZoomGesture = (pointerId: number) => {
    const pointer = zoomPointers.current.get(pointerId);
    if (!pointer) return;
    zoomGesture.current = {
      startDistance: zoomPointers.current.size > 1 ? getPointerDistance() : 0,
      startScale: zoomScale,
      startX: pointer.x,
      startY: pointer.y,
      startOffset: zoomOffset,
    };
  };

  const handleZoomPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    event.stopPropagation();
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    zoomPointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    startZoomGesture(event.pointerId);
  };

  const handleZoomPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!zoomPointers.current.has(event.pointerId)) return;
    zoomPointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });

    if (zoomPointers.current.size > 1) {
      const gesture = zoomGesture.current;
      if (gesture && gesture.startDistance > 0) {
        updateZoom(gesture.startScale * getPointerDistance() / gesture.startDistance);
      }
      return;
    }

    const gesture = zoomGesture.current;
    if (gesture && gesture.startScale > MIN_ZOOM) {
      setZoomOffset({
        x: gesture.startOffset.x + event.clientX - gesture.startX,
        y: gesture.startOffset.y + event.clientY - gesture.startY,
      });
    }
  };

  const handleZoomPointerEnd = (event: React.PointerEvent<HTMLDivElement>) => {
    event.stopPropagation();
    zoomPointers.current.delete(event.pointerId);
    const remainingPointerId = zoomPointers.current.keys().next().value;
    zoomGesture.current = null;
    if (remainingPointerId !== undefined) startZoomGesture(remainingPointerId);
  };

  const handleZoomWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    updateZoom(zoomScale * (event.deltaY < 0 ? 1.15 : 1 / 1.15));
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

  // Arrow keys must also work while the modal zoom dialog has focus.
  const handleDialogKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      navigateSlide(-1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      navigateSlide(1);
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
        <button
          type="button"
          className={styles.zoomButton}
          aria-label="Aktuelle Seite vergrößern"
          onPointerDown={(event) => event.stopPropagation()}
          onClick={() => setIsZoomOpen(true)}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M8 3H3v5M3 3l6 6M16 3h5v5M21 3l-6 6M3 16v5h5M3 21l6-6M21 16v5h-5M21 21l-6-6" />
          </svg>
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
      <Dialog
        open={isZoomOpen}
        onOpenChange={(open) => {
          setIsZoomOpen(open);
          if (!open) resetZoom();
        }}
      >
        <DialogContent className={styles.zoomDialog} onKeyDown={handleDialogKeyDown}>
          <DialogTitle className={styles.visuallyHidden}>Vergrößerte Buchseite</DialogTitle>
          <div
            className={styles.zoomImageFrame}
            data-zoom-scale={zoomScale.toFixed(2)}
            onWheel={handleZoomWheel}
            onPointerDown={handleZoomPointerDown}
            onPointerMove={handleZoomPointerMove}
            onPointerUp={handleZoomPointerEnd}
            onPointerCancel={handleZoomPointerEnd}
            onDragStart={(event) => event.preventDefault()}
          >
            <Image
              src={activeSlide.src}
              alt={activeSlide.alt}
              fill
              sizes="96vw"
              className={styles.zoomImage}
              style={{ transform: `translate(${zoomOffset.x}px, ${zoomOffset.y}px) scale(${zoomScale})` }}
              draggable={false}
              unoptimized={activeSlide.type === 'pdf'}
            />
          </div>
          <div className={styles.zoomControls} role="group" aria-label="Seitennavigation und Bildzoom">
            <button
              type="button"
              aria-label="Vorherige Seite"
              onClick={() => navigateSlide(-1)}
            >
              <ArrowLeft aria-hidden="true" />
            </button>
            <div className={styles.zoomCluster}>
              <button
                type="button"
                aria-label="Verkleinern"
                onClick={() => updateZoom(zoomScale / 1.5)}
                disabled={zoomScale === MIN_ZOOM}
              >
                <ZoomOut aria-hidden="true" />
              </button>
              <output aria-live="polite">{Math.round(zoomScale * 100)}%</output>
              <button
                type="button"
                aria-label="Vergrößern"
                onClick={() => updateZoom(zoomScale * 1.5)}
                disabled={zoomScale === MAX_ZOOM}
              >
                <ZoomIn aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label="Zoom zurücksetzen"
                onClick={resetZoom}
              >
                <RotateCcw aria-hidden="true" />
              </button>
            </div>
            <button
              type="button"
              aria-label="Nächste Seite"
              onClick={() => navigateSlide(1)}
            >
              <ArrowRight aria-hidden="true" />
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
