
'use client';

import React, { useState } from 'react';
import { Header } from '@/components/landing/header';
import { Footer } from '@/components/landing/footer';
import { Button } from '@/components/ui/button';
import { ImageWithLoader as Image } from '@/components/ui/image-with-loader';
import { ArrowRight, BookCheck, ChevronsRight, ShoppingCart, Star, Check, PenSquare, Users, Wand2, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { PromptingGuide } from '@/components/landing/prompting-guide';
import FallingText from '@/components/landing/FallingText';
import { Card, CardContent } from '@/components/ui/card';

// --- Data extracted from project context ---
const products = [
    {
        id: "hw1",
        title: "Hallo Welt",
        subtitle: "Erhebliche Kritik am unerhörten Bildungsgang der Lernvollzugsanstalt SK-S",
        price: 10.99,
        imageSrc: "https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/cover-hw1.png?alt=media&token=a3c3cb2d-c367-4634-b2b1-944e497f144e",
        amazonLink: "https://amzn.eu/d/0CdFeZ3",
    },
    {
        id: "hw2",
        title: "Hallo Welt 2",
        subtitle: "Wie das Leben funktioniert",
        price: 12.99,
        preorderPrice: 10.99,
        imageSrc: "https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/cover-hw2-temp.png?alt=media&token=3b0a318c-e8c1-4e66-be02-858a7b365a44",
        amazonLink: "#",
    }
];

// --- Custom Sub-components for this experimental page ---

const HandDrawn = ({ children, className, as: Component = 'span' }: { children: React.ReactNode, className?: string, as?: React.ElementType }) => {
    return (
        <Component className={cn("font-handwritten text-lg md:text-xl", className)}>
            {children}
        </Component>
    );
};

const TextMarker = ({ children, className }: { children: React.ReactNode, className?: string }) => {
    return (
        <span className="relative inline-block">
            <span className={cn("absolute inset-0 -skew-y-1 bg-yellow-300/70", className)}></span>
            <span className="relative">{children}</span>
        </span>
    )
}

function FinalTest() {
  const [answered, setAnswered] = useState(false);
  return (
    <section className="py-20 md:py-32">
      <div className="container mx-auto max-w-2xl text-center">
        <HandDrawn as="h2" className="text-4xl md:text-5xl font-bold font-headline text-blue-600">Der finale Test</HandDrawn>
        <p className="mt-4 text-neutral-600 md:text-xl text-balance">Noch unsicher? Eine letzte Frage entscheidet, ob Sie bereit für "Hallo Welt" sind.</p>
        <Card className="mt-8 text-left p-8 space-y-6">
          <p className="font-serif text-xl text-center">Im Chemieraum bricht ein Feuer aus. Womit löschen Sie?</p>
          {!answered ? (
            <div className="grid sm:grid-cols-2 gap-4">
              <Button variant="outline" size="lg" onClick={() => setAnswered(true)}>A) Mit dem Feuerlöscher.</Button>
              <Button variant="outline" size="lg" onClick={() => setAnswered(true)}>B) Mit dem geheimen Vorrat an Experimental-Alkohol.</Button>
            </div>
          ) : (
             <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="text-center p-6 bg-green-100/80 rounded-lg">
                <h3 className="font-bold font-headline text-xl text-green-800">Glückwunsch, richtige Antwort!</h3>
                <p className="text-green-700 mt-2">Egal was Sie gewählt haben, Ihre Denkweise ist definitiv "Hallo Welt"-kompatibel. Sie haben sich den Zugang zum nächsten Kapitel verdient.</p>
             </motion.div>
          )}
        </Card>
      </div>
    </section>
  )
}


// --- Main Page Component ---

