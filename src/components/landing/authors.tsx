
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export function Authors() {
  return (
    <section id="authors" className="w-full py-12 md:py-16 lg:py-20 bg-background">
      <div className="container px-4 md:px-6 animate-in fade-in-0 slide-in-from-top-12 duration-1000">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold font-headline tracking-tighter sm:text-5xl">Treffen Sie die verdrehten Köpfe</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed text-balance">
              Die beiden Autoren:
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:max-w-none lg:grid-cols-2 mt-12">
          <Card className="transform transition-transform duration-500 hover:scale-105 hover:-rotate-1 -rotate-2">
            <CardHeader className="text-center">
              <Image
                alt="Autor Paulik"
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
              <CardTitle className="font-headline">Paulik</CardTitle>
              <CardDescription>Der mit dem fragwürdigen Haarschnitt.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Paulik sorgt für das Chaos. Angetrieben von Kaffee und existenzieller Angst stellt er sicher, dass keine Handlung zu viel Sinn ergibt. Er betrachtet es als öffentlichen Dienst.
              </p>
            </CardContent>
          </Card>
          <Card className="transform transition-transform duration-500 hover:scale-105 hover:rotate-1 rotate-2">
            <CardHeader className="text-center">
              <Image
                alt="Autor Reisch"
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
              <CardTitle className="font-headline">Reisch</CardTitle>
              <CardDescription>Der mit der Brille.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Reisch ist ein Meister der Syntax und Satire. Sein Lebensziel ist es, einen so verwirrenden Satz zu schreiben, dass er einen Nobelpreis gewinnt. Er versucht es immer noch.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
