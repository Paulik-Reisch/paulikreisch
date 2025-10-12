
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Volume2, Zap, UserX, Footprints, Frown, Pyramid, Megaphone, Coffee, Angry, Wind, Repeat, Shield, ThumbsDown, TimerOff, Dumbbell, Siren, Bone, Bot } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const sounds = [
  { name: "Trillerpfeife", icon: Zap, color: "bg-red-500/20 text-red-500" },
  { name: "Ball im Gesicht", icon: UserX, color: "bg-yellow-500/20 text-yellow-500" },
  { name: "Quietsch-Turnschuh", icon: Footprints, color: "bg-blue-500/20 text-blue-500" },
  { name: "Kollektives Stöhnen", icon: Frown, color: "bg-green-500/20 text-green-500" },
  { name: "Gerät kracht um", icon: Pyramid, color: "bg-gray-400/20 text-gray-400" },
  { name: "Lehrer schreit", icon: Megaphone, color: "bg-red-600/20 text-red-600" },
  { name: "Schlürfen (Kaffee)", icon: Coffee, color: "bg-amber-700/20 text-amber-700" },
  { name: "Wut-Schnauben", icon: Angry, color: "bg-orange-500/20 text-orange-500" },
  { name: "Heftiges Keuchen", icon: Wind, color: "bg-cyan-400/20 text-cyan-400" },
  { name: "Endlos-Runden-Musik", icon: Repeat, color: "bg-purple-500/20 text-purple-500" },
  { name: "Abpraller (Schild)", icon: Shield, color: "bg-indigo-500/20 text-indigo-500" },
  { name: "Demütigung", icon: ThumbsDown, color: "bg-rose-700/20 text-rose-700" },
  { name: "Zeit abgelaufen", icon: TimerOff, color: "bg-lime-500/20 text-lime-500" },
  { name: "Gewicht fällt", icon: Dumbbell, color: "bg-zinc-500/20 text-zinc-500" },
  { name: "Pausengong", icon: Siren, color: "bg-teal-500/20 text-teal-500" },
  { name: "Knochen knacken", icon: Bone, color: "bg-stone-400/20 text-stone-400" },
  { name: "System-Error", icon: Bot, color: "bg-pink-500/20 text-pink-500" },
  { name: "Stille...", icon: Volume2, color: "bg-gray-700/20 text-gray-700" },
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
        <div className="mx-auto max-w-2xl mt-12">
            <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-6 grid grid-cols-3 sm:grid-cols-6 gap-4">
                    {sounds.map((sound) => (
                        <motion.div key={sound.name} animate={{ scale: playing === sound.name ? 1.1 : 1 }} transition={{ type: "spring", stiffness: 500, damping: 15 }}>
                            <Button
                                variant="outline"
                                className={cn("w-full aspect-square flex flex-col gap-2 border-gray-700 hover:bg-gray-700 p-2", sound.color)}
                                onClick={() => playSound(sound.name)}
                            >
                                <sound.icon className="h-6 w-6 sm:h-8 sm:w-8" />
                                <span className="text-xs font-semibold text-center">{sound.name}</span>
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
