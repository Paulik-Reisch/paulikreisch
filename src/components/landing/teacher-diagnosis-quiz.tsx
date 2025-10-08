
"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Bot, User, Check, ArrowRight, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const questions = [
  {
    question: "Reagiert Ihr Lehrer auf technische Probleme mit einem leeren Blick und dem Satz 'Starten Sie das Gerät neu' (auch wenn es sich um ein Buch handelt)?",
    points: 20,
  },
  {
    question: "Besteht der Wortschatz Ihres Lehrers zu >50% aus den Worten 'klausurrelevant', 'grundsätzlich' und 'Ruhe'?",
    points: 20,
  },
  {
    question: "Zeigt Ihr Lehrer eine emotionale Reaktion, die über das leichte Anheben einer Augenbraue hinausgeht?",
    points: -15, // Negative points for human-like behavior
  },
  {
    question: "Wird Kaffee als 'Betriebsflüssigkeit' bezeichnet?",
    points: 15,
  },
  {
    question: "Kann Ihr Lehrer über einen Witz lachen, der nicht im Lehrerhandbuch steht?",
    points: -20,
  },
  {
    question: "Scheint die Korrekturgeschwindigkeit von Klausuren unmenschlich schnell zu sein (weniger als 3 Wochen pro Stapel)?",
    points: 25,
  },
  {
    question: "Haben Sie den Verdacht, dass Ihr Lehrer nachts in einem Schrank aufgeladen wird?",
    points: 15,
  },
];

export function TeacherDiagnosisQuiz() {
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [answers, setAnswers] = useState<{[key: number]: string}>({});

  const handleAnswer = (value: string) => {
    setAnswers(prev => ({...prev, [currentStep]: value}));
  };

  const handleNext = () => {
    const answer = answers[currentStep];
    if (answer === 'yes') {
      setScore(s => s + questions[currentStep].points);
    } else if (answer === 'no') {
      // For negative points questions, "no" is a robot trait
      if (questions[currentStep].points < 0) {
        setScore(s => s - questions[currentStep].points);
      }
    }
    
    if (currentStep < questions.length - 1) {
      setCurrentStep(s => s + 1);
    } else {
      setIsFinished(true);
    }
  };

  const resetQuiz = () => {
    setCurrentStep(0);
    setScore(0);
    setAnswers({});
    setIsFinished(false);
  }

  const progress = (currentStep / questions.length) * 100;
  
  const getResult = () => {
    const percentage = Math.max(0, Math.min(100, Math.round((score / 100) * 100)));
    if (percentage > 75) return { text: "Ihr Lehrer ist definitiv ein Roboter. Handbuch empfohlen.", icon: Bot, color: "text-destructive" };
    if (percentage > 50) return { text: "Hohe Wahrscheinlichkeit für einen Cyborg. Vorsicht ist geboten.", icon: Bot, color: "text-yellow-500" };
    if (percentage > 25) return { text: "Menschliche Züge sind erkennbar, aber der Kern ist Software.", icon: User, color: "text-primary" };
    return { text: "Herzlichen Glückwunsch! Sie scheinen einen echten Menschen vor sich zu haben. Ein seltenes Exemplar.", icon: User, color: "text-green-500" };
  }

  return (
    <section className="w-full py-8 md:py-12 bg-muted">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h2 className="text-3xl font-bold font-headline tracking-tighter sm:text-5xl">
              Diagnose-Tool: Mensch oder Maschine?
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed text-balance">
              Finden Sie mit unserem wissenschaftlich fundierten Test heraus, ob Sie von einem Menschen oder einem Algorithmus unterrichtet werden.
            </p>
        </div>
        <Card className="max-w-2xl mx-auto mt-12 overflow-hidden">
            <AnimatePresence mode="wait">
                {!isFinished ? (
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.3 }}
                    >
                        <CardHeader>
                            <CardTitle>Frage {currentStep + 1} von {questions.length}</CardTitle>
                             <Progress value={progress} className="mt-2" />
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <p className="text-lg font-medium text-balance min-h-[5rem]">{questions[currentStep].question}</p>
                            <RadioGroup onValueChange={handleAnswer} value={answers[currentStep]} className="flex justify-center gap-8">
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="yes" id={`q${currentStep}-yes`} />
                                    <Label htmlFor={`q${currentStep}-yes`} className="text-lg">Ja</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="no" id={`q${currentStep}-no`} />
                                    <Label htmlFor={`q${currentStep}-no`} className="text-lg">Nein</Label>
                                </div>
                            </RadioGroup>
                             <div className="text-center mt-6">
                                <Button onClick={handleNext} disabled={!answers[currentStep]}>
                                    {currentStep < questions.length - 1 ? "Nächste Frage" : "Auswerten"}
                                    <ArrowRight className="ml-2 h-4 w-4"/>
                                </Button>
                            </div>
                        </CardContent>
                    </motion.div>
                ) : (
                     <motion.div
                        key="result"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <CardHeader>
                            <CardTitle>Diagnose abgeschlossen</CardTitle>
                            <CardDescription>Basierend auf Ihren Antworten lautet das Ergebnis:</CardDescription>
                        </CardHeader>
                         <CardContent className="text-center space-y-6">
                             <div className="flex justify-center items-center">
                                 {React.createElement(getResult().icon, { className: `w-24 h-24 ${getResult().color}` })}
                             </div>
                             <p className={`text-2xl font-bold ${getResult().color}`}>Ihr Lehrer ist zu {Math.max(0, Math.min(100, Math.round((score / 100) * 100)))}% ein Roboter.</p>
                             <p className="text-lg text-muted-foreground">{getResult().text}</p>
                             <Button onClick={resetQuiz}>
                                 <RefreshCw className="mr-2 h-4 w-4"/>
                                 Neue Diagnose starten
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
