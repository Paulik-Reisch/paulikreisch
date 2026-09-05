"use client";

import { useEffect, useState, useCallback } from "react";
import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

const reviews = [
  { stars: 5, text: "»Ich habe gelacht, geweint, und meine Lebensentscheidungen in Frage gestellt. Meistens letzteres.«", author: "Literaturkritiker" },
  { stars: 4, text: "»Dieses Buch hat mir gezeigt, dass mein Leben gar nicht so chaotisch ist.«", author: "dankbare Leserin" },
  { stars: 5, text: "»Habe beim Lesen so laut gelacht, dass meine Nachbarn die Polizei gerufen haben. 10/10, würde wieder eine Anzeige riskieren.«", author: "Lärmbelästiger" },
  { stars: 3, text: "»Ich bin mir nicht sicher, was ich da gelesen habe, aber ich konnte nicht aufhören.«", author: "verwirrt, aber fasziniert" },
  { stars: 5, text: "»Endlich ein Buch, das so denkt wie ich! Jetzt fühle ich mich weniger allein mit meinen seltsamen Gedanken.«", author: "Seelenverwandter" },
  { stars: 4, text: "»Besser als jede Tasse Kaffee, um morgens wach zu werden. Ein Adrenalinschub in Prosaform.«", author: "Koffein-Junkie" },
  { stars: 5, text: "»Pflichtlektüre für jeden, der jemals eine Schule von innen gesehen hat. Es ist, als hätten die Autoren meine Gedanken gestohlen.«", author: "ehemaliger Insasse" },
  { stars: 5, text: "»Ich habe es meinem Lehrer geschenkt. Er hat nicht mehr mit mir gesprochen. Beste Investition meines Lebens.«", author: "Rebell" },
  { stars: 4, text: "»Einige Passagen sind so absurd, dass sie wahr sein müssen. Ein schmerzhaftes Vergnügen.«", author: "realistischer Zyniker" },
  { stars: 5, text: "»Dieses Buch ist der Grund, warum ich jetzt Therapeut bin. Und auch der Grund, warum ich einen brauche.«", author: "Betroffener" },
  { stars: 2, text: "»Ich verstehe den Hype nicht. Das ist doch alles völlig normaler Schulalltag.«", author: "Lehrer (vermutlich)" },
  { stars: 5, text: "»Ich habe versucht, das Buch als Entschuldigung für meinen Sohn zu verwenden. Hat nicht geklappt, aber der Richter hat gelacht.«", author: "engagierter Vater" },
];

export function Testimonials() {
  const [api, setApi] = useState<CarouselApi>();
  const [selected, setSelected] = useState(0);
  const [paused, setPaused] = useState(false);

  const onSelect = useCallback((a: CarouselApi) => {
    if (!a) return;
    setSelected(a.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!api) return;
    onSelect(api);
    api.on("select", onSelect);
    api.on("reInit", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api, onSelect]);

  // Auto-rotate alle 3s um 3 Cards (mobile 1)
  useEffect(() => {
    if (!api || paused) return;
    const mql = window.matchMedia("(max-width: 768px)");
    const tick = () => {
      const step = mql.matches ? 1 : 3;
      const next = api.selectedScrollSnap() + step;
      // embla loop: wrap via scrollTo with modulo
      const count = api.scrollSnapList().length;
      api.scrollTo(next % count);
    };
    const id = window.setInterval(tick, 5000);
    return () => window.clearInterval(id);
  }, [api, paused]);

  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-heading"
      className="w-full py-16 md:py-20 lg:py-24 bg-[#f7f2e7] text-[#1d1a15] border-t border-[#e8ddd0]/60"
    >
      <div className="container px-4 md:px-6">
        {/* Header — Hero-Aesthetic */}
        <div className="mx-auto max-w-[720px] text-center">
          <p className="text-[0.78rem] font-bold tracking-[0.14em] uppercase text-[#9c2d22] mb-3">
            Was Leser sagen
          </p>
          <h2
            id="testimonials-heading"
            className="font-[Georgia,_Iowan_Old_Style,_Times_New_Roman,_serif] text-[clamp(1.9rem,4vw,2.7rem)] font-bold leading-[1.08] tracking-[-0.015em] text-balance"
          >
            Begeisterte Kritik von unseren Fans
          </h2>
          <p className="mx-auto mt-3 max-w-[560px] text-[clamp(1rem,1.6vw,1.15rem)] leading-relaxed text-[#4d463b] text-balance">
            Verlassen Sie sich nicht nur auf unser Wort.
          </p>
        </div>

        {/* Carousel — 3 Cards per view, auto 3s */}
        <div
          className="relative mt-10 md:mt-12 max-w-[1180px] mx-auto"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
        >
          <Carousel
            opts={{ loop: true, align: "start" }}
            setApi={setApi}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {reviews.map((review, i) => (
                <CarouselItem key={i} className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                  <Card
                    as="figure"
                    className="h-full flex flex-col bg-white border border-[#e8ddd0] shadow-[0_2px_16px_rgba(0,0,0,0.06)] rounded-[14px] hover:shadow-[0_6px_24px_rgba(0,0,0,0.10)] transition-[transform,box-shadow] duration-200 hover:-translate-y-[1px]"
                  >
                    <CardContent className="p-6 flex flex-col justify-between h-full gap-4">
                      <div>
                        <div
                          role="img"
                          aria-label={`Bewertung: ${review.stars} von 5 Sternen`}
                          className="flex gap-[3px] mb-3"
                        >
                          {Array.from({ length: 5 }).map((_, j) => (
                            <Star
                              key={j}
                              className={`w-[16px] h-[16px] ${j < review.stars ? "fill-[#b98a2f] stroke-[#b98a2f] text-[#b98a2f]" : "fill-transparent stroke-[#d9c7a8] text-[#d9c7a8]"}`}
                            />
                          ))}
                        </div>
                        <blockquote className="text-[0.98rem] leading-[1.55] text-[#1d1a15] text-left">
                          {review.text}
                        </blockquote>
                      </div>
                      <figcaption className="text-right text-[0.88rem] font-semibold text-[#6b6256]">
                        — {review.author}
                      </figcaption>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          {/* Dots — Hero-Palette */}
          <div className="mt-6 flex items-center justify-center gap-2" aria-hidden="true">
            {api &&
              api.scrollSnapList().map((_, i) => (
                <button
                  key={i}
                  aria-label={`Gehe zu Slide ${i + 1}`}
                  onClick={() => api.scrollTo(i)}
                  className={`h-2 rounded-full transition-all duration-200 ${selected === i ? "w-7 bg-[#1d1a15]" : "w-2 bg-[#1d1a15]/20 hover:bg-[#1d1a15]/30"}`}
                />
              ))}
          </div>
          <p className="sr-only" aria-live="polite">
            Slide {selected + 1} von {api?.scrollSnapList().length ?? reviews.length}
          </p>
        </div>
      </div>
    </section>
  );
}
