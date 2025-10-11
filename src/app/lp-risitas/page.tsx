
"use client";

import { useState } from 'react';
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { ShieldCheck, BookUser } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { getSeoMetadata } from "@/lib/firestore";
import type { Metadata, ResolvingMetadata } from 'next';

export async function generateMetadata(
  {},
  parent: ResolvingMetadata
): Promise<Metadata> {
  const seoData = await getSeoMetadata('lp-risitas');
 
  if (!seoData) {
    return {
        title: "Das Risitas-Hörverständnis | Paulik & Reisch",
        description: "Ein unterhaltsames und herausforderndes Hörverständnis-Erlebnis mit dem legendären El Risitas."
    }
  }
 
  const previousImages = (await parent).openGraph?.images || []

  return {
    title: seoData.title,
    description: seoData.metaDescription,
    keywords: seoData.keywords,
    openGraph: {
      title: seoData.ogTitle,
      description: seoData.ogDescription,
      images: seoData.ogImage ? [seoData.ogImage, ...previousImages] : previousImages,
      type: seoData.ogType as 'website' | 'article' | 'book' | 'profile' | undefined,
    },
    twitter: {
      card: seoData.twitterCard as "summary" | "summary_large_image" | "app" | "player" | undefined,
      title: seoData.twitterTitle,
      description: seoData.twitterDescription,
      images: seoData.twitterImage ? [seoData.twitterImage] : previousImages,
      site: seoData.twitterSite,
      creator: seoData.twitterCreator,
    },
    alternates: {
        canonical: seoData.canonicalUrl || '/lp-risitas',
    },
    robots: seoData.robots,
  }
}

export default function RisitasPage() {
  const videoId = "Dlcs89fVw2Y";
  const [consentGiven, setConsentGiven] = useState(false);
  const [checkboxChecked, setCheckboxChecked] = useState(false);

  return (
    <div className="flex flex-col min-h-[100dvh] bg-background text-foreground">
      <Header />
      <main className="flex-1 py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <Badge>Hörverständnis-Erlebnis</Badge>
              <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-6xl mt-4 text-balance">
                Risitas está riéndose
              </h1>
            </div>
            
            <div className="mt-4 text-center max-w-3xl mx-auto prose dark:prose-invert">
                <p className="lead">
                    So witzig wie unser Buch <Link href="/buchhandlung-paulik-reisch" className="text-link">Hallo Welt</Link> ist auch dieses legendäre Interview mit El Risitas. Ein unterhaltsames und herausforderndes Hörverständnis-Erlebnis!
                </p>
                <p>
                    Bereite Dich auf 7 Minuten reine Freude und sprachliche Finesse vor. Worauf wartest Du noch? Tauche ein und habe Spaß dabei! <Link href="/lp-risitas/biografie" className="text-link">Hier mehr über Risitas erfahren</Link>
                </p>
            </div>

            <div className="relative aspect-video w-full rounded-xl overflow-hidden shadow-2xl border mt-12">
              {!consentGiven ? (
                <div className="absolute inset-0 bg-muted/50 flex flex-col items-center justify-center p-8 text-center">
                    <ShieldCheck className="w-12 h-12 text-muted-foreground mb-4" />
                    <h3 className="font-semibold text-lg">Externer Inhalt von YouTube</h3>
                    <p className="text-sm text-muted-foreground mt-2 max-w-md">
                        Dieses Video wird von YouTube gehostet. Durch das Laden des Videos stimmen Sie den Nutzungsbedingungen von Google zu und erlauben die Verarbeitung Ihrer Daten, inklusive der Setzung von Cookies.
                    </p>
                    <div className="flex items-center space-x-2 my-6">
                        <Checkbox id="consent-checkbox" checked={checkboxChecked} onCheckedChange={(checked) => setCheckboxChecked(checked as boolean)} />
                        <Label htmlFor="consent-checkbox" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Ich habe die Hinweise gelesen und stimme zu.
                        </Label>
                    </div>
                    <Button onClick={() => setConsentGiven(true)} disabled={!checkboxChecked} className="mt-2">
                        Video anzeigen und zustimmen
                    </Button>
                    <div className="text-center mt-6">
                        <Link href="/lp-risitas/legales" className="text-xs text-muted-foreground hover:underline">
                            Rechtsbelehrung – Externe Medien
                        </Link>
                        <p className="text-xs text-muted-foreground mt-1">© RAVE_ZERO — YouTube</p>
                    </div>
                </div>
              ) : (
                <iframe
                    src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute top-0 left-0 w-full h-full"
                ></iframe>
              )}
            </div>
            
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
