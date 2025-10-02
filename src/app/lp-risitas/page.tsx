
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function RisitasPage() {
  const videoId = "Dlcs89fVw2Y";

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
                    Möchtest Du ein unterhaltsames und herausforderndes Hörverständnis-Erlebnis mit Audio- und Videomaterialien erleben? Dann bist Du hier genau richtig!
                </p>
                <p>
                    Bereite Dich auf 7 Minuten reine Freude und sprachliche Finesse in perfekter Kombination vor. Lass Dich von unserem Material mitreißen und verbessere gleichzeitig Deine Sprachkenntnisse auf spielerische Weise. Worauf wartest Du noch? Tauche ein in die Welt des Hörverstehens und habe Spaß dabei!
                </p>
            </div>
            <div className="text-center my-8">
                <Link href="/lp-risitas/legales" className="text-xs text-muted-foreground hover:underline">
                    Rechtsbelehrung – Externe Medien
                </Link>
                <p className="text-xs text-muted-foreground mt-1">© RAVE_ZERO — YouTube</p>
            </div>

            <div className="relative aspect-video w-full rounded-xl overflow-hidden shadow-2xl border">
              <iframe
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute top-0 left-0 w-full h-full"
              ></iframe>
            </div>
            
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
