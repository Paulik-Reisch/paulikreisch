
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquareQuote } from "lucide-react";

const testimonials = [
  {
    quote:
      "»Ich war drin wegen eines vergessenen Geodreiecks. Zwei Wochen Einzelhaft im Mathekabinett. Ich habe Dinge gesehen ...«",
    inmate: "Insasse #734, überlebte 8 Jahre und 7 Monate",
  },
  {
    quote:
      "»Sie haben mir mein Pausenbrot weggenommen. Es war mit Salami. Die Monster!«",
    inmate: "Insassin #12, suspendiert wegen Verzehrs unerlaubter Wurstwaren",
  },
  {
    quote: "»Einmal hab ich im Flur gelacht. Nur einmal.«",
    inmate: "Insasse #99, seitdem auf der Intensivschweigestation",
  },
];

export function InmateTestimonials() {
  return (
    <section className="w-full py-8 md:py-12 bg-muted">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold font-headline tracking-tighter sm:text-5xl">
              Stimmen aus dem Karzer
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed text-balance">
              Zeugenaussagen ehemaliger Insassen, die es geschafft haben, ihre
              Geschichte zu erzählen.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl items-start gap-6 py-12 lg:grid-cols-3 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="bg-background shadow-lg transform transition-transform hover:scale-105"
            >
              <CardContent className="p-6 space-y-4">
                <MessageSquareQuote className="h-8 w-8 text-muted-foreground" />
                <blockquote className="text-lg font-semibold leading-snug">
                  {testimonial.quote}
                </blockquote>
                <p className="text-sm text-muted-foreground font-medium text-right">
                  – {testimonial.inmate}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
