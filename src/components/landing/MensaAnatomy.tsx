
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export function MensaAnatomy() {
  return (
    <section className="w-full py-12 md:py-24 bg-background">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
            <h2 className="text-3xl font-bold font-headline tracking-tighter sm:text-5xl">
              Anatomie eines Mensa-Tabletts
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed text-balance">
              Eine wissenschaftliche Aufschlüsselung der Komponenten.
            </p>
        </div>
        <div className="max-w-3xl mx-auto mt-12">
            <div className="relative">
                <Image 
                    src="https://picsum.photos/seed/mensatray/800/500"
                    alt="Ein typisches Mensa-Tablett von oben"
                    data-ai-hint="food tray top down"
                    width={800}
                    height={500}
                    className="rounded-lg shadow-lg border"
                />
                
                {/* Pointer 1: Hauptgericht */}
                <div className="absolute top-[30%] left-[25%]">
                    <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                    <div className="absolute left-4 top-4 w-48 p-2 bg-background/80 backdrop-blur-sm border rounded-lg shadow-md">
                        <p className="font-bold text-sm">Hauptspeise</p>
                        <p className="text-xs text-muted-foreground">"Montags-Rätsel" - besteht zu 40% aus unbekannter organischer Materie.</p>
                    </div>
                </div>

                {/* Pointer 2: Beilage */}
                <div className="absolute top-[60%] left-[55%]">
                    <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                    <div className="absolute left-4 top-4 w-48 p-2 bg-background/80 backdrop-blur-sm border rounded-lg shadow-md">
                        <p className="font-bold text-sm">Beilage</p>
                        <p className="text-xs text-muted-foreground">"Kartoffel-ähnliches Erzeugnis" mit Spurenelementen von echtem Gemüse.</p>
                    </div>
                </div>

                {/* Pointer 3: Getränk */}
                 <div className="absolute top-[20%] right-[15%]">
                    <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                    <div className="absolute right-4 top-4 w-48 p-2 bg-background/80 backdrop-blur-sm border rounded-lg shadow-md">
                        <p className="font-bold text-sm">Getränk</p>
                        <p className="text-xs text-muted-foreground">"Wasser, geschmacksneutralisiert". Herkunft: unklar, vermutlich eine Pfütze.</p>
                    </div>
                </div>

                 {/* Pointer 4: Dessert */}
                <div className="absolute bottom-[15%] right-[20%]">
                    <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                     <div className="absolute right-4 bottom-4 w-48 p-2 bg-background/80 backdrop-blur-sm border rounded-lg shadow-md">
                        <p className="font-bold text-sm">Dessert</p>
                        <p className="text-xs text-muted-foreground">"Götterspeise, grün". Leuchtet im Dunkeln. Nicht empfohlen.</p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
}
