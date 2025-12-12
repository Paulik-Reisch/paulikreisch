
'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/landing/header';
import { Footer } from '@/components/landing/footer';
import { Button } from '@/components/ui/button';
import { ImageWithLoader as Image } from '@/components/ui/image-with-loader';
import { ArrowRight, Code, ShoppingCart, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import Link from 'next/link';

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

const GlitchText = ({ text, className }: { text: string; className?: string }) => {
    return (
        <span className={cn("relative inline-block font-bold", className)}>
            <span className="absolute -left-0.5 -top-0.5 bg-green-300 bg-opacity-75 filter blur-sm w-full h-full animate-pulse"></span>
            <span className="relative">{text}</span>
        </span>
    )
}

const BookCard = ({ book, isFeatured }: { book: any, isFeatured?: boolean }) => {
    const isPreorder = book.preorderPrice !== undefined;
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className={cn("bg-neutral-800/50 border border-green-300/20 rounded-lg p-6 flex flex-col items-center text-center backdrop-blur-sm", isFeatured && "border-2 border-green-300 shadow-2xl shadow-green-500/10")}
        >
            {isFeatured && <div className="absolute -top-3 bg-green-400 text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Bestseller</div>}
            <motion.div
                whileHover={{ scale: 1.05 }}
                className="w-full max-w-[200px] aspect-[2/3] relative mb-6"
            >
                <Image
                    src={book.imageSrc}
                    alt={`Buchcover: ${book.title}`}
                    fill
                    className="object-contain drop-shadow-2xl"
                />
            </motion.div>
            <h3 className="text-xl font-bold font-headline">{book.title}</h3>
            <p className="text-xs text-neutral-400 min-h-[3em] mt-1">{book.subtitle}</p>

            <div className="flex-grow"></div>

            <div className="mt-6 w-full space-y-4">
                {isPreorder ? (
                     <>
                        <div className="flex items-baseline justify-center gap-2">
                             <span className="text-xl font-bold text-neutral-500 line-through">{book.price.toString().replace('.', ',')}€</span>
                             <span className="text-3xl font-bold text-green-400">{book.preorderPrice.toString().replace('.', ',')}€</span>
                        </div>
                        <Button disabled size="lg" className="w-full bg-neutral-700 text-neutral-400">
                           Bald verfügbar
                        </Button>
                     </>
                ) : (
                    <>
                         <div className="flex items-baseline justify-center gap-2 h-[40px]">
                            <span className="text-3xl font-bold text-green-400">{book.price.toString().replace('.', ',')}€</span>
                        </div>
                        <a href={book.amazonLink} target="_blank" rel="noopener noreferrer" className="w-full block">
                            <Button size="lg" className="w-full bg-green-400 text-black hover:bg-white font-bold">
                                <ShoppingCart className="mr-2 h-4 w-4"/> Kaufen
                            </Button>
                        </a>
                    </>
                )}
            </div>
        </motion.div>
    )
}

// --- Main Page Component ---

export default function ExperimentalLandingPage() {
    const hw1 = products.find(p => p.id === 'hw1');
    const hw2 = products.find(p => p.id === 'hw2');

    return (
        <div className="bg-black text-green-50 min-h-screen font-sans">
            <Header />

            <main>
                {/* --- Hero Section --- */}
                <section className="relative min-h-screen flex items-center justify-center text-center overflow-hidden px-4 py-20">
                     {/* Background Grid */}
                    <div className="absolute inset-0 z-0 bg-black bg-[radial-gradient(#1a1a1a_1px,transparent_1px)] [background-size:24px_24px]"></div>
                    {/* Glow */}
                    <div className="absolute inset-x-0 top-1/4 h-1/2 bg-green-500/20 rounded-full blur-[150px] z-0"></div>

                    <div className="relative z-10 space-y-6">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="text-5xl md:text-7xl font-bold font-headline tracking-tighter text-balance"
                        >
                            SYSTEMFEHLER. <GlitchText text="NEUSTART ERFORDERLICH." />
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="max-w-2xl mx-auto text-neutral-400 md:text-xl text-balance"
                        >
                            Zwei Bücher, die das Protokoll brechen. Eine satirische Analyse der Bugs, die wir "Alltag" nennen. Dies ist keine Übung.
                        </motion.p>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                        >
                            <Button size="lg" className="bg-green-400 text-black hover:bg-white font-bold h-12 text-base px-8">
                                Zur Analyse <ArrowRight className="ml-2 h-4 w-4"/>
                            </Button>
                        </motion.div>
                    </div>
                </section>

                {/* --- Book Showcase Section --- */}
                <section className="py-20 md:py-32 px-4 relative">
                    <div className="absolute inset-0 z-0 bg-black bg-[radial-gradient(#1a1a1a_1px,transparent_1px)] [background-size:24px_24px]"></div>
                    <div className="container mx-auto relative z-10">
                        <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
                            {hw1 && <BookCard book={hw1} isFeatured />}
                            {hw2 && <BookCard book={hw2} />}
                        </div>
                    </div>
                </section>

                 {/* --- Manifesto Section --- */}
                <section className="py-20 md:py-32 px-4">
                     <div className="container mx-auto max-w-4xl text-center">
                        <motion.div
                             initial={{ opacity: 0 }}
                             whileInView={{ opacity: 1 }}
                             viewport={{ once: true, amount: 0.5 }}
                             transition={{ duration: 1 }}
                             className="space-y-4"
                        >
                             <h2 className="text-3xl md:text-5xl font-bold font-headline">Das Manifest.</h2>
                             <p className="text-2xl md:text-3xl text-neutral-400 leading-relaxed font-light text-balance">
                                "Wir schreiben nicht, um zu gefallen. Wir schreiben, weil der Wahnsinn des Systems eine <GlitchText text="Dokumentation" /> braucht. Betrachten Sie diese Bücher als Fehlerbericht. Für die Gesellschaft."
                             </p>
                             <p className="text-sm text-green-400 font-mono tracking-widest pt-4">- Paulik & Reisch, System-Analysten</p>
                        </motion.div>
                     </div>
                </section>
                
                 {/* --- CTA Section --- */}
                <section className="py-20 md:py-32 px-4">
                     <div className="container mx-auto max-w-2xl text-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true, amount: 0.5 }}
                            transition={{ duration: 0.7 }}
                            className="border border-green-300/20 bg-neutral-900/50 p-8 rounded-lg space-y-6"
                        >
                             <Sparkles className="h-12 w-12 mx-auto text-green-400"/>
                            <h2 className="text-3xl md:text-4xl font-bold font-headline">Bereit für den Patch?</h2>
                            <p className="text-neutral-400">
                                Die "Hallo Welt"-Saga ist mehr als nur ein Buch. Es ist ein notwendiges Update für Ihr Betriebssystem. Installieren Sie es jetzt. Auf eigene Gefahr.
                            </p>
                            <Link href="/buchhandlung-paulik-reisch">
                                <Button size="lg" className="bg-green-400 text-black hover:bg-white font-bold h-12 text-base px-8">
                                    Update installieren (Kaufen)
                                </Button>
                            </Link>
                        </motion.div>
                     </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}

// Ensure Tailwind JIT compiler picks up dynamic classes
const forceTailwindToInclude = "border-green-300 shadow-2xl shadow-green-500/10";
