
"use client";

import { useRef, useEffect } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { MapPin, Hospital, Factory, AlertCircle, HelpCircle, Briefcase, HeartCrack, ShoppingCart, Drama } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const stops = [
  { name: "Boulevard der gebrochenen Versprechen", icon: AlertCircle, description: "(Bürgerbüro)" },
  { name: "Letzte Hoffnung", description: "(Krankenhaus)", icon: Hospital },
  { name: "Paralleluniversum", description: "(Industriegebiet)", icon: Factory },
  { name: "Endstation Sehnsucht", description: "(Hauptbahnhof)", icon: HeartCrack },
  { name: "Bermudadreieck", description: "(Wo Fahrpläne verschwinden)", icon: HelpCircle },
  { name: "Kaufrausch-Klippe", description: "(Einkaufszentrum)", icon: ShoppingCart },
  { name: "Fata Morgana", description: "(Neubaugebiet)", icon: Drama },
  { name: "Tal der Ahnungslosen", description: "(Universität)", icon: Briefcase },
  { name: "Fegefeuer", description: "(Finanzamt)", icon: MapPin },
];

function StopItem({ stop, index }: { stop: typeof stops[0], index: number }) {
    const isEven = index % 2 === 0;
    return (
        <div className="flex items-center w-full justify-center">
            {isEven ? (
                <>
                    <motion.div 
                        className="w-1/2 pr-8 text-right"
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.8 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h4 className="font-bold text-lg font-headline">{stop.name}</h4>
                        <p className="text-sm text-muted-foreground">{stop.description}</p>
                    </motion.div>
                    <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center z-10 shrink-0 shadow-lg">
                        <stop.icon className="h-5 w-5"/>
                    </div>
                    <div className="w-1/2" />
                </>
            ) : (
                 <>
                    <div className="w-1/2" />
                     <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center z-10 shrink-0 shadow-lg">
                        <stop.icon className="h-5 w-5"/>
                    </div>
                    <motion.div 
                        className="w-1/2 pl-8 text-left"
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.8 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h4 className="font-bold text-lg font-headline">{stop.name}</h4>
                        <p className="text-sm text-muted-foreground">{stop.description}</p>
                    </motion.div>
                </>
            )}
        </div>
    )
}

export function BusStopNames() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
      target: ref,
      offset: ["start end", "end start"]
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <section className="w-full py-16 md:py-24 bg-background">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center mb-16">
            <h2 className="text-3xl font-bold font-headline tracking-tighter sm:text-5xl">
              Die wahren Haltestellennamen
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed text-balance">
              Eine ehrliche Umbenennung der Stationen auf Ihrer täglichen Odyssee.
            </p>
        </div>
        
        {/* Desktop View */}
        <div ref={ref} className="max-w-2xl mx-auto relative hidden md:block">
            <motion.div
                className="absolute left-1/2 top-0 w-1 bg-primary/20 h-full origin-top"
            />
            <motion.div
                className="absolute left-1/2 top-0 w-1 bg-primary h-full origin-top"
                style={{ scaleY }}
            />
             <div className="relative flex flex-col gap-24">
                {stops.map((stop, index) => (
                    <StopItem key={index} stop={stop} index={index} />
                ))}
            </div>
        </div>

        {/* Mobile View */}
        <div className="max-w-2xl mx-auto space-y-4 md:hidden">
            {stops.map((stop, index) => (
                <Card key={index}>
                    <CardHeader className="flex flex-row items-center gap-4">
                         <div className="p-3 bg-primary/10 rounded-full">
                            <stop.icon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="font-headline text-lg">{stop.name}</CardTitle>
                            <CardDescription>{stop.description}</CardDescription>
                        </div>
                    </CardHeader>
                </Card>
            ))}
        </div>
      </div>
    </section>
  );
}
