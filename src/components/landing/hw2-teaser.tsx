
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { FileWarning, WifiOff, Home, ArrowRight } from 'lucide-react';

const topics = [
    {
        title: "Bürokratie Simulator",
        description: "Füllen Sie den Antrag auf Beantragung eines Antragsformulars aus. Digital, effizient – zum Verzweifeln.",
        link: "/lp-buerokratie-simulator",
        icon: FileWarning,
        cta: "Zum Antrag",
    },
    {
        title: "Internet in Deutschland",
        description: "Erleben Sie die Lichtgeschwindigkeit des Neulands. Eine Ode an das Ladesymbol.",
        link: "/lp-internet-deutschland",
        icon: WifiOff,
        cta: "Verbindung herstellen",
    },
    {
        title: "Der Mietenwahnsinn",
        description: "10 m² für 1.000 €. Konfigurieren Sie Ihr Luxus-WG-Zimmer mit unserem Preisrechner.",
        link: "/lp-mietenwahnsinn",
        icon: Home,
        cta: "Miete berechnen",
    },
]

export function HW2Teaser() {
  return (
    <section id="hw2-teaser" className="w-full py-12 md:py-16 lg:py-20" style={{ backgroundColor: '#14b8a6' }}>
      <div className="container px-4 md:px-6 animate-in fade-in-0 slide-in-from-top-12 duration-1000">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold font-headline tracking-tighter sm:text-5xl text-white">Hallo Welt 2: Wir müssen reden!</h2>
            <p className="max-w-[900px] text-white/90 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed text-balance">
              Die Fortsetzung befasst sich mit den wirklich wichtigen Themen des Lebens – hier ein kleiner Vorgeschmack.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl items-stretch gap-6 py-12 lg:grid-cols-3 lg:gap-8">
            {topics.map(topic => (
                <Card key={topic.link} className="flex flex-col transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
                    <CardHeader className="items-center text-center">
                        <div className="p-4 bg-primary/10 rounded-full mb-4">
                            <topic.icon className="h-8 w-8 text-primary" />
                        </div>
                        <CardTitle className="font-headline">{topic.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center flex-grow">
                        <CardDescription>{topic.description}</CardDescription>
                    </CardContent>
                    <CardFooter className="justify-center">
                         <Link href={topic.link}>
                            <Button>
                                {topic.cta} <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </CardFooter>
                </Card>
            ))}
        </div>
        <div className="mt-8 text-center space-y-8">
            <p className="max-w-2xl mx-auto text-white/90 md:text-lg text-balance">
                Viele dieser gesellschaftlichen Missstände und noch mehr Absurditäten häufen sich im neuen Buch.
            </p>
            <Link href="/lp2">
                <Button size="lg" variant="secondary" className="bg-white text-[#14b8a6] hover:bg-gray-100 h-12 text-lg animate-sway mt-3">
                    Mehr erfahren <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
            </Link>
        </div>
      </div>
    </section>
  );
}