export default function ExperimentalLandingPage2() {
    const hw1 = products.find(p => p.id === 'hw1');
    const hw2 = products.find(p => p.id === 'hw2');
    const [showTest, setShowTest] = useState(false);

    return (
        <div className="bg-[#fcfbf8] text-neutral-800 min-h-screen font-body" style={{backgroundColor: 'hsl(var(--color-leche))'}}>
            <Header />

            <main className="overflow-x-hidden">
                {/* --- Hero Section --- */}
                <section className="relative flex flex-col items-center justify-center text-center px-4 py-20 md:py-32">
                     <HandDrawn className="absolute top-16 left-8 md:left-24 text-red-500 transform -rotate-12">Absolut notwendig!</HandDrawn>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-5xl md:text-7xl font-bold font-headline tracking-tight text-balance"
                    >
                        Eine Generalabrechnung mit <br/> dem <TextMarker>Bildungssystem</TextMarker>.
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="max-w-2xl mx-auto text-neutral-600 md:text-xl text-balance mt-6"
                    >
                        Zwei junge Autoren sezieren mit spitzer Feder den Schulalltag – von drögem Unterricht bis zu maroden Klassenzimmern. Ein Muss für jeden, der es überlebt hat.
                    </motion.p>
                </section>

                {/* --- Book Showcase Section --- */}
                <section className="py-12 md:py-24 relative">
                    <div className="container mx-auto">
                        <div className="grid md:grid-cols-2 gap-12 lg:gap-24 items-center max-w-5xl mx-auto">
                            {/* Book 1 */}
                            <motion.div 
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, amount: 0.5 }}
                                transition={{ duration: 0.7, ease: "easeOut" }}
                                className="flex flex-col items-center text-center"
                            >
                                <div className="relative transform hover:scale-105 transition-transform duration-300 -rotate-3">
                                    <HandDrawn className="absolute -top-8 -right-4 text-blue-600 -rotate-6">Band 1</HandDrawn>
                                    {hw1 && <Image src={hw1.imageSrc} alt={`Cover: ${'\'\''}hw1.title{'\'\''}`} width={300} height={450} className="rounded-lg shadow-2xl" />}
                                </div>
                                <h3 className="text-2xl font-bold font-headline mt-6">{hw1?.title}</h3>
                                <p className="text-neutral-500 text-sm mt-1 mb-4 h-12">{hw1?.subtitle}</p>
                                <a href={hw1?.amazonLink} target="_blank" rel="noopener noreferrer">
                                    <Button size="lg" variant="outline" className="border-2 border-neutral-800 font-bold hover:bg-neutral-800 hover:text-white">
                                        <ShoppingCart className="mr-2 h-5 w-5"/> Kaufen
                                    </Button>
                                </a>
                            </motion.div>

                            {/* Book 2 */}
                             <motion.div 
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, amount: 0.5 }}
                                transition={{ duration: 0.7, ease: "easeOut" }}
                                className="flex flex-col items-center text-center"
                            >
                                <div className="relative transform hover:scale-105 transition-transform duration-300 rotate-3">
                                     <HandDrawn className="absolute -top-8 -left-4 text-green-600 rotate-6">Band 2 (bald!)</HandDrawn>
                                    {hw2 && <Image src={hw2.imageSrc} alt={`Cover: ${'\'\''}hw2.title{'\'\''}`} width={300} height={450} className="rounded-lg shadow-2xl" />}
                                </div>
                                <h3 className="text-2xl font-bold font-headline mt-6">{hw2?.title}</h3>
                                <p className="text-neutral-500 text-sm mt-1 mb-4 h-12">{hw2?.subtitle}</p>
                                <Button size="lg" variant="outline" className="border-2 border-neutral-800 font-bold" disabled>
                                    <ShoppingCart className="mr-2 h-5 w-5"/> Vorbestellen
                                </Button>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* --- New Section 1: Testimonials --- */}
                <section className="py-20 md:py-32 bg-blue-100/50 dark:bg-blue-900/10">
                    <div className="container mx-auto max-w-4xl text-center">
                         <HandDrawn as="h2" className="text-4xl md:text-5xl font-bold font-headline text-blue-600 transform -rotate-3">Stimmen einer Generation</HandDrawn>
                         <div className="grid md:grid-cols-3 gap-8 mt-12 text-left">
                            <motion.div initial={{opacity: 0, y: 20}} whileInView={{opacity: 1, y: 0}} transition={{delay: 0.1}}>
                                <p className="font-serif italic text-lg">"Ich habe das Buch im Zug gelesen und war so gefesselt, dass ich meinen Halt verpasste. Musste 30 km zurücklaufen. Hat sich gelohnt."</p>
                                <p className="mt-4 font-bold">- Ein zufriedener Pendler, <span className="text-neutral-500">Note: 1-</span></p>
                            </motion.div>
                             <motion.div initial={{opacity: 0, y: 20}} whileInView={{opacity: 1, y: 0}} transition={{delay: 0.2}}>
                                <p className="font-serif italic text-lg">"Endlich! Ich dachte, ich wäre der Einzige, der den Lehrer für einen schlecht programmierten Roboter hält."</p>
                                <p className="mt-4 font-bold">- Ein aufmerksamer Schüler, <span className="text-neutral-500">Note: 2+</span></p>
                            </motion.div>
                            <motion.div initial={{opacity: 0, y: 20}} whileInView={{opacity: 1, y: 0}} transition={{delay: 0.3}}>
                                <p className="font-serif italic text-lg">"Dieses Buch sollte verboten werden! Es untergräbt die Autorität des Lehrkörpers."</p>
                                <p className="mt-4 font-bold">- Ein besorgter Lehrer, <span className="text-neutral-500">Note: 5</span></p>
                            </motion.div>
                         </div>
                    </div>
                </section>

                 {/* --- New Section 2: What to Expect --- */}
                <section className="py-20 md:py-32">
                     <div className="container mx-auto max-w-4xl text-center">
                        <HandDrawn as="h2" className="text-4xl md:text-5xl font-bold font-headline text-green-600">Was dich erwartet (Spoiler-Alarm)</HandDrawn>
                        <ul className="mt-12 text-left space-y-4 max-w-lg mx-auto">
                            <li className="flex items-start text-lg"><Check className="h-6 w-6 mr-3 text-green-600 shrink-0 mt-1"/>Schonungslose Satire über den Schulalltag.</li>
                            <li className="flex items-start text-lg"><Check className="h-6 w-6 mr-3 text-green-600 shrink-0 mt-1"/>Eine Sammlung von Fragmenten – wie das Leben selbst.</li>
                            <li className="flex items-start text-lg"><Check className="h-6 w-6 mr-3 text-green-600 shrink-0 mt-1"/>Gesellschaftskritik, die sich als Humor tarnt.</li>
                            <li className="flex items-start text-lg"><Check className="h-6 w-6 mr-3 text-green-600 shrink-0 mt-1"/>Einblicke in die Psyche von genervten Lehrern und überforderten Schülern.</li>
                        </ul>
                    </div>
                </section>


                 {/* --- Manifesto Section --- */}
                <section className="py-20 md:py-32 bg-yellow-100/70 dark:bg-yellow-900/20">
                     <div className="container mx-auto max-w-3xl text-center relative">
                        <HandDrawn as="h2" className="text-3xl md:text-4xl font-bold font-headline text-red-600 absolute -top-12 left-0 -rotate-6">Das steht wirklich drin:</HandDrawn>
                        <motion.div
                             initial={{ opacity: 0 }}
                             whileInView={{ opacity: 1 }}
                             viewport={{ once: true, amount: 0.5 }}
                             transition={{ duration: 1 }}
                             className="space-y-4 text-2xl md:text-3xl leading-relaxed font-serif relative"
                        >
                             <p>
                                „Hallo Welt“ ist kein klassischer Roman – es ist ein <TextMarker>Kaleidoskop</TextMarker>. Die Seiten setzen sich aus Fragmenten, Episoden und Momentaufnahmen zusammen, die das <HandDrawn className="absolute top-1/2 left-1/2 text-blue-500 text-4xl -translate-x-1/2 -translate-y-1/2 rotate-12">Lebensgefühl</HandDrawn> einer ganzen Generation widerspiegeln.
                             </p>
                             <p className="mt-8">
                                Wer sich selbst an überfüllte Busfahrten, <span className="line-through">genervte</span> <HandDrawn className="text-red-500">motivierte</HandDrawn> Lehrer, absurde Bürokratie oder den ersten Geschmack von Freiheit erinnert, wird sich in diesem Buch wiederfinden.
                             </p>
                        </motion.div>
                     </div>
                </section>
                
                 {/* --- New Section 3: Meet the Culprits --- */}
                <section className="py-20 md:py-32">
                    <div className="container mx-auto max-w-4xl text-center">
                        <HandDrawn as="h2" className="text-4xl md:text-5xl font-bold font-headline text-red-500 transform rotate-2">Die Schuldigen</HandDrawn>
                         <div className="grid md:grid-cols-2 gap-12 mt-12 items-center">
                            <div className="flex flex-col items-center">
                                 <Image src="https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/paulik.png?alt=media&token=7d4dfeb1-5f87-4426-9890-868ed2a089bf" alt="Philipp Paulik" width={150} height={150} className="rounded-full shadow-lg transform -rotate-6"/>
                                 <h3 className="mt-4 font-bold font-headline text-2xl">Philipp Paulik</h3>
                                 <p className="text-neutral-600">Der mit dem fragwürdigen Haarschnitt. Sorgt für das Chaos.</p>
                            </div>
                             <div className="flex flex-col items-center">
                                 <Image src="https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/reisch.png?alt=media&token=5aa20eee-967e-4912-9bfe-3f0b6861a316" alt="Maximilian Reisch" width={150} height={150} className="rounded-full shadow-lg transform rotate-6"/>
                                 <h3 className="mt-4 font-bold font-headline text-2xl">Maximilian Reisch</h3>
                                 <p className="text-neutral-600">Der mit der Brille. Versucht, das Chaos in lesbare Sätze zu fassen.</p>
                            </div>
                         </div>
                    </div>
                </section>

                {/* --- New Section 4: Book Details --- */}
                <section className="py-20 md:py-32 bg-neutral-100/80 dark:bg-neutral-900/20">
                     <div className="container mx-auto max-w-2xl">
                        <div className="border-2 border-dashed border-neutral-400 p-8 relative">
                             <HandDrawn className="absolute -top-6 -left-6 text-xl bg-yellow-300 p-2 transform -rotate-12">BIBLIOTHEK</HandDrawn>
                             <HandDrawn className="absolute -bottom-5 -right-5 text-lg text-red-500 transform rotate-6">Nicht zerknittern!</HandDrawn>

                            <h2 className="font-serif text-3xl mb-8">Steckbrief: Hallo Welt 1</h2>
                            <div className="space-y-3 font-mono text-sm">
                                <p><span className="text-neutral-500">Titel:</span> Hallo Welt: Erhebliche Kritik...</p>
                                <p><span className="text-neutral-500">Autoren:</span> Paulik, P. & Reisch, M.</p>
                                <p><span className="text-neutral-500">ISBN-13:</span> 979-8879791693</p>
                                <p><span className="text-neutral-500">Seiten:</span> 106 (vollgepackt mit Unsinn)</p>
                                <p><span className="text-neutral-500">Genre:</span> Satire, Humor, Überlebensratgeber</p>
                                <p><span className="text-neutral-500">Bewertung:</span> 5/5 Sterne (von denen, die es verstanden haben)</p>
                            </div>
                        </div>
                    </div>
                </section>
                
                 {/* --- New Section 5: Why Both --- */}
                 <section className="py-20 md:py-32">
                    <div className="container mx-auto max-w-4xl text-center">
                         <HandDrawn as="h2" className="text-4xl md:text-5xl font-bold font-headline text-blue-500">Ein Buch ist gut. Zwei sind besser.</HandDrawn>
                         <p className="mt-4 text-neutral-600 md:text-xl text-balance max-w-2xl mx-auto">Nur ein Buch zu lesen ist, als würde man nur einen Schuh anziehen. Sieht komisch aus und man kommt nicht weit. Holen Sie sich das komplette Set für die volle Dosis Alltags-Wahnsinn.</p>
                         <div className="mt-8 flex justify-center gap-8">
                             <div className="flex flex-col items-center">
                                 <PenSquare className="h-10 w-10 text-blue-500"/>
                                 <p className="mt-2 font-semibold">Doppelte Satire</p>
                             </div>
                             <div className="flex flex-col items-center">
                                 <Users className="h-10 w-10 text-blue-500"/>
                                 <p className="mt-2 font-semibold">Doppelter Spaß</p>
                             </div>
                         </div>
                    </div>
                </section>

                 {/* --- CTA Section --- */}
                <section className="py-20 md:py-32 relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <BookCheck className="text-neutral-200 w-64 h-64 md:w-96 md:h-96" />
                    </div>
                     <div className="container mx-auto max-w-2xl text-center relative">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true, amount: 0.5 }}
                            transition={{ duration: 0.7 }}
                            className="bg-[#fcfbf8] p-8 md:p-12 rounded-lg space-y-6 shadow-xl border"
                        >
                            <h2 className="text-3xl md:text-4xl font-bold font-headline">Jetzt dem Wahnsinn beitreten.</h2>
                            <p className="text-neutral-600 max-w-md mx-auto">
                                Ein Buch, das man nicht von vorne nach hinten liest. Es ist wie ein Schulhofgespräch, das immer wieder abschweift – mal laut, mal leise, mal albern, mal bitter ernst.
                            </p>
                             <Link href="/buchhandlung-paulik-reisch">
                                <Button size="lg" className="bg-red-500 hover:bg-red-600 text-white font-bold h-14 text-lg px-10 shadow-lg transform hover:scale-105 transition-transform">
                                    Exemplar sichern <ChevronsRight className="ml-2 h-6 w-6"/>
                                </Button>
                            </Link>
                        </motion.div>
                     </div>
                </section>

                {/* --- "Not Convinced?" Title Section --- */}
                <section className="py-10 md:py-16 bg-yellow-100/70">
                    <div className="container mx-auto text-center">
                        <h2 className="font-headline text-3xl font-bold text-neutral-800">Noch nicht überzeugt?</h2>
                        <p className="text-neutral-600 mt-2">Vielleicht überzeugen Sie diese interaktiven Beweismittel.</p>
                    </div>
                </section>
                
                {/* --- New Section 6: Final Test --- */}
                <FinalTest />

                {/* --- New Section 8: Prompting Guide --- */}
                <PromptingGuide />

            </main>

            <Footer />
        </div>
    );
}
