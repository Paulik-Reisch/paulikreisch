import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function AboutWorthaftPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 py-12 md:py-24">
        <div className="container max-w-3xl mx-auto px-4">
          <article className="prose dark:prose-invert">
            <Badge>Hintergrund</Badge>
            <h1 className="font-headline mt-4">Über Worthaft</h1>
            <p className="lead">
              Eine Hommage an ein virales Phänomen, neu interpretiert mit dem
              zynischen Charme von Paulik & Reisch.
            </p>
            <h2>Was ist das hier?</h2>
            <p>
              "Worthaft" ist unsere liebevolle, aber unlizenzierte Adaption des
              weltberühmten Worträtselspiels "Wordle". Wir haben die Essenz des
              Spiels genommen – das Raten eines Fünf-Buchstaben-Wortes in sechs
              Versuchen – und es in unser eigenes satirisches Universum
              verpflanzt. Warum? Weil wir es können. Und weil wir dachten, das
              Internet braucht noch eine weitere Wordle-Kopie.
            </p>
            <h2>Die Regeln (als ob Sie sie nicht kennen würden)</h2>
            <p>
              Sie haben sechs Versuche, das geheime deutsche Wort mit fünf
              Buchstaben zu erraten. Nach jedem Versuch geben Ihnen die Farben
              einen Hinweis:
            </p>
            <ul>
              <li>
                <span className="p-2 rounded-md font-bold text-primary-foreground" style={{ backgroundColor: 'hsl(var(--primary))' }}>
                  Blau
                </span>
                : Der Buchstabe ist korrekt und an der richtigen Stelle. Ein
                seltener Moment der Klarheit in diesem Chaos.
              </li>
              <li>
                <span className="p-2 rounded-md font-bold text-secondary-foreground" style={{ backgroundColor: 'hsl(var(--secondary))' }}>
                  Gelb
                </span>
                : Der Buchstabe ist im Wort enthalten, aber an der falschen
                Stelle. Wie eine gute Pointe, die noch nicht ganz sitzt.
              </li>
              <li>
                <span className="p-2 rounded-md font-bold" style={{ backgroundColor: 'hsl(var(--muted))' }}>
                  Grau
                </span>
                : Der Buchstabe kommt im Wort nicht vor. Ein weiterer falscher
                Weg, genau wie das deutsche Bildungssystem.
              </li>
            </ul>
            <div className="not-prose text-center mt-12">
                <Link href="/worthaft">
                    <Button size="lg">Genug gelesen, ich will spielen!</Button>
                </Link>
            </div>
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
}