
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquareQuote } from "lucide-react";

const quotes = [
  {
    text: "Ich hatte eine wunderbare Zeit, aber es war nicht diese.",
    author: "Winston Churchill (vermutlich nach dem Sportunterricht)",
  },
  {
    text: "Der einzige Sport, den ich mache, ist aufzustehen, um den Pizzaboten reinzulassen.",
    author: "Ein anonymer Lebenskünstler",
  },
  {
    text: "Joggen ist ungesund. Die Eiswürfel fallen mir immer aus dem Glas.",
    author: "Ein Vordenker",
  },
   {
    text: "Ich bin in einer sehr engagierten Beziehung mit meinem Sofa. Wir können uns einfach nicht trennen.",
    author: "Ein loyaler Partner",
  },
   {
    text: "Sport? Ich dachte, du sagtest 'extra Pommes'.",
    author: "Ein Missverständnis",
  },
   {
    text: "Mein Trainingsplan für heute: 99% Denken, 1% darüber nachdenken, ob ich morgen mit dem Denken anfangen soll.",
    author: "Ein Stratege",
  },
];

export function QuotesGallery() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold font-headline tracking-tighter sm:text-5xl">
              Stimmen der Vernunft
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed text-balance">
              Eine Sammlung weiser Worte von Leuten, die es verstanden haben.
            </p>
          </div>
        </div>
        <div className="mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-12">
          {quotes.map((quote, index) => (
            <Card key={index} className="transform transition-transform duration-300 hover:scale-105 hover:rotate-1">
              <CardContent className="p-6 h-full flex flex-col justify-between">
                <blockquote className="text-base italic leading-relaxed text-balance">
                  <MessageSquareQuote className="w-6 h-6 text-primary/70 mb-2" />
                  »{quote.text}«
                </blockquote>
                <p className="text-right text-sm font-semibold text-muted-foreground mt-4">
                  – {quote.author}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
