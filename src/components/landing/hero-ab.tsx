"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Product } from "@/lib/firestore";

// 5 A/B variants — copy aus preview.html (Werkstatt) 1:1
// hero-13 lehrerin, hero-01 papier/marker, hero-04 schulflur→03 tafel, hero-12 zug, hero-16 vater-sohn
type HeroVariant = {
  id: string;
  eyebrow: string;
  head: string;
  sub: string;
  img: string; // public/hero-ab/...
  alt: string;
  variant: "light" | "dark";
  objectPosition: string;
};

const HEROS: HeroVariant[] = [
  {
    id: "hero-lehrerin",
    eyebrow: "Hallo Welt · Satirischer Roman · Band 1",
    head: "Die Wahrheit über den Lehreralltag.",
    sub: "Der Unterricht von der anderen Seite des Pults: ehrlich, böse, herzlich. Das perfekte Geschenk für Lehrkräfte mit Humor — und für alle, die ihnen eines schulden.",
    img: "/hero-ab/hero-13-lehrerin.jpg",
    alt: "Eine Lehrerin lacht herzlich und hält das Buch „Hallo Welt\" vor der Klassentafel",
    variant: "light",
    objectPosition: "62% 28%",
  },
  {
    id: "hero-papier",
    eyebrow: "Hallo Welt · Satirischer Roman · Band 1",
    head: "Ein Buch gegen den Schulstress.",
    sub: "106 Seiten Ventil gegen Klausuren, Zeugnissprache und Heftführung. Satire, die den Schulwahnsinn ernst nimmt — damit du es nicht mehr musst.",
    img: "/hero-ab/hero-01-papier.jpg",
    alt: "Das Buch „Hallo Welt\" steht vor einem großen gelben Marker-Schwung auf Papier",
    variant: "light",
    objectPosition: "78% 42%",
  },
  {
    id: "hero-tafel",
    eyebrow: "Hallo Welt · Satirischer Roman · Band 1",
    head: "Überleben in der Lernanstalt.",
    sub: "Aus 13 Jahren Feldforschung: Vertretungsstunden, Sitzordnungen, Zeugniskonferenzen. Der Schulalltag als Roman — mit Herz, ohne Schonung.",
    img: "/hero-ab/hero-03-tafel.jpg",
    alt: "Das Buch „Hallo Welt\" steht auf einer Bank in einem leeren Schulflur mit Spinden im Morgenlicht",
    variant: "light",
    objectPosition: "72% 40%",
  },
  {
    id: "hero-zug",
    eyebrow: "Hallo Welt · Satirischer Roman · Band 1",
    head: "Lachen über den Schulwahnsinn.",
    sub: "Nebenwirkung Leselust: Eine Leserin verpasste ihren Halt und lief 30 Kilometer zurück. „Es hat sich gelohnt\", sagt sie. Deine Zugfahrt: verloren. Deine Laune: gerettet.",
    img: "/hero-ab/hero-12-zug-lachen.jpg",
    alt: "Eine junge Frau lacht beim Lesen des Buches „Hallo Welt\" am Zugfenster",
    variant: "dark",
    objectPosition: "100% 42%",
  },
  {
    id: "hero-vater-sohn",
    eyebrow: "Hallo Welt · Satirischer Roman · Band 1",
    head: "Für alle, die es überlebt haben.",
    sub: "Vater und Sohn auf dem Sofa, ein Buch, viel Gelächter: Der Schulwahnsinn verbindet Generationen. 106 Seiten zum Wiedererkennen — und Weiterempfehlen.",
    img: "/hero-ab/hero-16-vater-sohn.jpg",
    alt: "Vater und Sohn sitzen auf dem Sofa und lachen gemeinsam über das Buch „Hallo Welt\"",
    variant: "light",
    objectPosition: "58% 32%",
  },
];

function pickRandomIndex(): number {
  // ?hero=1..5 erzwingt Variante (Debug), sonst jedes Reload neu random
  try {
    const sp = new URLSearchParams(window.location.search);
    const q = sp.get("hero");
    if (q !== null) {
      const n = parseInt(q, 10) - 1;
      if (!Number.isNaN(n) && n >= 0 && n < HEROS.length) return n;
    }
  } catch {}
  return Math.floor(Math.random() * HEROS.length);
}

