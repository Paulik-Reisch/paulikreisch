import { Star } from 'lucide-react';
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
        text: "Ich dachte, ich hätte schon alles gelesen. Dann kam 'Hallo Welt' und hat mein Gehirn neu verkabelt. Aua. Aber gut.",
        author: "Ein Literaturkritiker",
    },
    {
        stars: 4,
        text: "Dieses Buch hat mir gezeigt, dass mein Leben gar nicht so chaotisch ist. Danke?",
        author: "Eine dankbare Leserin",
    },
    {
        stars: 5,
        text: "Habe beim Lesen so laut gelacht, dass meine Nachbarn die Polizei gerufen haben. 10/10, würde wieder eine Anzeige riskieren.",
        author: "Lärmbelästiger",
    },
    {
        stars: 3,
        text: "Ich bin mir nicht sicher, was ich da gelesen habe, aber ich konnte nicht aufhören. Ist das eine Sekte?",
        author: "Verwirrt, aber fasziniert",
    },
    {
        stars: 5,
        text: "Endlich ein Buch, das so denkt wie ich! Jetzt fühle ich mich weniger allein mit meinen seltsamen Gedanken.",
        author: "Ein Seelenverwandter",
    },
    {
        stars: 4,
        text: "Besser als jede Tasse Kaffee, um morgens wach zu werden. Ein Adrenalinschub in Prosaform.",
        author: "Koffein-Junkie",
    }
]


export function Reviews() {
  return (
    <section id="reviews" className="w-full py-12 md:py-24 lg:py-32" style={{ backgroundColor: 'hsl(var(--color-bg-light-pink))' }}>
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold font-headline tracking-tighter sm:text-5xl">Die Leute schreien (vor Lachen)</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed text-balance">
              Was unsere Leser sagen, wenn sie wieder zu Atem gekommen sind.
            </p>
          </div>
        </div>
        <div className="w-full max-w-xs sm:max-w-xl md:max-w-2xl lg:max-w-4xl mx-auto mt-12">
            <Carousel opts={{ loop: true, align: "start" }} className="w-full">
                 <CarouselContent>
                    {reviews.map((review, index) => (
                        <CarouselItem key={index} className="sm:basis-1/2 lg:basis-1/3">
                             <Card className="h-full">
                                <CardContent className="p-6 flex flex-col justify-between h-full">
                                <div>
                                    <div className="flex mb-2">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <Star key={i} className={`w-5 h-5 ${i < review.stars ? 'fill-primary text-primary' : 'fill-muted stroke-muted-foreground'}`} />
                                        ))}
                                    </div>
                                    <p className="text-sm text-left italic">"{review.text}"</p>
                                </div>
                                <p className="text-right mt-4 font-semibold">- {review.author}</p>
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
