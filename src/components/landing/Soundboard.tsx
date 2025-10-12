
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Volume2, Zap, UserX, Footprints, Frown } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const sounds = [
  { name: "Trillerpfeife", icon: Zap, color: "bg-red-500/20 text-red-500" },
  { name: "Ball im Gesicht", icon: UserX, color: "bg-yellow-500/20 text-yellow-500" },
  { name: "Quietsch-Turnschuh", icon: Footprints, color: "bg-blue-500/20 text-blue-500" },
  { name: "Kollektives Stöhnen", icon: Frown, color: "bg-green-500/20 text-green-500" },
];

export function Soundboard() {
  const [playing, setPlaying] = useState<string | null>(null);

  const playSound = (name: string) => {
    setPlaying(name);
    setTimeout(() => setPlaying(null), 300); // Duration of the animation
  };

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-900 text-gray-50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold font-headline tracking-tighter sm:text-5xl">
              Der Sound des Schreckens
            </h2>
            <p className="max-w-[900px] text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed text-balance">
              Die unvergessliche Symphonie der Turnhalle. Klicken Sie, um das Trauma erneut zu durchleben.
            </p>
          </div>
        </div>
        <div className="mx-auto max-w-lg mt-12">
            <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-6 grid grid-cols-2 gap-4">
                    {sounds.map((sound) => (
                        <motion.div key={sound.name} animate={{ scale: playing === sound.name ? 1.1 : 1 }} transition={{ type: "spring", stiffness: 500, damping: 15 }}>
                            <Button
                                variant="outline"
                                className={cn("w-full h-24 flex flex-col gap-2 border-gray-700 hover:bg-gray-700", sound.color)}
                                onClick={() => playSound(sound.name)}
                            >
                                <sound.icon className="h-8 w-8" />
                                <span className="text-xs font-semibold">{sound.name}</span>
                            </Button>
                        </motion.div>
                    ))}
                </CardContent>
            </Card>
        </div>
      </div>
    </section>
  );
}