export function HeroAb({ product }: { product?: Product }) {
  const [idx, setIdx] = useState<number | null>(null);
  const [isIn, setIsIn] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    setIdx(pickRandomIndex());
    // dataLayer hook — GTM-ready, respect previous hero View logic
    try {
      const id = HEROS[pickRandomIndex()]?.id; // fallback, real is idx below
      // fire after idx known via separate effect
    } catch {}
  }, []);

  const hero = idx !== null ? HEROS[idx] : null;

  // reveal + parallax + dataLayer
  useEffect(() => {
    if (!ref.current || idx === null) return;
    const el = ref.current;
    const h = HEROS[idx];
    // reveal
    const t = setTimeout(() => setIsIn(true), 40);
    // hero_view once
    try {
      (window as unknown as { dataLayer?: unknown[] }).dataLayer = (window as unknown as { dataLayer?: unknown[] }).dataLayer || [];
      ((window as unknown as { dataLayer: unknown[] }).dataLayer as unknown[]).push({ event: "hero_view", hero: h.id, headline: h.head });
      // also gtag if present
      const w = window as unknown as { gtag?: (...a: unknown[]) => void };
      w.gtag?.("event", "hero_view", { hero_variant: h.id });
    } catch {}
    return () => clearTimeout(t);
  }, [idx]);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const bg = el.querySelector<HTMLImageElement>("[data-hero-bg]");
    if (!bg) return;
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fine = window.matchMedia("(pointer: fine)");
    if (m.matches || !fine.matches) return;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        const r = el.getBoundingClientRect();
        const vh = window.innerHeight;
        if (r.bottom < -80 || r.top > vh + 80) return;
        const p = (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2);
        bg.style.transform = `translate3d(0,${(p * 6).toFixed(2)}%,0) scale(1.06)`;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [idx]);

  // SSR fallback: render first variant hidden until hydrates → avoid CLS, LCP still valid
  const renderHero = hero ?? HEROS[0];
  const isDark = renderHero.variant === "dark";

  return (
    <section
      ref={ref}
      aria-labelledby="hero-ab-heading"
      data-hero={renderHero.id}
      className={
        "hero-stage relative flex min-h-[clamp(540px,88vh,860px)] items-center overflow-hidden isolate " +
        (isDark ? "hero--dark text-[#f7f2e7]" : "hero--light text-[#1d1a15]") +
        " max-md:min-h-[clamp(560px,96vh,820px)] max-md:items-end max-md:pb-[clamp(28px,6vw,56px)]"
      }
      style={{ background: isDark ? "#13110e" : "#f7f2e7" }}
    >
      {/* Backdrop — hidden on mobile per spec */}
      <Image
        data-hero-bg
        src={renderHero.img}
        alt={renderHero.alt}
        fill
        priority
        fetchPriority="high"
        sizes="100vw"
        className="hero-bg object-cover -z-[2] will-change-transform max-md:hidden"
        style={{ objectPosition: renderHero.objectPosition }}
      />
      {/* Scrim — gradients aus Werkstatt */}
      <div
        aria-hidden="true"
        className="hero-scrim absolute inset-0 -z-[1] max-md:hidden"
        style={
          isDark
            ? {
                background:
                  "linear-gradient(90deg, rgba(16,14,11,0.94) 0%, rgba(16,14,11,0.84) 34%, rgba(16,14,11,0.48) 58%, rgba(16,14,11,0.08) 78%, rgba(16,14,11,0) 90%), linear-gradient(0deg, rgba(10,9,7,0.35) 0%, rgba(10,9,7,0) 26%)",
              }
            : {
                background:
                  "linear-gradient(90deg, rgba(247,242,231,0.97) 0%, rgba(247,242,231,0.92) 32%, rgba(247,242,231,0.62) 52%, rgba(247,242,231,0.12) 70%, rgba(247,242,231,0) 82%), linear-gradient(0deg, rgba(29,26,21,0.1) 0%, rgba(29,26,21,0) 22%)",
              }
        }
      />
      {/* Mobile: paper background, no image */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-[1] hidden max-md:block"
        style={{
          background: isDark
            ? "linear-gradient(180deg, #1a1815 0%, #13110e 60%, #0f0e0c 100%)"
            : "linear-gradient(180deg, #f7f2e7 0%, #efe7d5 100%)",
        }}
      />

      <div className="hero-in relative w-full">
        <div className="mx-auto max-w-[1180px] px-[clamp(18px,4vw,40px)]">
          <div
            className={
              "hero-copy max-w-[36em] " +
              (isIn ? "[&>*]:!opacity-100 [&>*]:!translate-y-0" : "")
            }
          >
            <h1
              id="hero-ab-heading"
              className="hero-head font-[Georgia,_Iowan_Old_Style,_Times_New_Roman,_serif] text-[clamp(2.1rem,5vw,3.6rem)] font-bold leading-[1.08] tracking-[-0.01em] m-0 mb-[0.45em] text-balance opacity-0 translate-y-[18px] transition-[opacity,transform] duration-[600ms] delay-[80ms]"
            >
              {renderHero.head}
            </h1>
            <p
              className={
                "hero-sub text-[clamp(1.02rem,1.6vw,1.2rem)] leading-[1.6] m-0 mb-[26px] opacity-0 translate-y-[18px] transition-[opacity,transform] duration-[600ms] delay-[160ms] " +
                (isDark ? "text-[#e6ddc9]" : "text-[#4d463b]")
              }
            >
              {renderHero.sub}
            </p>
            <div className="hero-cta flex flex-wrap gap-[14px] m-0 mb-[20px] opacity-0 translate-y-[18px] transition-[opacity,transform] duration-[600ms] delay-[240ms]">
              <Link
                href="https://amzn.eu/d/02nS59t2?utm_source=paulikreisch-de&utm_medium=lp-buch&utm_campaign=hallo-welt&utm_content=hero-ab"
                target="_blank"
                rel="nofollow noopener"
                data-track={`cta-${renderHero.id}-amazon`}
                onClick={() => {
                  try {
                    (window as unknown as { dataLayer?: unknown[] }).dataLayer = (window as unknown as { dataLayer?: unknown[] }).dataLayer || [];
                    ((window as unknown as { dataLayer: unknown[] }).dataLayer as unknown[]).push({ event: "cta_click", hero: renderHero.id });
                  } catch {}
                }}
                className="btn btn-primary btn-lg inline-flex items-center justify-center font-bold text-[1.06rem] px-[26px] py-[16px] rounded-[8px] border-2 border-[#20347d] bg-[#ffe14d] text-[#20347d] no-underline cursor-pointer shadow-[0_3px_0_#20347d] transition-[transform,box-shadow,background] duration-100 hover:bg-[#ffeb7a] hover:-translate-y-[1px] active:translate-y-[1px] active:shadow-[0_1px_0_#20347d]"
              >
                Jetzt bei Amazon kaufen · 10,99&nbsp;€
              </Link>
            </div>
            <p className={"hero-trust flex items-center gap-3 flex-wrap text-[0.92rem] m-0 opacity-0 translate-y-[18px] transition-[opacity,transform] duration-[600ms] delay-[300ms " + (isDark ? "text-[#cfc4ac]" : "text-[#4d463b]")}>
              <span className="stars inline-flex gap-[2px]" role="img" aria-label="5,0 von 5 Sternen">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} className="star w-[17px] h-[17px]" style={{ fill: isDark ? "#d9b45c" : "#b98a2f" }} viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 2.6l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.5l-5.9 3.1 1.2-6.5L2.5 9.5l6.6-.9z" />
                  </svg>
                ))}
              </span>
              <span>
                <strong>5,0 von 5</strong> bei Amazon · 106 Seiten · Taschenbuch, E-Book &amp; Gratis-Hörbuch
              </span>
            </p>
            <p className="hero-deeplink mt-[14px] text-[0.95rem] opacity-0 translate-y-[18px] transition-[opacity,transform] duration-[600ms] delay-[360ms]">
              <Link href="/a" className="textlink font-semibold underline decoration-1 underline-offset-[3px]" style={{ color: isDark ? "#f3e2c8" : "#9c2d22" }}>
                → Satire-Magazin entdecken
              </Link>
              <span className="mx-2 opacity-40">·</span>
              <Link href="/shop" className="textlink font-semibold underline decoration-1 underline-offset-[3px]" style={{ color: isDark ? "#f3e2c8" : "#9c2d22" }}>
                Zum Shop
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Debug: ?hero=3 erzwingt Variante */}
      <span className="sr-only" aria-live="polite">
        {idx !== null ? `Hero ${idx + 1} von 5` : ""}
      </span>
    </section>
  );
}
