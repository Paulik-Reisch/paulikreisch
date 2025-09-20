import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "../ui/badge";

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
            Eine Legende. Ein Phantom. Eine Frau, deren pfeifende Melodien die
            Gesetze der Physik und der deutschen Gründlichkeit gleichermaßen
            außer Kraft setzen. Doch was steckt wirklich hinter diesem Mythos?
          </p>
          <p>
            Unsere monatelange Recherche führte uns nicht etwa in die Archive
            geheimer Gesellschaften, sondern in die Abgründe des menschlichen
            Alltags – ein Territorium, das die Autoren Paulik & Reisch für ihr
            neuestes Werk,{" "}
            <strong className="font-headline">"Hallo Welt 2: Wie das Leben funktioniert"</strong>,
            kartografiert haben.
          </p>

          <blockquote>
            "La Silbadora Pfeiffer ist keine Person", gestand uns einer der
            Autoren unter Zusicherung vollständiger Anonymität (es war Max),
            "sie ist ein Zustand. Sie ist das Pfeifen im Walde der Bürokratie,
            die schrille Melodie einer fehlgeschlagenen Online-Überweisung, der
            unheilvolle Pfiff, kurz bevor die Kaffeemaschine im Büro explodiert."
          </blockquote>

          <p>
            Es stellt sich heraus: Das Phänomen "Pfeiffer" ist die literarische
            Personifikation all dessen, was in unserer modernen Welt schiefläuft.
            Und genau darum geht es in "Hallo Welt 2". Das Buch ist eine
            schonungslose Sezierung des alltäglichen Wahnsinns. Von der digitalen
            Steinzeit des deutschen Internets über den grotesken Mietenwahnsinn
            bis hin zur absurden Komplexität eines einfachen Antragsformulars.
          </p>
          <p>
            Das Buch pfeift auf Konventionen. Es ist eine Symphonie des
            Scheiterns, eine Ode an die kleinen und großen Katastrophen, die das
            Leben so unerträglich lebenswert machen. "La Silbadora Pfeiffer" ist
            also nicht die Antagonistin. Sie ist die unheilvolle, aber doch
            irgendwie liebenswerte Hintergrundmusik zu unser aller Existenz.
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
