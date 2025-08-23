import { BookHeart, Bomb, BrainCircuit } from "lucide-react";

export function FeaturesLP2() {
  return (
    <section id="features-lp2" className="w-full py-12 md:py-24 lg:py-32" style={{backgroundColor: 'hsl(var(--color-bg-tan))'}}>
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold font-headline tracking-tighter sm:text-5xl">Was Sie in "Hallo Welt 2" erwartet</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed text-balance">
              Noch mehr von dem, was Sie am ersten Buch gehasst oder geliebt haben. Nur intensiver.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
          <div className="grid gap-1 text-center p-4 rounded-lg transition-all hover:bg-background/50 hover:scale-105 transform -rotate-1">
            <Bomb className="h-10 w-10 mx-auto text-primary" />
            <h3 className="text-xl font-bold font-headline">Explosiveres Chaos</h3>
            <p className="text-sm text-muted-foreground text-balance">
              Wir haben die Logik über Bord geworfen. Diesmal gibt es keine Sicherheitsnetze.
            </p>
          </div>
          <div className="grid gap-1 text-center p-4 rounded-lg transition-all hover:bg-background/50 hover:scale-105 transform rotate-2">
            <BrainCircuit className="h-10 w-10 mx-auto text-primary" />
            <h3 className="text-xl font-bold font-headline">Tiefere Verwirrung</h3>
            <p className="text-sm text-muted-foreground text-balance">
              Neue philosophische Fragen, auf die niemand eine Antwort hat. Perfekt für schlaflose Nächte.
            </p>
          </div>
          <div className="grid gap-1 text-center p-4 rounded-lg transition-all hover:bg-background/50 hover:scale-105 transform -rotate-1">
            <BookHeart className="h-10 w-10 mx-auto text-primary" />
            <h3 className="text-xl font-bold font-headline">Mehr Herz*</h3>
            <p className="text-sm text-muted-foreground text-balance">
              *Herz im Sinne von Sodbrennen. Die Charaktere durchleben noch absurdere emotionale Achterbahnfahrten.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
