"use client"

import * as React from "react"
import Autoplay from "embla-carousel-autoplay"

import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import { Badge } from "../ui/badge"
import { ArrowRight, Book, Sparkles } from "lucide-react"
import Link from "next/link"

const heroItems = [
    {
        type: 'quote',
        text: 'Ich habe gelacht, ich habe geweint, ich habe meine Lebensentscheidungen in Frage gestellt.',
        author: 'Ein verwirrter Leser',
        color: 'bg-pink-100 dark:bg-pink-900/30'
    },
    {
        type: 'lp_promo',
        title: 'Welche Katastrophenfigur bist du?',
        description: 'Mach den satirischen Persönlichkeitstest und finde es heraus.',
        link: '/lp-satire-typ-test',
        icon: Sparkles,
        color: 'bg-blue-100 dark:bg-blue-900/30'
    },
    {
        type: 'quote',
        text: 'Dieses Buch ist eine Gefahr. Ich habe meinen Kaffee verschüttet, weil ich zu sehr gelacht habe.',
        author: 'Opfer der Komödie',
        color: 'bg-yellow-100 dark:bg-yellow-900/30'
    },
    {
        type: 'lp_promo',
        title: 'Der Bürokratie-Generator',
        description: 'Erhalte auf Knopfdruck ein absurd langes und sinnloses Behörden-Antwortschreiben.',
        link: '/lp-buerokratie-generator',
        icon: Book,
        color: 'bg-green-100 dark:bg-green-900/30'
    },
     {
        type: 'quote',
        text: 'Endlich ein Buch, das so denkt wie ich! Jetzt fühle ich mich weniger allein.',
        author: 'Ein Seelenverwandter',
        color: 'bg-indigo-100 dark:bg-indigo-900/30'
    },
]

export function BookShopHero() {
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  )

  return (
    <section className="w-full py-12 md:py-16 lg:py-20 bg-muted/40 overflow-hidden">
        <Carousel
        plugins={[plugin.current]}
        className="w-full max-w-none"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
        >
        <CarouselContent>
            {heroItems.map((item, index) => (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                <div className="p-2 h-full">
                <Card className={`h-64 flex flex-col justify-between p-6 ${item.color} transition-transform duration-300 hover:-translate-y-2`}>
                    {item.type === 'quote' ? (
                         <CardContent className="p-0 flex flex-col justify-center items-center text-center h-full">
                            <p className="text-xl font-semibold italic text-balance">"{item.text}"</p>
                            <p className="mt-4 text-sm text-muted-foreground">- {item.author}</p>
                        </CardContent>
                    ) : (
                         <CardContent className="p-0 flex flex-col justify-center items-center text-center h-full">
                            {item.icon && <item.icon className="w-10 h-10 mb-4 text-primary"/>}
                            <h3 className="text-xl font-bold font-headline text-balance">{item.title}</h3>
                            <p className="text-sm text-muted-foreground mt-2 text-balance">{item.description}</p>
                            <Link href={item.link || '#'} className="mt-4">
                                <Badge variant="secondary" className="hover:scale-105 transition-transform">
                                    Ausprobieren <ArrowRight className="ml-2 h-3 w-3"/>
                                </Badge>
                            </Link>
                        </CardContent>
                    )}
                   
                </Card>
                </div>
            </CarouselItem>
            ))}
        </CarouselContent>
        </Carousel>
    </section>

  )
}
