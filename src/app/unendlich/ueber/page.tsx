
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Box, Boxes, Bot } from 'lucide-react';

export default function AboutUnendlichPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 py-12 md:py-24">
        <div className="container max-w-3xl mx-auto px-4">
          <article className="prose dark:prose-invert">
            <Badge>Spielanleitung</Badge>
            <h1 className="font-headline mt-4">Über Unendlich</h1>
            <p className="lead">
              Eine satirische Simulation des kreativen Prozesses, getarnt als süchtig machendes Kachelspiel.
            </p>
            <h2>Die Regeln des Wahnsinns</h2>
            <p>
              Willkommen bei "Unendlich", dem einzigen Spiel, das den Weg von einer flüchtigen Idee zu einem literarischen Meisterwerk (oder zumindest zu einem Buch) simuliert. Die Regeln sind einfach, der Weg ist steinig:
            </p>
            <ul>
              <li>
                <span className="flex items-center gap-2"><Box className="h-5 w-5 text-primary"/><strong>Verschieben:</strong> Benutzen Sie die Pfeiltasten, um die Kacheln zu bewegen. Alle Kacheln rutschen so weit wie möglich in die gewählte Richtung.</span>
              </li>
              <li>
                <span className="flex items-center gap-2"><Boxes className="h-5 w-5 text-secondary"/><strong>Kombinieren:</strong> Wenn zwei Kacheln mit demselben Inhalt aufeinandertreffen, verschmelzen sie zu einer neuen, glorreicheren Kachel. (z.B. zwei "Ideen" werden zu einem "Satz").</span>
              </li>
               <li>
                <span className="flex items-center gap-2"><Bot className="h-5 w-5 text-destructive"/><strong>Überleben:</strong> Nach jedem Zug erscheint eine neue Kachel. Ihr Ziel ist es, Platz zu schaffen und weiter zu kombinieren, bis das Spielfeld voll ist oder Sie die legendäre "Hallo Welt"-Kachel erschaffen haben.</span>
              </li>
            </ul>
             <h2>Täglicher Versuch</h2>
            <p>
                Wie im echten Leben haben Sie nur einen Versuch pro Tag, den Gipfel des literarischen Schaffens zu erklimmen. Scheitern Sie, müssen Sie bis morgen warten, um Ihre Genialität erneut unter Beweis zu stellen. Kein Druck.
            </p>
            <div className="not-prose text-center mt-12">
                <Link href="/unendlich">
                    <Button size="lg">Genug geredet, ich bin ein Genie!</Button>
                </Link>
            </div>
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
}
