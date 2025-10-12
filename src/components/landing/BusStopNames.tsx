
"use client";

import React from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import { Hospital, Factory, Drama, HelpCircle, HeartCrack, Siren } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const stops = [
    { name: "Boulevard der gebrochenen Versprechen", description: "(Bürgerbüro)", icon: Siren, x: 5, y: 50 },
    { name: "Letzte Hoffnung", description: "(Krankenhaus)", icon: Hospital, x: 25, y: 150 },
    { name: "Paralleluniversum", description: "(Industriegebiet)", icon: Factory, x: 50, y: 50 },
    { name: "Endstation Sehnsucht", description: "(Hauptbahnhof)", icon: HeartCrack, x: 75, y: 150 },
    { name: "Bermudadreieck", description: "(Jobcenter)", icon: HelpCircle, x: 95, y: 50 },
    { name: "Fegefeuer", description: "(Finanzamt)", icon: Drama, x: 50, y: 250 },
];

function StopPoint({ stop, progress, range, isMobile }: { stop: typeof stops[0]; progress: any; range: [number, number]; isMobile: boolean }) {
  const scale = useTransform(progress, range, [0.5, 1]);
  const opacity = useTransform(progress, range, [0.3, 1]);

  return (
    <motion.div 
      className="absolute"
      style={{ 
        left: `${stop.x}%`, 
        top: isMobile ? 'auto' : `${stop.y}%`, 
        bottom: isMobile ? `${stop.y}%` : 'auto',
        scale, 
        opacity 
      }}
    >
      <div className="relative flex flex-col items-center">
        <stop.icon className="h-8 w-8 text-primary" />
        <div className="mt-2 w-32 text-center">
            <h4 className="font-bold text-sm">{stop.name}</h4>
            <p className="text-xs text-muted-foreground">{stop.description}</p>
        </div>
      </div>
    </motion.div>
  );
}


export function BusStopNames() {
  const targetRef = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start center", "end center"],
  });

  const pathLength = useTransform(scrollYProgress, [0, 0.8], [0, 1]);

  return (
    <section ref={targetRef} className="w-full py-16 md:py-24 bg-background">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center mb-16">
          <h2 className="text-3xl font-bold font-headline tracking-tighter sm:text-5xl">
            Die wahren Haltestellennamen
          </h2>
        </div>

        {/* Desktop View: Serpentine SVG Path */}
        <div className="hidden md:block h-[300px] relative">
            <svg width="100%" height="100%" viewBox="0 0 1000 300" preserveAspectRatio="none">
                 <motion.path
                    d="M 50 50 Q 250 150, 500 50 T 950 50 Q 750 250, 500 250 T 50 250"
                    fill="none"
                    stroke="hsl(var(--muted))"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <motion.path
                    d="M 50 50 Q 250 150, 500 50 T 950 50 Q 750 250, 500 250 T 50 250"
                    fill="none"
                    stroke="hsl(var(--primary))"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ pathLength }}
                />
            </svg>
            <div className="absolute inset-0">
                {stops.map((stop, index) => {
                    const stopProgressRange: [number, number] = [index * 0.1, (index + 1) * 0.15];
                    return (
                        <StopPoint 
                            key={stop.name} 
                            stop={stop} 
                            progress={scrollYProgress} 
                            range={stopProgressRange}
                            isMobile={false}
                        />
                    );
                })}
            </div>
        </div>
        
        {/* Mobile View as Cards */}
        <div className="grid md:hidden grid-cols-2 gap-4 max-w-5xl mx-auto">
            {stops.map((stop, index) => (
                 <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                    <Card>
                        <CardHeader className="flex flex-col items-center text-center gap-2 p-4">
                            <div className="p-3 bg-primary/10 rounded-full">
                                <stop.icon className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="font-headline text-sm">{stop.name}</CardTitle>
                                <CardDescription className="text-xs">{stop.description}</CardDescription>
                            </div>
                        </CardHeader>
                    </Card>
                </motion.div>
            ))}
        </div>
      </div>
    </section>
  );
}
