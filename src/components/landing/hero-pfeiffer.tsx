import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "../ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";


const schimpfwoerter = [
    { de: "Dummkopf", es: "Gilipollas" },
    { de: "Arschloch", es: "Capullo / Cabrón" },
    { de: "Idiot", es: "Idiota" },
    { de: "Hurensohn", es: "Hijo de puta" },
    { de: "Scheiße", es: "Mierda" },
    { de: "Verdammt", es: "Joder" },
    { de: "Blödmann", es: "Tonto del culo" },
    { de: "Wichser", es: "Pajero" },
    { de: "Miststück", es: "Zorra" },
    { de: "Leck mich am Arsch", es: "Vete a la mierda" },
    { de: "Vollidiot", es:"Subnormal" },
    { de: "Penner", es: "Pringado" },
    { de: "Verpiss dich", es: "Lárgate" },
    { de: "Halt die Klappe", es: "Cállate la boca" },
    { de: "Deine Mutter", es: "Tu puta madre" },
];


export function HeroPfeiffer() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <article className="prose prose-lg dark:prose-invert mx-auto">
          <header className="text-center mb-12">
            <Badge variant="secondary">Exklusiv-Enthüllung</Badge>
            <h1 className="font-headline text-4xl sm:text-6xl font-bold tracking-tighter mt-4 text-balance">
              Das Mysterium der "La Silbadora Pfeiffer"
            </h1>
            <p className="text-xl text-muted-foreground mt-4 text-balance">
              Eine redaktionelle Analyse eines Phänomens, das die Grundfesten
              unserer Gesellschaft erschüttert.
            </p>
          </header>

          <div className="relative aspect-video mb-12 rounded-lg overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-500 -rotate-1">
            <Image
              src="https://placehold.co/800x450.png"
              alt="Eine mysteriöse pfeifende Frau im Schatten"
              data-ai-hint="mysterious woman whistling shadow"
              layout="fill"
              objectFit="cover"
            />
          </div>

          <p>
            In den verrauchten Amtsstuben und schlecht beleuchteten
            Universitätskorridoren flüstert man ihren Namen nur:{" "}
            <span className="font-semibold italic">La Silbadora Pfeiffer</span>.
            Ein Phantom. Eine Frau, deren pfeifende Melodien die
            Gesetze der Physik außer Kraft setzen. Doch was steckt wirklich hinter diesem Mythos?
            Unsere Recherche führt uns zurück in die heiligen Hallen der Lernvollzugsanstalt Siebenkirchen-Seelscheid.
          </p>
          <p>
            Die Legende hat einen Namen: Rabea Pfeifer. Im Buch "Hallo Welt" als <strong className="font-headline">R. Pfffer</strong> verewigt, war sie die Spanischlehrerin, die den jungen Autoren den Weg wies. Nicht den Weg zur Grammatik – nein, den Weg zu den wirklich wichtigen Dingen im Leben. Frau Pfeifer, eine Frau, deren Begeisterung für die spanische Sprache nur von ihrer Abneigung gegen Mathematik und funktionierende Technik übertroffen wurde, war eine Institution.
          </p>
          
           <blockquote>
            "Sie sprang mit ollem Enthusiasmus vor die Tafel", erinnert sich einer der Autoren, "und lehrte uns die ersten wirklich nützlichen Wörter. Nicht 'hola', nicht 'gracias'. Sie lehrte uns das, was man braucht, wenn der Bus zu spät kommt oder das Mensaessen wieder nach atomarer Kernschmelze schmeckt."
          </blockquote>

          <p>
            Es war nach der 8. Klasse, als unsere Helden unter die Fittiche von La Silbadora kamen. Sie lernten, dass Sprache mehr ist als nur Kommunikation. Sie ist eine Waffe. Ein Werkzeug. Eine Kunstform. Insbesondere die Kunstform der gepflegten Beleidigung. Frau Pfeifer vermittelte ihnen die wertvollsten Lektionen ihres Lebens in Form von handverlesenen *palabrotas* – Schimpfwörtern.
          </p>

            <div className="my-12 not-prose">
                <h3 className="font-headline text-2xl font-bold text-center mb-4">Grundwortschatz Spanisch nach R. Pfffer</h3>
                 <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead className="font-semibold">Deutsches Schimpfwort</TableHead>
                        <TableHead className="font-semibold">Spanische Übersetzung (für den Notfall)</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {schimpfwoerter.map((wort) => (
                        <TableRow key={wort.de}>
                            <TableCell>{wort.de}</TableCell>
                            <TableCell className="italic">{wort.es}</TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <p className="text-xs text-center text-muted-foreground mt-2">*Haftungsausschluss: Die Verwendung dieser Vokabeln erfolgt auf eigene Gefahr. Kann zu blauen Augen oder diplomatischen Krisen führen.</p>
            </div>

          <p>
            Dieses Fundament an sprachlicher Gewandtheit ist es, was die Werke von Paulik & Reisch auszeichnet. Und genau darum geht es in <strong className="font-headline">"Hallo Welt 2: Wie's Leben funktioniert"</strong>. Das Buch ist eine schonungslose Sezierung des alltäglichen Wahnsinns, eine Hommage an die Mentoren, die uns nicht lehrten, wie man sich anpasst, sondern wie man zurückpöbelt.
          </p>
          <p>
            "La Silbadora Pfeiffer" ist also keine Legende. Sie ist die unheilvolle, aber doch irgendwie liebenswerte Hintergrundmusik zu unser aller Existenz.
          </p>

          <div className="text-center mt-12 py-12 border-t border-b border-dashed">
            <h2 className="font-headline text-3xl font-bold">Erleben Sie das Pfeifkonzert selbst!</h2>
            <p className="mt-4 text-muted-foreground">
                "Hallo Welt 2" ist die Anleitung zum Überleben in einer Welt, die den Verstand verloren hat. Oder der schnellste Weg, ihn selbst zu verlieren.
            </p>
            <Link href="/buchhandlung-paulik-reisch" className="mt-6 inline-block">
                <Button size="lg" className="animate-pulse">Jetzt dem Wahnsinn stellen</Button>
            </Link>
          </div>
        </article>
      </div>
    </section>
  );
}
