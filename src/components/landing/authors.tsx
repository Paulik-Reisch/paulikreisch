"use client";

import { ImageWithLoader as Image } from "@/components/ui/image-with-loader";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import styles from "./authors.module.css";

type Author = {
  name: string;
  claim: string;
  bio: string;
  href: string;
  src: string;
};

const AUTHORS: Author[] = [
  {
    name: "Philipp Paulik",
    claim: "Der mit dem fragwürdigen Haarschnitt.",
    bio: "Sorgt für das Chaos. Angetrieben von Kaffee und existenzieller Angst stellt er sicher, dass keine Handlung zu viel Sinn ergibt.",
    href: "/ueber/philipp-paulik",
    src: "https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/ersteller%2Fphilipp-paulik.png?alt=media&token=7e48b706-80fa-45cc-ae51-b6444bd7ccb3",
  },
  {
    name: "Maximilian Reisch",
    claim: "Der mit der Brille.",
    bio: "Meister der Syntax und Satire. Sein Lebensziel: einen so verwirrenden Satz zu schreiben, dass er einen Nobelpreis gewinnt.",
    href: "/ueber/max-reisch",
    src: "/max-reisch.png",
  },
  {
    name: "Luin Schiffbauer",
    claim: "Der Künstler hinter dem Chaos.",
    bio: "Mit seinem einzigartigen Stil fängt er die Essenz der Satire ein und verleiht dem Wahnsinn ein unvergessliches Gesicht.",
    href: "/ueber/luin-schiffbauer",
    src: "https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/luin-schiffbauer.png?alt=media&token=61abe644-7d94-4bfc-8164-37447ac9279b",
  },
];

export function Authors({ variant = "classic" }: { variant?: "classic" | "editorial" }) {
  const isEditorial = variant === "editorial";

  return (
    <section
      id="authors"
      aria-labelledby="authors-heading"
      className={isEditorial
        ? `${styles.editorial} w-full`
        : "w-full py-16 md:py-20 lg:py-24 bg-[#20347d] text-[#f7f2e7] border-t border-white/10 overflow-hidden relative"}
    >
      {/* subtle texture like other sections */}
      {!isEditorial && (
        <>
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(#f7f2e7 1.1px, transparent 1.1px)", backgroundSize: "22px 22px" }} />
          <div aria-hidden="true" className="pointer-events-none absolute -top-28 -right-24 h-[520px] w-[520px] rounded-full bg-white/[0.06] blur-[0.5px]" />
        </>
      )}
      <div className={isEditorial ? styles.editorialContainer : "relative container px-4 md:px-6"}>
        {/* Header — Hero/Features harmonisch */}
        <div className={isEditorial ? styles.editorialHeading : "mx-auto max-w-[720px] text-center"}>
          <p className={isEditorial ? styles.editorialEyebrow : "text-[0.78rem] font-bold tracking-[0.14em] uppercase text-[#f3d9a8] mb-3"}>
            Die Köpfe dahinter
          </p>
          <h2
            id="authors-heading"
            className={isEditorial ? styles.editorialTitle : "font-[Georgia,_Iowan_Old_Style,_Times_New_Roman,_serif] text-[clamp(1.9rem,4vw,2.7rem)] font-bold leading-[1.08] tracking-[-0.015em] text-balance text-white"}
          >
            {isEditorial ? "Die Menschen hinter dem Wahnsinn." : "Treffen Sie die verdrehten Köpfe"}
          </h2>
          <p className={isEditorial ? styles.editorialIntro : "mx-auto mt-3 max-w-[600px] text-[clamp(1rem,1.6vw,1.12rem)] leading-relaxed text-[#dbe7ff]/85 text-balance"}>
            Drei Individuen, eine Mission: den alltäglichen Wahnsinn dokumentieren.
          </p>
        </div>

        {/* Cards — 3 nebeneinander, Paper + Plus-Hauch wie Features */}
        <div className={isEditorial ? styles.editorialGrid : "mx-auto mt-10 md:mt-12 max-w-[1180px] grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6"}>
          {AUTHORS.map((a) => (
            <article
              key={a.name}
              className={isEditorial
                ? styles.editorialCard
                : "group relative flex flex-col bg-white border border-[#e8ddd0] rounded-[18px] shadow-[0_2px_16px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_28px_rgba(0,0,0,0.10)] hover:-translate-y-[1px] transition-[box-shadow,transform] duration-200 overflow-hidden"}
            >
              {!isEditorial && <div className="h-[3px] w-full bg-gradient-to-r from-[#ffe14d] via-[#ffcf4d] to-[#e8ddd0] opacity-90" aria-hidden="true" />}
              <div className={isEditorial ? styles.editorialContent : "flex flex-1 flex-col p-7 text-center"}>
                <div className={isEditorial ? styles.editorialPortrait : "mx-auto relative"}>
                  {!isEditorial && <div className="absolute -inset-1 rounded-full bg-[#ffe14d]/30 blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />}
                  <Image
                    alt={`Porträt von ${a.name}`}
                    className={isEditorial
                      ? styles.editorialImageContainer
                      : "relative mx-auto rounded-full border-[3px] border-white shadow-[0_2px_12px_rgba(0,0,0,0.12)]"}
                    height={isEditorial ? 480 : 112}
                    src={a.src}
                    sizes={isEditorial ? "(max-width: 767px) 40vw, 30vw" : "112px"}
                    style={isEditorial
                      ? { aspectRatio: "4/4.4", objectFit: "cover" }
                      : { aspectRatio: "1/1", objectFit: "cover" }}
                    width={isEditorial ? 440 : 112}
                  />
                </div>

                <h3 className={isEditorial
                  ? styles.editorialName
                  : "mt-4 font-[Georgia,_Iowan_Old_Style,_Times_New_Roman,_serif] text-[1.28rem] font-bold leading-tight tracking-[-0.015em] text-[#1d1a15]"}>
                  {a.name}
                </h3>
                <p className={isEditorial ? styles.editorialClaim : "mt-1 text-[0.88rem] font-semibold tracking-wide text-[#9c2d22]"}>{a.claim}</p>

                <p className={isEditorial ? styles.editorialBio : "mt-3 flex-1 text-[0.94rem] leading-[1.6] text-[#4d463b] text-balance"}>{a.bio}</p>

                <Link
                  href={a.href}
                  aria-label={`Mehr über ${a.name}`}
                  className={isEditorial
                    ? styles.editorialLink
                    : "mt-6 inline-flex items-center justify-center rounded-full border-2 border-[#1d1a15] bg-white px-5 py-2 text-[0.9rem] font-bold text-[#1d1a15] shadow-[0_2px_0_#1d1a15] transition-[transform,box-shadow,background] hover:bg-[#1d1a15] hover:text-white hover:-translate-y-[1px] active:translate-y-[1px] active:shadow-[0_1px_0_#1d1a15] dark:border-[#6b6353] dark:bg-[#2a251e] dark:text-[#f2ede3] dark:hover:bg-[#332d24] dark:hover:text-white dark:shadow-[0_2px_0_#000000] dark:active:shadow-[0_1px_0_#000000]"}
                >
                  Mehr erfahren {isEditorial && <ArrowUpRight size={16} aria-hidden="true" />}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
