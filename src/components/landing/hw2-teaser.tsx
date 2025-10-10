
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { FileWarning, WifiOff, Home, ArrowRight, BookOpen } from 'lucide-react';

const topics = [
    {
        title: "Bürokratie-Simulator",
        description: "Füllen Sie den Antrag auf Beantragung eines Antragsformulars aus. Digital, effizient – zum Verzweifeln.",
        link: "/lp-buerokratie-simulator",
        icon: FileWarning,
    },
    {
        title: "Internet in Deutschland",
        description: "Erleben Sie die Lichtgeschwindigkeit des Neulands. Eine Ode an das Ladesymbol.",
        link: "/lp-internet-deutschland",
        icon: WifiOff,
    },
    {
        title: "Mietenwahnsinn",
        description: "10 m² ab 1.000,- €. Konfigurieren Sie Ihr Luxus-WG-Zimmer mit unserem Preisrechner.",
        link: "/lp-mietenwahnsinn",
        icon: Home,
    },
]

export function HW2Teaser() {
  return (
    <section id="hw2-teaser" className="w-full py-12 md:py-16 lg:py-20 bg-background">
      <div className="container px-4 md:px-6 animate-in fade-in-0 slide-in-from-top-12 duration-1000">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold font-headline tracking-tighter sm:text-5xl">Worauf warten Sie noch?</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed text-balance">
              Werden Sie Teil der Rebellion gegen den alltäglichen Irrsinn. Die vollständige Akte wartet auf Sie.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl items-stretch gap-6 py-12 lg:grid-cols-2">
           <div className="flex flex-col justify-center text-center p-8 border rounded-lg bg-muted/40">
                <BookOpen className="h-12 w-12 mx-auto text-primary mb-4" />
                <h3 className="font-headline text-2xl font-bold">Werden Sie zum Mitwisser</h3>
                <p className="text-muted-foreground mt-2 mb-6">
                    Sichern Sie sich Ihr Exemplar und erhalten Sie die volle Dosis unzensierter Wahrheit.
                </p>
                 <Link href="/buchhandlung-paulik-reisch">
                    <Button size="lg">Die Akte anfordern (Jetzt kaufen)</Button>
                </Link>
           </div>
           <div className="flex flex-col justify-center text-center p-8 border rounded-lg bg-muted/40">
                <FileWarning className="h-12 w-12 mx-auto text-primary mb-4" />
                <h3 className="font-headline text-2xl font-bold">Lesen Sie die Beweise</h3>
                <p className="text-muted-foreground mt-2 mb-6">
                    Lesen Sie den exklusiven Auszug aus Kapitel 6 und überzeugen Sie sich selbst.
                </p>
                 <Link href="/excerpt-hw-2-static-c7">
                    <Button size="lg" variant="outline">Zur Leseprobe</Button>
                </Link>
           </div>
        </div>
      </div>
    </section>
  );
}
