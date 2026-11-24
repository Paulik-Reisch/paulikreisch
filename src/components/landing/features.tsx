"use client";

import { useState } from "react";
import { Eye, Sparkles, Gift, Plus, X } from "lucide-react";

type Feature = {
  icon: React.ReactNode;
  title: string;
  short: string;
  more: string;
};

const FEATURES: Feature[] = [
  {
    icon: <Eye className="h-6 w-6" />,
    title: "Endlich die Wahrheit",
    short: "Was im Lehrerzimmer wirklich passiert — ohne Filter, mit Herz und herrlich böse.",
    more: "13 Jahre Feldforschung: Vertretungspläne um 6:45, Sitzordnungen als Gesellschaftsexperiment, Zeugniskonferenzen als Satire-Wettbewerb. Wer Schule überlebt hat, erkennt hier jeden Satz wieder — und lacht dort, wo es früher weh tat.",
  },
  {
    icon: <Sparkles className="h-6 w-6" />,
    title: "Lachen statt Leiden",
    short: "106 Seiten Ventil gegen Klausuren, Bürokratie und den täglichen Wahnsinn.",
    more: "Nebenwirkung: lautes Lachen im Zug, Kichern im Lehrerzimmer, das gute Gefühl, nicht allein zu sein. Eine Leserin verpasste ihalt und lief 30 Kilometer zurück — „Es hat sich gelohnt\", sagt sie. Therapie in Taschenbuch.",
  },
  {
    icon: <Gift className="h-6 w-6" />,
    title: "Schenken, das sitzt",
    short: "Das Geschenk, das Lehrkräfte wirklich feiern — und alle, die es mit Schule hatten.",
    more: "5,0★ bei Amazon · 106 Seiten · Taschenbuch, E-Book & Gratis-Hörbuch. Sofort lieferbar für Abschied, Abitur, Referendariat oder einfach: „Danke für alles — auch für die 6 in Mathe.\"",
  },
];

export function Features() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section
      id="features"
      aria-labelledby="features-heading"
      className="w-full py-16 md:py-20 lg:py-24 bg-[#f7f2e7] text-[#1d1a15] border-t border-[#e8ddd0]/60"
    >
      <div className="container px-4 md:px-6">
        {/* Header — Hero-Aesthetic */}
        <div className="mx-auto max-w-[720px] text-center">
          <p className="text-[0.78rem] font-bold tracking-[0.14em] uppercase text-[#9c2d22] mb-3">
            Warum Du es lieben wirst
          </p>
          <h2
            id="features-heading"
            className="font-[Georgia,_Iowan_Old_Style,_Times_New_Roman,_serif] text-[clamp(1.9rem,4vw,2.7rem)] font-bold leading-[1.08] tracking-[-0.015em] text-balance"
          >
            Warum Sie unsere Satire lieben werden
          </h2>
          <p className="mx-auto mt-3 max-w-[560px] text-[clamp(1rem,1.6vw,1.15rem)] leading-relaxed text-[#4d463b] text-balance">
            Keine Floskeln. Drei Gründe, warum 106 Seiten reichen, um den Schulwahnsinn zu überleben — und zu lieben.
          </p>
        </div>

        {/* Cards — Desktop 3 nebeneinander, Mobile verzaubert */}
        <div className="mx-auto mt-10 md:mt-12 max-w-[1180px] grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {FEATURES.map((f, i) => {
            const isOpen = open === i;
            return (
              <div
                key={f.title}
                className="group relative flex flex-col bg-white border border-[#e8ddd0] rounded-[18px] shadow-[0_2px_16px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_28px_rgba(0,0,0,0.10)] transition-[box-shadow,transform] duration-200 hover:-translate-y-[1px] overflow-hidden"
              >
                {/* top accent — Paper like hero scrim */}
                <div className="h-[3px] w-full bg-gradient-to-r from-[#ffe14d] via-[#ffcf4d] to-[#e8ddd0] opacity-90" aria-hidden="true" />

                <div className="flex-1 p-6 md:p-7 pb-16">
                  {/* Icon */}
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-[12px] bg-[#fdf8ee] border border-[#e8ddd0] text-[#1d1a15] shadow-sm mb-4">
                    {f.icon}
                  </div>

                  <h3 className="font-[Georgia,_Iowan_Old_Style,_Times_New_Roman,_serif] text-[1.32rem] font-bold leading-tight tracking-[-0.015em] text-[#1d1a15]">
                    {f.title}
                  </h3>

                  <p className="mt-2 text-[0.98rem] leading-[1.55] text-[#4d463b]">{f.short}</p>

                  {/* Expandable — grid trick für smooth height, auch mobile butterweich */}
                  <div
                    id={`feature-more-${i}`}
                    className={`grid transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${isOpen ? "grid-rows-[1fr] opacity-100 mt-3" : "grid-rows-[0fr] opacity-0"}`}
                  >
                    <div className="overflow-hidden">
                      <p className="text-[0.96rem] leading-[1.6] text-[#1d1a15]/85 border-t border-[#e8ddd0]/70 pt-3">
                        {f.more}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Plus / X unten rechts */}
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`feature-more-${i}`}
                  aria-label={isOpen ? `${f.title} zuklappen` : `${f.title} mehr erfahren`}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className={`absolute bottom-4 right-4 inline-flex h-10 w-10 md:h-10 md:w-10 items-center justify-center rounded-full border-2 shadow-sm transition-[transform,background,border-color] duration-200 hover:scale-[1.06] active:scale-[0.98] max-md:h-12 max-md:w-12 ${
                    isOpen
                      ? "bg-[#1d1a15] border-[#1d1a15] text-white rotate-0"
                      : "bg-white border-[#1d1a15] text-[#1d1a15] hover:bg-[#1d1a15] hover:text-white"
                  }`}
                >
                  <span className={`transition-transform duration-200 ${isOpen ? "rotate-90" : "rotate-0"}`}>
                    {isOpen ? <X className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                  </span>
                </button>

                {/* Mobile: Tipp-Hint wenn geschlossen */}
                <span
                  aria-hidden="true"
                  className={`pointer-events-none absolute bottom-5 right-14 text-[0.82rem] font-semibold tracking-wide text-[#9a9184] transition-opacity duration-200 md:hidden ${isOpen ? "opacity-0" : "opacity-100"}`}
                >
                  Mehr
                </span>
              </div>
            );
          })}
        </div>

        <p className="sr-only" aria-live="polite">
          {open !== null ? `${FEATURES[open].title} geöffnet` : "Alle Details zugeklappt"}
        </p>
      </div>
    </section>
  );
}
