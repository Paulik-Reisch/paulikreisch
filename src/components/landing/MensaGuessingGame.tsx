
"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, RefreshCw, XCircle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const questions = [
  {
    imageSrc: "https://picsum.photos/seed/mensa1/400/300",
    imageHint: "mystery food one",
    answers: [
      { text: "Experimentelle Kunst aus dem Chemielabor", isCorrect: false },
      { text: "Recycelte Reste von letzter Woche", isCorrect: true },
      { text: "Ein seltener, essbarer Meteorit", isCorrect: false },
      { text: "Der Versuch, Götterspeise und Gulasch zu kreuzen", isCorrect: false },
    ],
    feedbackCorrect: "Richtig! Nachhaltigkeit wird bei uns großgeschrieben. Gestern Gulasch, heute Auflauf.",
    feedbackIncorrect: "Leider falsch. So kreativ ist unsere Küche dann doch nicht."
  },
  {
    imageSrc: "https://picsum.photos/seed/mensa2/400/300",
    imageHint: "mystery food two",
    answers: [
      { text: "Ein mutiertes Brokkoli-Röschen", isCorrect: false },
      { text: "Dekonstruierter Salat 'Zukunft'", isCorrect: false },
      { text: "Etwas, das mal grün war", isCorrect: true },
      { text: "Die verlorene Socke vom Hausmeister", isCorrect: false },
    ],
    feedbackCorrect: "Exakt! Die Farbe ist eine vage Erinnerung an bessere, frischere Zeiten.",
    feedbackIncorrect: "Netter Versuch, aber die Realität ist viel trauriger."
  }
];

export function MensaGuessingGame() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [result, setResult] = useState<{ isCorrect: boolean; feedback: string } | null>(null);
  const [key, setKey] = useState(0);

  const currentQuestion = questions[currentQuestionIndex];

  const handleGuess = () => {
    if (!selectedAnswer) return;
    const answer = currentQuestion.answers.find(a => a.text === selectedAnswer);
    if (answer) {
      setResult({
        isCorrect: answer.isCorrect,
        feedback: answer.isCorrect ? currentQuestion.feedbackCorrect : currentQuestion.feedbackIncorrect
      });
    }
  };

  const handleNext = () => {
    setResult(null);
    setSelectedAnswer(null);
    setCurrentQuestionIndex((prev) => (prev + 1) % questions.length);
    setKey(prev => prev + 1); // Remount component for animation
  };

  return (
    <section className="w-full py-8 md:py-12 bg-subtle-yellow">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
            <h2 className="text-3xl font-bold font-headline tracking-tighter sm:text-5xl">
              Was ist das? Das Mensa-Ratespiel
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed text-balance">
              Testen Sie Ihr Wissen über unsere kulinarischen Kreationen. Nur für Hartgesottene.
            </p>
        </div>

        <Card className="max-w-2xl mx-auto mt-12 shadow-lg">
          <CardHeader>
            <CardTitle>Runde {currentQuestionIndex + 1}</CardTitle>
            <CardDescription>Identifizieren Sie das Gericht.</CardDescription>
          </CardHeader>
          <CardContent>
            <AnimatePresence mode="wait">
              <motion.div
                key={key}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex flex-col items-center gap-6">
                  <div className="relative w-full aspect-video rounded-lg overflow-hidden border-4 border-background">
                    <Image
                      src={currentQuestion.imageSrc}
                      alt="Ein undefinierbares Mensa-Gericht"
                      data-ai-hint={currentQuestion.imageHint}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {!result ? (
                    <>
                      <RadioGroup onValueChange={setSelectedAnswer} value={selectedAnswer || ""} className="w-full space-y-2">
                        {currentQuestion.answers.map((answer, index) => (
                          <div key={index} className="flex items-center space-x-2 p-3 bg-background rounded-md border">
                            <RadioGroupItem value={answer.text} id={`q${currentQuestionIndex}-a${index}`} />
                            <Label htmlFor={`q${currentQuestionIndex}-a${index}`} className="flex-1 text-left">{answer.text}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                      <Button onClick={handleGuess} disabled={!selectedAnswer} className="w-full">
                        Raten!
                      </Button>
                    </>
                  ) : (
                    <div className="w-full space-y-4">
                      <Alert variant={result.isCorrect ? "default" : "destructive"}>
                        {result.isCorrect ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                        <AlertTitle>{result.isCorrect ? "Korrekt!" : "Falsch!"}</AlertTitle>
                        <AlertDescription>{result.feedback}</AlertDescription>
                      </Alert>
                      <Button onClick={handleNext} className="w-full">
                        Nächste Runde <RefreshCw className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
