import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export function AuthorInfo() {
  return (
    <section className="w-full py-12 md:py-24">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
            <Badge>Die Autoren</Badge>
            <h2 className="text-3xl font-bold font-headline tracking-tight mt-4">
                Informationen zum Autor
            </h2>
             <p className="text-muted-foreground mt-2">Folge den Autoren, um Neuigkeiten zu Veröffentlichungen und verbesserte Empfehlungen zu erhalten.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-16 items-start">
          <div className="flex flex-col items-center text-center">
            <Image
              alt="Philipp Paulik"
              className="mx-auto mb-4 rounded-full"
              data-ai-hint="young author portrait"
              height="140"
              src="https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/paulik.png?alt=media&token=7d4dfeb1-5f87-4426-9890-868ed2a089bf"
              style={{
                aspectRatio: "140/140",
                objectFit: "cover",
              }}
              width="140"
            />
            <h3 className="text-2xl font-bold font-headline">Philipp Paulik</h3>
            <div className="mt-4 space-y-3 text-muted-foreground text-left text-sm">
                <p>
                    Philipp Paulik ist ein junger Autor aus Nordrhein-Westfalen, der komplexe technische Themen mit bemerkenswerter Klarheit und Praxisbezug vermittelt. Nach seinem Abitur 2024 sammelte er wertvolle pädagogische Erfahrungen als Betreuer im Freiwilligendienst an einer Grundschule, wo er seine Leidenschaft für die verständliche Betreuung von Kindern und Wissensvermittlung entdeckte.
                </p>
                <p>
                    Als autodidaktischer Experte in den Bereichen Medien, Entwicklung und Künstliche Intelligenz verbindet Paulik seine pädagogischen Fähigkeiten mit seinem ausgeprägten technischen Verständnis. Neben seiner Tätigkeit als Autor arbeitet er als Designer und Mediengestalter und wird ab August 2025 seine kreativen und technischen Kompetenzen durch eine Ausbildung zum Mediengestalter Digital und Print weiter professionalisieren. Seine Werke zeichnen sich durch eine einzigartige Herangehensweise aus: komplexe IT-Themen werden so aufbereitet, dass sowohl Einsteiger als auch Fortgeschrittene profitieren können, während sein satirisches Debütwerk "Hallo Welt" – eine messerscharfe Abrechnung mit dem deutschen Bildungssystem, die er gemeinsam mit Maximilian Reisch verfasst hat – seine Vielseitigkeit im Umgang mit gesellschaftskritischen Themen und seine Fähigkeit zu humorvollem, analytischem Schreiben unterstreicht. Diese Kombination aus pädagogischer Erfahrung, technischem Know-how, gestalterischem Verständnis und literarischer Bandbreite spiegelt sich in der besonderen Qualität seiner Publikationen wider.
                </p>
                <p>
                    Paulik schreibt aus Leidenschaft und Freude am Wissensteilen – seine Bücher sind der Ausdruck seines Wunsches, das Erlernte und Entdeckte mit anderen zu teilen und komplexe Themen zugänglich zu machen.
                </p>
            </div>
             <Button variant="outline" className="mt-6">Mehr Informationen über diesen Autor</Button>
          </div>

          <div className="flex flex-col items-center text-center">
             <Image
                alt="Maximilian Reisch"
                className="mx-auto mb-4 rounded-full"
                data-ai-hint="thoughtful author portrait"
                height="140"
                src="https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/reisch.png?alt=media&token=5aa20eee-967e-4912-9bfe-3f0b6861a316"
                style={{
                    aspectRatio: "140/140",
                    objectFit: "cover",
                }}
                width="140"
            />
            <h3 className="text-2xl font-bold font-headline">Maximilian Reisch</h3>
             <div className="mt-4 space-y-3 text-muted-foreground text-left text-sm">
                <p>
                    Maximilian Reisch, ebenfalls ein junger, aufstrebender Autor, bringt eine andere, aber ebenso scharfsinnige Perspektive in das gemeinsame Werk "Hallo Welt" ein. Sein Schreibstil ist geprägt von einer Mischung aus analytischer Beobachtung und einer tiefen Wertschätzung für die Absurditäten des Alltags.
                </p>
                <p>
                    Seine Fähigkeit, alltägliche Situationen in komödiantische Szenarien zu verwandeln, ergänzt Pauliks technische und gesellschaftskritische Ader perfekt. Reisch hat ein besonderes Talent dafür, Dialoge zu schreiben, die nicht nur authentisch klingen, sondern auch die subtilen Nuancen menschlicher Interaktion einfangen – oft mit einem ironischen Unterton, der den Leser zum Schmunzeln und Nachdenken anregt.
                </p>
                 <p>
                    Während Paulik die großen Strukturen und Systeme auseinandernimmt, widmet sich Reisch den kleinen, menschlichen Momenten, die oft übersehen werden, aber das Leben erst wirklich ausmachen. Gemeinsam bilden sie ein Autorenduo, das die deutsche Satirelandschaft mit frischem Wind und einer gehörigen Portion Respektlosigkeit aufmischt.
                </p>
            </div>
             <Button variant="outline" className="mt-6">Mehr Informationen über diesen Autor</Button>
          </div>
        </div>
      </div>
    </section>
  );
}