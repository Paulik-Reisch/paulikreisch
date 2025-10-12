
"use client";

import { useRef, useEffect } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { MapPin, Hospital, Factory, AlertCircle, HelpCircle, Briefcase, HeartCrack, ShoppingCart, Drama } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const stops = [
  { name: "Boulevard der gebrochenen Versprechen", description: "(Bürgerbüro)", icon: AlertCircle, position: { top: "5%", side: "left" } },
  { name: "Letzte Hoffnung", description: "(Krankenhaus)", icon: Hospital, position: { top: "15%", side: "right" } },
  { name: "Paralleluniversum", description: "(Industriegebiet)", icon: Factory, position: { top: "25%", side: "left" } },
  { name: "Endstation Sehnsucht", description: "(Hauptbahnhof)", icon: HeartCrack, position: { top: "38%", side: "right" } },
  { name: "Bermudadreieck", description: "(Wo Fahrpläne verschwinden)", icon: HelpCircle, position: { top: "50%", side: "left" } },
  { name: "Kaufrausch-Klippe", description: "(Einkaufszentrum)", icon: ShoppingCart, position: { top: "62%", side: "right" } },
  { name: "Fata Morgana", description: "(Neubaugebiet)", icon: Drama, position: { top: "75%", side: "left" } },
  { name: "Tal der Ahnungslosen", description: "(Universität)", icon: Briefcase, position: { top: "88%", side: "right" } },
  { name: "Fegefeuer", description: "(Finanzamt)", icon: MapPin, position: { top: "98%", side: "left" } },
];

function StopItem({ stop }: { stop: typeof stops[0] }) {
    const isRight = stop.position.side === 'right';
    return (
        <div 
            className="absolute w-1/2"
            style={{ 
                top: stop.position.top, 
                ...(isRight ? { left: '55%' } : { right: '55%' })
            }}
        >
            <motion.div 
                className={cn("w-full", isRight ? "text-left" : "text-right")}
                initial={{ opacity: 0, x: isRight ? 50 : -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5 }}
            >
                <h4 className="font-bold text-lg font-headline">{stop.name}</h4>
                <p className="text-sm text-muted-foreground">{stop.description}</p>
            </motion.div>
        </div>
    )
}

function StopDot({ stop }: { stop: typeof stops[0] }) {
     return (
        <motion.div
            className="absolute left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center z-10 shrink-0 shadow-lg"
            style={{ top: `calc(${stop.position.top} - 1.25rem)`}}
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.3, type: 'spring', stiffness: 300, damping: 20 }}
        >
            <stop.icon className="h-5 w-5"/>
        </motion.div>
    )
}


export function BusStopNames() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
      target: ref,
      offset: ["start end", "end start"]
  });

  const pathLength = useSpring(scrollYProgress, {
    stiffness: 400,
    damping: 90,
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
        <div ref={ref} className="max-w-2xl mx-auto relative hidden md:block" style={{ height: "1200px" }}>
            <svg width="100%" height="100%" viewBox="0 0 200 1200" preserveAspectRatio="none" className="absolute top-0 left-0">
                <motion.path
                    d="M 100 0 Q 150 150, 100 300 T 100 600 Q 50 750, 100 900 T 100 1200"
                    fill="none"
                    stroke="hsl(var(--primary) / 0.2)"
                    strokeWidth="4"
                />
                 <motion.path
                    d="M 100 0 Q 150 150, 100 300 T 100 600 Q 50 750, 100 900 T 100 1200"
                    fill="none"
                    stroke="hsl(var(--primary))"
                    strokeWidth="4"
                    style={{ pathLength }}
                />
            </svg>
            <div className="relative h-full">
                {stops.map((stop, index) => (
                    <React.Fragment key={index}>
                        <StopItem stop={stop} />
                        <StopDot stop={stop} />
                    </React.Fragment>
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
