
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { Button } from "@/components/ui/button";
import { ShieldAlert, BookHeart, Info } from "lucide-react";
import Link from "next/link";

export default function MehrErfahrenPage() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-background text-foreground">
      <Header />
      <main className="flex-1 py-12 md:py-24">
        <div className="container px-4 md:px-6">
            <article className="prose prose-lg dark:prose-invert mx-auto">
                <div className="text-center mb-12">
                    <ShieldAlert className="w-16 h-16 mx-auto text-destructive mb-4"/>
                    <h1>Informationen zu sensiblen Inhalten</h1>
                    <p className="lead">Ein offenes Wort zur satirischen Natur unserer Inhalte.</p>
                </div>

                <h2><BookHeart className="inline-block mr-2 h-6 w-6"/>Unsere Philosophie</h2>
                <p>
                    Die "Hallo Welt"-Bücherserie und die dazugehörigen Web-Inhalte sind Satire. Unser Ziel ist es, die Absurditäten des Alltags – von der Schule über die Bürokratie bis hin zu sozialen Normen – auf humorvolle und oft überzogene Weise zu kommentieren. Wir verwenden Ironie, Sarkasmus und manchmal auch grobe Sprache, um zum Nachdenken anzuregen und zu unterhalten.
                </p>
                <p>
                    Wir glauben fest daran, dass Humor ein wichtiges Ventil ist, um mit den Frustrationen des Lebens umzugehen. Nichts, was wir schreiben oder darstellen, ist als direkter Angriff auf Einzelpersonen oder Gruppen gedacht. Es ist eine Kritik an Systemen, Strukturen und Verhaltensweisen, verpackt in eine unterhaltsame Form.
                </p>

                <h2 id="minderjaehrig"><Info className="inline-block mr-2 h-6 w-6"/>Ein Hinweis für unsere jüngeren Leser</h2>
                <p>
                    Einige unserer Inhalte, insbesondere das "Palabrotas-Lexikon", enthalten eine Sprache, die üblicherweise nicht für jüngere Ohren und Augen bestimmt ist. Wir haben eine Altersabfrage implementiert, weil wir uns unserer Verantwortung bewusst sind.
                </p>
                <ul>
                    <li><strong>Kontext ist alles:</strong> Die verwendeten Schimpfwörter sind Teil eines satirischen Konzepts. Sie dienen der humoristischen Darstellung einer chaotischen Spanischlehrerin und sind nicht zur Nachahmung im Alltag gedacht (außer in absolut passenden Situationen, die Sie selbst erkennen müssen).</li>
                    <li><strong>Jugendschutz:</strong> Wir möchten sicherstellen, dass unsere Inhalte in einem angemessenen Rahmen konsumiert werden. Die Weiterleitung auf diese Seite dient dazu, auf den Charakter der Inhalte hinzuweisen.</li>
                    <li><strong>Elterliche Verantwortung:</strong> Wir ermutigen Eltern, mit ihren Kindern über Medienkonsum und die Natur von Satire zu sprechen.</li>
                </ul>
                <p>
                   Wir sind überzeugt, dass auch junge Menschen in der Lage sind, Satire zu verstehen. Unsere Absicht ist es nicht, zu schockieren, sondern auf humorvolle Weise zum kritischen Denken anzuregen.
                </p>
                 <div className="text-center mt-12 not-prose">
                    <Link href="/lp-palabrotas">
                        <Button variant="secondary" size="lg">Ich habe verstanden und möchte zurück</Button>
                    </Link>
                </div>
            </article>
        </div>
      </main>
      <Footer />
    </div>
  );
}
