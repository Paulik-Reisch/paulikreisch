
import { Star, PawPrint } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";

export function Testimonials() {
  return (
    <section id="testimonials" className="w-full py-12 md:py-16 bg-secondary text-secondary-foreground">
      <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6 animate-in fade-in-0 slide-in-from-top-12 duration-1000">
        <div className="space-y-3">
          <h2 className="text-3xl font-bold font-headline tracking-tighter md:text-4xl/tight">
            Begeisterte Kritiken von unseren Fans
          </h2>
          <p className="mx-auto max-w-[600px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed text-balance">
            Verlassen Sie sich nicht nur auf unser Wort.
          </p>
        </div>
        <div className="grid w-full grid-cols-1 lg:grid-cols-3 gap-6 pt-8">
          <Card className="transform transition-transform hover:scale-105 rotate-1">
            <CardContent className="p-6">
              <div className="flex mb-2">
                <Star className="w-5 h-5 fill-primary text-primary" />
                <Star className="w-5 h-5 fill-primary text-primary" />
                <Star className="w-5 h-5 fill-primary text-primary" />
                <Star className="w-5 h-5 fill-primary text-primary" />
                <Star className="w-5 h-5 fill-muted stroke-muted-foreground" />
              </div>
              <p className="text-sm text-left italic">»Ich habe gelacht, ich habe geweint, ich habe meine Lebensentscheidungen in Frage gestellt. Meistens letzteres.«</p>
              <p className="text-right mt-2 font-semibold">– Ein verwirrter Leser</p>
            </CardContent>
          </Card>
          <Card className="transform transition-transform hover:scale-105 -rotate-2">
            <CardContent className="p-6">
                <div className="flex mb-2">
                    <Star className="w-5 h-5 fill-primary text-primary" />
                    <Star className="w-5 h-5 fill-primary text-primary" />
                    <Star className="w-5 h-5 fill-primary text-primary" />
                    <Star className="w-5 h-5 fill-primary text-primary" />
                    <Star className="w-5 h-5 fill-primary text-primary" />
                </div>
              <p className="text-sm text-left italic">»Dieses Buch ist eine Gefahr! Ich habe meinen Kaffee verschüttet, weil ich zu sehr gelacht habe.«</p>
              <p className="text-right mt-2 font-semibold">– Opfer der Komödie</p>
            </CardContent>
          </Card>
          <Card className="transform transition-transform hover:scale-105 rotate-1">
            <CardContent className="p-6">
              <div className="flex mb-2">
                <PawPrint className="w-5 h-5 fill-primary text-primary" />
                <PawPrint className="w-5 h-5 fill-primary text-primary" />
                <PawPrint className="w-5 h-5 fill-primary text-primary" />
                <PawPrint className="w-5 h-5 fill-primary text-primary" />
                <PawPrint className="w-5 h-5 fill-muted stroke-muted-foreground" />
              </div>
              <p className="text-sm text-left italic">»Meine Katze gibt vier Pfoten nach oben! Auch wenn sie es vorzieht, auf dem Buch zu schlafen.«</p>
              <p className="text-right mt-2 font-semibold">– Ein Haustierbesitzer</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
