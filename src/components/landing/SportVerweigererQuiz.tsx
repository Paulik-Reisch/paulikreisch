
"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Wand2, Stethoscope, EyeOff, Check, ArrowRight, RefreshCw, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const questions = [
  {
    question: "Vergisst du deinen Sportbeutel öfter als deinen eigenen Namen?",
    type: "kreativ"
  },
  {
    question: "Entwickelst du pünktlich zum Sportunterricht mysteriöse, kurzfristige Krankheiten (z.B. akute Unlust, spontane Müdigkeit)?",
    type: "krank"
  },
  {
    question: "Hast du die Kunst perfektioniert, hinter dem größten Mitschüler unsichtbar zu werden?",
    type: "taktisch"
  },
  {
    question: "Beinhaltet deine häufigste sportliche Aktivität das Binden deiner Schuhe – für die gesamte Doppelstunde?",
    type: "taktisch"
  },
  {
    question: "Hast du schon mal eine ärztliche Entschuldigung mit Ketchup gefälscht, um es dramatischer aussehen zu lassen?",
    type: "kreativ"
  },
  {
    question: "Kennst du den Vornamen der Schulkrankenschwester besser als die Regeln von Völkerball?",
    type: "krank"
  }
];

const results = {
    kreativ: {
        title: "Der kreative Ausredenerfinder",
        description: "Deine Energie fließt nicht in Sprints, sondern in epische Geschichten über entführte Turnschuhe und spontane Familienfeiern. Du bist der Shakespeare des Sport-Schwänzens.",
        icon: Wand2
    },
    krank: {
        title: "Der chronische Kränkler",
        description: "Dein Körper ist ein medizinisches Wunderwerk, das pünktlich zur Sportstunde seltene und exotische Leiden entwickelt. Deine Paradedisziplin ist das überzeugende Husten.",
        icon: Stethoscope
    },
    taktisch: {
        title: "Der taktische Unsichtbare",
        description: "Du bist der Ninja der Turnhalle. Du beherrschst die Kunst, anwesend und doch abwesend zu sein. Dein Motto: Wer sich nicht bewegt, wird nicht getroffen.",
        icon: EyeOff
    }
}

export function SportVerweigererQuiz() {
  const [currentStep, setCurrentStep] = useState(0);
  const [scores, setScores] = useState({ kreativ: 0, krank: 0, taktisch: 0 });
  const [isFinished, setIsFinished] = useState(false);
  const [answers, setAnswers] = useState<{[key: number]: string}>({});

  const handleAnswer = (value: string) => {
    setAnswers(prev => ({...prev, [currentStep]: value}));
  };

  const handleNext = () => {
    const answer = answers[currentStep];
    const questionType = questions[currentStep].type;

    if (answer === 'yes') {
      setScores(s => ({ ...s, [questionType]: s[questionType as keyof typeof s] + 1 }));
    }
    
    if (currentStep < questions.length - 1) {
      setCurrentStep(s => s + 1);
    } else {
      setIsFinished(true);
    }
  };

  const resetQuiz = () => {
    setCurrentStep(0);
    setScores({ kreativ: 0, krank: 0, taktisch: 0 });
    setAnswers({});
    setIsFinished(false);
  }

  const progress = ((currentStep + 1) / questions.length) * 100;

  const getResult = () => {
      const finalScores = Object.entries(scores).sort((a, b) => b[1] - a[1]);
      if (finalScores[0][1] === 0) {
          return {
            title: "Der sportliche Übermensch",
            description: "Moment mal... du hast alles verneint? Du scheinst Sport tatsächlich zu mögen. Wir sind schockiert, aber auch ein bisschen beeindruckt. Du bist eine Anomalie.",
            icon: Trophy
          }
      }
      const winnerType = finalScores[0][0] as keyof typeof results;
      return results[winnerType];
  }

  return (
    <section className="w-full py-12 md:py-24 bg-muted/40">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h2 className="text-3xl font-bold font-headline tracking-tighter sm:text-5xl">
              Quiz: Welcher Sportmuffel bist du?
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed text-balance">
              Beantworte ein paar schnelle Fragen und entdecke deine wahre Berufung im Sportunterricht.
            </p>
        </div>
        <Card className="max-w-xl mx-auto mt-12 overflow-hidden shadow-lg">
            <AnimatePresence mode="wait">
                {!isFinished ? (
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <CardHeader>
                            <CardTitle className="text-sm">Frage {currentStep + 1} von {questions.length}</CardTitle>
                             <Progress value={progress} className="mt-2" />
                        </CardHeader>
                        <CardContent className="space-y-4 px-6 pb-6 text-left">
                            <p className="font-medium text-balance min-h-[3rem]">{questions[currentStep].question}</p>
                            <div className="flex justify-end">
                                <RadioGroup onValueChange={handleAnswer} value={answers[currentStep]} className="flex justify-end gap-8 py-2">
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="yes" id={`q${currentStep}-yes`} />
                                        <Label htmlFor={`q${currentStep}-yes`} className="text-sm">Ja</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="no" id={`q${currentStep}-no`} />
                                        <Label htmlFor={`q${currentStep}-no`} className="text-sm">Nein</Label>
                                    </div>
                                </RadioGroup>
                            </div>
                             <div className="text-right mt-4">
                                <Button onClick={handleNext} disabled={!answers[currentStep]} size="sm">
                                    {currentStep < questions.length - 1 ? "Nächste Frage" : "Auswerten"}
                                    <ArrowRight className="ml-2 h-4 w-4"/>
                                </Button>
                            </div>
                        </CardContent>
                    </motion.div>
                ) : (
                     <motion.div
                        key="result"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <CardHeader className="text-center">
                            <CardTitle>Dein Ergebnis</CardTitle>
                        </CardHeader>
                         <CardContent className="text-center space-y-4 px-6 pb-6">
                             <div className="flex flex-col items-center gap-4">
                                 {React.createElement(getResult().icon, { className: `w-16 h-16 ${getResult().color}` })}
                                 <div className='space-y-1'>
                                    <h3 className="text-2xl font-bold font-headline">{getResult().title}</h3>
                                    <p className="text-muted-foreground text-balance">{getResult().description}</p>
                                 </div>
                             </div>
                             <Button onClick={resetQuiz} size="sm" variant="outline" className="mt-6">
                                 <RefreshCw className="mr-2 h-4 w-4"/>
                                 Quiz neu starten
                             </Button>
                        </CardContent>
                    </motion.div>
                )}
            </AnimatePresence>
        </Card>
      </div>
    </section>
  );
}
