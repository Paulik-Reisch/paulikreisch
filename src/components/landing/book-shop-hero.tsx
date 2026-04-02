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
        text: 'Ich habe das Buch im Zug gelesen und war so gefesselt, dass ich meinen Halt verpasste. Musste 30 km zurücklaufen. Aber es hat sich gelohnt!',
        author: 'zufriedener Pendler',
        color: 'bg-yellow-100 dark:bg-yellow-900/30'
    },
    {
        type: 'quote',
        text: 'Seit ich das Buch verschlungen habe, sehe ich überall nur noch Bürokratie-Wahnsinn. Sogar mein Toaster will jetzt einen Antrag in dreifacher Ausführung!',
        author: 'paranoider Leser',
        color: 'bg-green-100 dark:bg-green-900/30'
    },
     {
        type: 'quote',
        text: 'Endlich ein Buch, das so denkt wie ich! Jetzt fühle ich mich weniger alleine.',
        author: 'Seelenverwandter',
        color: 'bg-indigo-100 dark:bg-indigo-900/30'
    },
]

export function BookShopHero() {
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  )

  return (
    <section className="w-full py-12 md:py-16 bg-muted/40 overflow-hidden" aria-label="Kundenstimmen">
       <div className="container px-4 md:px-6">
            <Carousel
                plugins={[plugin.current]}
                className="w-full max-w-4xl mx-auto"
                onMouseEnter={plugin.current.stop}
                onMouseLeave={plugin.current.reset}
            >
                <CarouselContent>
                    {heroItems.map((item, index) => (
                    <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 xl:basis-1/3">
                        <div className="p-2 h-full">
                        <Card className={`h-full flex flex-col justify-center items-center text-center p-6 ${item.color} transition-transform duration-300 hover:-translate-y-2`}>
                            {item.type === 'quote' ? (
                               <figure>
                                    <blockquote className="text-base font-semibold text-balance">
                                        <p>»{item.text}«</p>
                                    </blockquote>
                                    <figcaption className="mt-4 text-sm text-muted-foreground"><cite>- {item.author}</cite></figcaption>
                                </figure>
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
        </div>
    </section>

  )
}
