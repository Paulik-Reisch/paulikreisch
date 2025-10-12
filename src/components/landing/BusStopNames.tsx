
"use client";

import React from "react";
import { Hospital, Factory, AlertCircle, HelpCircle, HeartCrack, MapPin, Drama, Briefcase, ShoppingCart } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { motion } from "framer-motion";

const stops = [
  { name: "Boulevard der gebrochenen Versprechen", description: "(Wo Pünktlichkeit ein Fremdwort ist)", icon: AlertCircle },
  { name: "Letzte Hoffnung", description: "(Krankenhaus)", icon: Hospital },
  { name: "Paralleluniversum", description: "(Industriegebiet)", icon: Factory },
  { name: "Endstation Sehnsucht", description: "(Hauptbahnhof)", icon: HeartCrack },
  { name: "Bermudadreieck", description: "(Wo Fahrpläne verschwinden)", icon: HelpCircle },
  { name: "Fegefeuer", description: "(Finanzamt)", icon: MapPin },
];

export function BusStopNames() {
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
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {stops.map((stop, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                    <Card className="h-full">
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
                </motion.div>
            ))}
        </div>
      </div>
    </section>
  );
}
