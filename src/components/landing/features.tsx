import { BookOpen, Drama, Feather } from "lucide-react";

export function Features() {
  return (
    <section id="features" className="w-full py-12 md:py-24 lg:py-32" style={{backgroundColor: 'hsl(var(--color-bg-tan))'}}>
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold font-headline tracking-tighter sm:text-5xl">Warum dieses Buch Ihr Leben verändern wird*</h2>
            <p className="max-w-[900px] text-accent-foreground/80 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed text-balance">
              (*Im Guten wie im Schlechten. Keine Rückerstattung.)
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
          <div className="grid gap-1 text-center p-4 rounded-lg transition-all hover:bg-background/50 hover:scale-105 transform -rotate-1">
            <Drama className="h-10 w-10 mx-auto text-primary" />
            <h3 className="text-xl font-bold font-headline">Unvergessliche Charaktere</h3>
            <p className="text-sm text-accent-foreground/80 text-balance">
              Treffen Sie eine Besetzung von Charakteren, die so bizarr sind, dass sie für immer mietfrei in Ihrem Kopf leben werden.
            </p>
          </div>
          <div className="grid gap-1 text-center p-4 rounded-lg transition-all hover:bg-background/50 hover:scale-105 transform rotate-2">
            <BookOpen className="h-10 w-10 mx-auto text-primary" />
            <h3 className="text-xl font-bold font-headline">Fesselnde Handlung</h3>
            <p className="text-sm text-accent-foreground/80 text-balance">
              Eine Handlung mit mehr Drehungen und Wendungen als eine Brezelfabrik. Sie werden das Ende nicht kommen sehen.
            </p>
          </div>
          <div className="grid gap-1 text-center p-4 rounded-lg transition-all hover:bg-background/50 hover:scale-105 transform -rotate-1">
            <Feather className="h-10 w-10 mx-auto text-primary" />
            <h3 className="text-xl font-bold font-headline">Satirisches Genie</h3>
            <p className="text-sm text-accent-foreground/80 text-balance">
              Witzige Kommentare zum modernen Leben, die so scharf sind, dass Sie sich einen Papierschnitt holen könnten.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
