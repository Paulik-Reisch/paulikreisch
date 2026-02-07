"use client";

import { ImageWithLoader as Image } from "@/components/ui/image-with-loader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";

export function Authors() {
  return (
    <section id="authors" aria-labelledby="authors-heading" className="w-full py-12 md:py-16 bg-subtle-yellow">
      <div className="container px-4 md:px-6 animate-in fade-in-0 slide-in-from-top-12 duration-1000">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 id="authors-heading" className="text-3xl font-bold font-headline tracking-tighter sm:text-5xl">Treffen Sie die verdrehten Köpfe</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed text-balance">
              Drei Individuen, eine Mission: den alltäglichen Wahnsinn dokumentieren.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:gap-12 mt-12">
          
          <article className="transform transition-transform duration-500 hover:scale-105 hover:-rotate-1 -rotate-2 h-full">
            <Link href="/ueber/philipp-paulik" className="block h-full">
              <Card className="h-full">
                  <CardHeader className="text-center">
                  <Image
                      alt="Porträtfoto von Autor Philipp Paulik"
                      className="mx-auto mb-4 rounded-full"
                      data-ai-hint="funny portrait"
                      height="120"
                      src="https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/paulik.png?alt=media&token=7d4dfeb1-5f87-4426-9890-868ed2a089bf"
                      style={{
                      aspectRatio: "120/120",
                      objectFit: "cover",
                      }}
                      width="120"
                  />
                  <CardTitle className="font-headline text-primary hover:underline">
                      Philipp Paulik
                  </CardTitle>
                  <CardDescription>Der mit dem fragwürdigen Haarschnitt.</CardDescription>
                  </CardHeader>
                  <CardContent>
                  <p className="text-sm text-muted-foreground">
                      Paulik sorgt für das Chaos. Angetrieben von Kaffee und existenzieller Angst stellt er sicher, dass keine Handlung zu viel Sinn ergibt.
                  </p>
                  </CardContent>
              </Card>
            </Link>
          </article>

          <article className="transform transition-transform duration-500 hover:scale-105 hover:rotate-1 rotate-2 h-full">
             <Link href="/ueber/max-reisch" className="block h-full">
              <Card className="h-full">
                  <CardHeader className="text-center">
                  <Image
                      alt="Porträtfoto von Autor Maximilian Reisch"
                      className="mx-auto mb-4 rounded-full"
                      data-ai-hint="weird portrait"
                      height="120"
                      src="https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/reisch.png?alt=media&token=5aa20eee-967e-4912-9bfe-3f0b6861a316"
                      style={{
                      aspectRatio: "120/120",
                      objectFit: "cover",
                      }}
                      width="120"
                  />
                  <CardTitle className="font-headline text-primary hover:underline">Maximilian Reisch</CardTitle>
                  <CardDescription>Der mit der Brille.</CardDescription>
                  </CardHeader>
                  <CardContent>
                  <p className="text-sm text-muted-foreground">
                      Reisch ist ein Meister der Syntax und Satire. Sein Lebensziel ist es, einen so verwirrenden Satz zu schreiben, dass er einen Nobelpreis gewinnt.
                  </p>
                  </CardContent>
              </Card>
            </Link>
          </article>

          <article className="transform transition-transform duration-500 hover:scale-105 hover:-rotate-1 -rotate-2 h-full md:col-span-2 lg:col-span-1">
            <Link href="/ueber/luin-schiffbauer" className="block h-full">
              <Card className="h-full">
                  <CardHeader className="text-center">
                  <Image
                      alt="Porträtfoto von Illustrator Luin Schiffbauer"
                      className="mx-auto mb-4 rounded-full"
                      data-ai-hint="artist portrait"
                      height="120"
                      src="https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/luin-schiffbauer.png?alt=media&token=61abe644-7d94-4bfc-8164-37447ac9279b"
                      style={{
                      aspectRatio: "120/120",
                      objectFit: "cover",
                      }}
                      width="120"
                  />
                  <CardTitle className="font-headline text-primary hover:underline">
                      Luin Schiffbauer
                  </CardTitle>
                  <CardDescription>Der Künstler hinter dem Chaos.</CardDescription>
                  </CardHeader>
                  <CardContent>
                  <p className="text-sm text-muted-foreground">
                      Mit seinem einzigartigen Stil fängt er die Essenz der Satire ein und verleiht dem Wahnsinn ein unvergessliches Gesicht.
                  </p>
                  </CardContent>
              </Card>
            </Link>
          </article>

        </div>
      </div>
    </section>
  );
}
