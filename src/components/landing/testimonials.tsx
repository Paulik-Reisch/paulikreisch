
import { Star, PawPrint } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const reviews = [
    {
        stars: 5,
        text: "»Ich habe gelacht, geweint, und meine Lebensentscheidungen in Frage gestellt. Meistens letzteres.«",
        author: "Ein Literaturkritiker",
    },
    {
        stars: 4,
        text: "»Dieses Buch hat mir gezeigt, dass mein Leben gar nicht so chaotisch ist.«",
        author: "Eine dankbare Leserin",
    },
    {
        stars: 5,
        text: "»Habe beim Lesen so laut gelacht, dass meine Nachbarn die Polizei gerufen haben. 10/10, würde wieder eine Anzeige riskieren.«",
        author: "Lärmbelästiger",
    },
    {
        stars: 3,
        text: "»Ich bin mir nicht sicher, was ich da gelesen habe, aber ich konnte nicht aufhören.«",
        author: "Verwirrt, aber fasziniert",
    },
    {
        stars: 5,
        text: "»Endlich ein Buch, das so denkt wie ich! Jetzt fühle ich mich weniger allein mit meinen seltsamen Gedanken.«",
        author: "Ein Seelenverwandter",
    },
    {
        stars: 4,
        text: "»Besser als jede Tasse Kaffee, um morgens wach zu werden. Ein Adrenalinschub in Prosaform.«",
        author: "Koffein-Junkie",
    }
]


export function Testimonials() {
  return (
    <section id="testimonials" aria-labelledby="testimonials-heading" className="w-full py-12 md:py-16 bg-secondary text-secondary-foreground">
      <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6 animate-in fade-in-0 slide-in-from-top-12 duration-1000">
        <div className="space-y-3">
          <h2 id="testimonials-heading" className="text-3xl font-bold font-headline tracking-tighter md:text-4xl/tight">
            Begeisterte Kritiken von unseren Fans
          </h2>
          <p className="mx-auto max-w-[600px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed text-balance">
            Verlassen Sie sich nicht nur auf unser Wort.
          </p>
        </div>
        <div className="w-full max-w-xs sm:max-w-xl md:max-w-2xl lg:max-w-4xl mx-auto mt-12">
            <Carousel opts={{ loop: true, align: "start" }} className="w-full">
                 <CarouselContent>
                    {reviews.map((review, index) => (
                        <CarouselItem key={index} className="sm:basis-1/2 lg:basis-1/3">
                             <Card as="figure" className="h-full transform transition-transform hover:scale-105 rotate-1 even:-rotate-1">
                                <CardContent className="p-6 flex flex-col justify-between h-full">
                                <div>
                                    <div className="flex mb-2" aria-label={`Bewertung: ${review.stars} von 5 Sternen`}>
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <Star key={i} className={`w-5 h-5 ${i < review.stars ? 'fill-primary text-primary' : 'fill-muted stroke-muted-foreground'}`} />
                                        ))}
                                    </div>
                                    <blockquote className="text-sm text-left italic">{review.text}</blockquote>
                                </div>
                                <figcaption className="text-right mt-4 font-semibold text-sm">- {review.author}</figcaption>
                                </CardContent>
                            </Card>
                        </CarouselItem>
                    ))}
                 </CarouselContent>
                 <CarouselPrevious className="hidden sm:flex -left-4 md:-left-12" />
                 <CarouselNext className="hidden sm:flex -right-4 md:-right-12" />
            </Carousel>
        </div>
      </div>
    </section>
  );
}
