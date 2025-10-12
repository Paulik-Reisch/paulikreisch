
"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, RefreshCw } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const horoscopes = [
    { sign: "Gabel", prediction: "Ein Nudelrest wird sich an unerwarteter Stelle an Ihnen festklammern." },
    { sign: "Messer", prediction: "Sie werden eine tiefgründige Konversation mit einem Kohlrabi führen. Er wird nicht antworten." },
    { sign: "Löffel", prediction: "Ihre Suppe wird mysteriöse Blasen werfen. Rühren Sie nicht um. Fragen Sie nicht." },
    { sign: "Tablett", prediction: "Sie werden die Schwerkraft herausfordern, indem Sie versuchen, mit vollem Tablett zu rennen. Die Schwerkraft gewinnt immer." },
    { sign: "Salzstreuer", prediction: "Eine versehentliche Überdosis Salz wird Ihr Essen ... interessanter machen." },
    { sign: "Serviette", prediction: "Sie werden versuchen, einen Fleck zu entfernen, und ihn nur zu einem modernen Kunstwerk verschmieren." },
];

export function MensaHoroscopes() {
  const [currentHoroscope, setCurrentHoroscope] = useState(horoscopes[0]);
  const [key, setKey] = useState(0);

  const getNewHoroscope = () => {
    let newHoroscope;
    do {
      newHoroscope = horoscopes[Math.floor(Math.random() * horoscopes.length)];
    } while (newHoroscope.sign === currentHoroscope.sign);
    setCurrentHoroscope(newHoroscope);
    setKey(prev => prev + 1); // Trigger animation
  };

  return (
    <section className="w-full pt-0 pb-8 md:py-12">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
            <h2 className="text-3xl font-bold font-headline tracking-tighter sm:text-5xl">
              ensa-Horoskop
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed text-balance">
              Finden Sie heraus, was die kulinarischen Sterne heute für Sie bereithalten.
            </p>
        </div>
        <Card className="max-w-md mx-auto mt-12 shadow-lg">
          <CardHeader className="text-center">
              <Sparkles className="w-10 h-10 mx-auto text-primary" />
              <CardTitle className="font-headline text-2xl mt-2">Tages-Prophezeiung</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
              <AnimatePresence mode="wait">
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="min-h-[100px]"
                  >
                    <p className="text-lg font-semibold text-primary">{currentHoroscope.sign}:</p>
                    <p className="text-muted-foreground">{currentHoroscope.prediction}</p>
                </motion.div>
              </AnimatePresence>
              <Button onClick={getNewHoroscope}>
                  Neues Schicksal erfahren <RefreshCw className="ml-2 h-4 w-4" />
              </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
