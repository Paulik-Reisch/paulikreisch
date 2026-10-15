import Link from "next/link";
import { CountdownBanner } from "./countdown-banner";

export function CtaBanner() {
  return (
    <section
      id="cta-banner"
      aria-labelledby="cta-heading"
      className="relative w-full py-16 md:py-20 lg:py-24 bg-[#ffe14d] text-[#1d1a15] overflow-hidden border-y-2 border-[#1d1a15]"
    >
      {/* subtle paper dots like hero */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: "radial-gradient(#1d1a15 1.2px, transparent 1.2px)",
          backgroundSize: "22px 22px",
        }}
      />
      {/* soft blob */}
      <div aria-hidden="true" className="pointer-events-none absolute -top-24 -right-24 h-[380px] w-[380px] rounded-full bg-white/40 blur-[1px]" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 -left-24 h-[420px] w-[420px] rounded-full bg-white/30 blur-[1px]" />

      <div className="relative container px-4 md:px-6">
        <div className="mx-auto max-w-[860px] flex flex-col items-center text-center gap-6">
          <CountdownBanner />

          <div className="space-y-3">
            <h2
              id="cta-heading"
              className="font-[Georgia,_Iowan_Old_Style,_Times_New_Roman,_serif] text-[clamp(1.9rem,4vw,2.8rem)] font-bold leading-[1.05] tracking-[-0.015em] text-balance"
            >
              Verpasse den Rabatt nicht
            </h2>
            <p className="text-[0.98rem] md:text-[1.02rem] leading-relaxed text-[#1d1a15]/75">
              Aktion bis Monatsende — danach wieder <span className="font-semibold">20,99&nbsp;€</span>
            </p>
          </div>

          {/* Price */}
          <div className="flex items-baseline justify-center gap-3 flex-wrap">
            <span className="text-[1.45rem] md:text-[1.7rem] font-semibold text-[#1d1a15]/45 line-through decoration-2">20,99&nbsp;€</span>
            <span className="font-[Georgia,_Iowan_Old_Style,_Times_New_Roman,_serif] text-[2.6rem] md:text-[3.1rem] font-black tracking-[-0.02em] leading-none text-[#1d1a15]">
              10,99&nbsp;€
            </span>
            <span className="ml-1 inline-flex items-center rounded-full bg-[#1d1a15] px-3 py-1 text-[0.72rem] font-black tracking-[0.08em] uppercase text-white">
              –48&nbsp;%
            </span>
          </div>

          <Link
            href="/shop"
            className="inline-flex items-center justify-center rounded-[12px] bg-[#1d1a15] px-8 py-4 text-[1.05rem] font-bold text-white shadow-[0_4px_0_rgba(0,0,0,0.22)] transition-[transform,box-shadow,background] hover:bg-black hover:-translate-y-[1px] active:translate-y-[1px] active:shadow-[0_1px_0_rgba(0,0,0,0.22)]"
          >
            Ja, ich will den Rabatt!
          </Link>
          <p className="text-[0.84rem] leading-snug text-[#1d1a15]/60">
            Sicher bei Amazon · 5,0★ · 106 Seiten · Taschenbuch, E-Book &amp; Gratis-Hörbuch
          </p>
        </div>
      </div>
    </section>
  );
}
