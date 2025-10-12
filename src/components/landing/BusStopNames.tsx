
"use client";

import React from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import { Hospital, Factory, Drama, HelpCircle, HeartCrack, AlertCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const stops = [
  { name: "Boulevard der gebrochenen Versprechen", description: "(Bürgerbüro)", icon: AlertCircle },
  { name: "Letzte Hoffnung", description: "(Krankenhaus)", icon: Hospital },
  { name: "Paralleluniversum", description: "(Industriegebiet)", icon: Factory },
  { name: "Endstation Sehnsucht", description: "(Hauptbahnhof)", icon: HeartCrack },
  { name: "Bermudadreieck", description: "(Jobcenter)", icon: HelpCircle },
  { name: "Fegefeuer", description: "(Finanzamt)", icon: Drama },
];

// For Desktop View
function StopPoint({ stop, progress, range }: { stop: typeof stops[0]; progress: any; range: [number, number] }) {
  const scale = useTransform(progress, range, [0.5, 1]);
  const opacity = useTransform(progress, range, [0.3, 1]);

  return (
    <motion.div style={{ opacity }}>
      <motion.div style={{ scale }} className="absolute w-4 h-4 rounded-full bg-primary -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute -translate-x-1/2 -translate-y-full mb-4 w-48 text-center">
        <h4 className="font-bold text-sm">{stop.name}</h4>
        <p className="text-xs text-muted-foreground">{stop.description}</p>
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

  // Animate path drawing
  const pathLength = useTransform(scrollYProgress, [0.1, 0.9], [0, 1]);

  return (
    <section className="w-full py-16 md:py-24 bg-background">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center mb-16">
          <h2 className="text-3xl font-bold font-headline tracking-tighter sm:text-5xl">
            Die wahren Haltestellennamen
          </h2>
        </div>

        {/* Desktop View: Serpentine SVG Path */}
        <div ref={targetRef} className="hidden md:block h-[500px] relative">
          <svg width="100%" height="100%" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid meet">
            {/* Background Path */}
            <path
              d="M 50 100 H 750 L 750 200 L 50 200 L 50 300 H 750"
              fill="none"
              stroke="hsl(var(--muted))"
              strokeWidth="4"
              strokeLinecap="round"
            />
            {/* Progress Path */}
            <motion.path
              d="M 50 100 H 750 L 750 200 L 50 200 L 50 300 H 750"
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="4"
              strokeLinecap="round"
              style={{ pathLength }}
            />
            {/* Stop points and labels */}
            <g style={{ transform: "translate(50px, 100px)" }}>
              <StopPoint stop={stops[0]} progress={scrollYProgress} range={[0, 0.2]} />
            </g>
            <g style={{ transform: "translate(283px, 100px)" }}>
              <StopPoint stop={stops[1]} progress={scrollYProgress} range={[0.1, 0.4]} />
            </g>
            <g style={{ transform: "translate(516px, 100px)" }}>
              <StopPoint stop={stops[2]} progress={scrollYProgress} range={[0.2, 0.5]} />
            </g>
            
            <g style={{ transform: "translate(750px, 200px)" }}>
              <StopPoint stop={stops[3]} progress={scrollYProgress} range={[0.3, 0.7]} />
            </g>
             <g style={{ transform: "translate(400px, 200px)" }}>
              <StopPoint stop={stops[4]} progress={scrollYProgress} range={[0.5, 0.9]} />
            </g>
            <g style={{ transform: "translate(50px, 300px)" }}>
              <StopPoint stop={stops[5]} progress={scrollYProgress} range={[0.7, 1.0]} />
            </g>
          </svg>
        </div>
        
        {/* Mobile View as Cards */}
        <div className="grid md:hidden grid-cols-1 sm:grid-cols-2 gap-4 max-w-5xl mx-auto">
            {stops.map((stop, index) => (
                 <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                    <Card>
                        <CardHeader className="flex flex-row items-center gap-4">
                            <div className="p-3 bg-primary/10 rounded-full">
                                <stop.icon className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="font-headline text-base">{stop.name}</CardTitle>
                                <CardDescription>{stop.description}</CardDescription>
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
