

import { BookOpen, BrainCircuit, Feather } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function Features() {
  return (
    <section id="features" aria-labelledby="features-heading" className="w-full py-12 md:py-16 lg:py-20 bg-primary text-primary-foreground">
      <div className="container px-4 md:px-6 animate-in fade-in-0 slide-in-from-top-12 duration-1000">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 id="features-heading" className="text-3xl font-bold font-headline tracking-tighter sm:text-5xl">Warum dieses Buch Ihr Leben verändern wird</h2>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
          <Card className="bg-white/10 border-0 text-primary-foreground transform transition-transform hover:scale-105 -rotate-1">
            <CardContent className="p-6 text-center grid gap-1">
              <Feather className="h-10 w-10 mx-auto" />
              <h3 className="text-xl font-bold font-headline">Satirisches Genie</h3>
              <p className="text-sm text-primary-foreground/80 text-balance">
                Witzige Kommentare zum modernen Leben, die so scharf sind, dass jede Chili Schote vor Neid erblassen würde.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-0 text-primary-foreground transform transition-transform hover:scale-105 rotate-2">
            <CardContent className="p-6 text-center grid gap-1">
              <BookOpen className="h-10 w-10 mx-auto" />
              <h3 className="text-xl font-bold font-headline">Fesselnde Handlung</h3>
              <p className="text-sm text-primary-foreground/80 text-balance">
                Eine Handlung mit mehr Drehungen und Wendungen als eine Brezelfabrik.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-0 text-primary-foreground transform transition-transform hover:scale-105 -rotate-1">
            <CardContent className="p-6 text-center grid gap-1">
              <BrainCircuit className="h-10 w-10 mx-auto" />
              <h3 className="text-xl font-bold font-headline">Taktische Geniestreiche</h3>
              <p className="text-sm text-primary-foreground/80 text-balance">
                Lernen Sie, wie man mit Problemen der Schulzeit umgeht – von der Umgehung des Sportunterrichts bis zur Manipulation der Noten.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

