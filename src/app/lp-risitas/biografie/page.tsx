
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Film, Laugh, Globe, Utensils } from "lucide-react";

export default function RisitasBiografiePage() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-background text-foreground">
      <Header />
      <main className="flex-1 py-12 md:py-24">
        <div className="container px-4 md:px-6">
            <article className="prose prose-lg dark:prose-invert mx-auto">
                <header className="text-center mb-12">
                    <Badge variant="secondary">Porträt einer Legende</Badge>
                    <h1 className="font-headline mt-4">Juan Joya Borja: Das Lachen, das die Welt eroberte</h1>
                    <p className="lead">Die Geschichte von "El Risitas", einem einfachen Mann aus Sevilla, der unerwartet zu einem globalen Internet-Phänomen wurde.</p>
                </header>

                <figure className="not-prose">
                    <Image
                        src="https://upload.wikimedia.org/wikipedia/commons/a/a7/Risitas.jpg"
                        alt="Porträt von El Risitas, 2015"
                        width={800}
                        height={600}
                        className="rounded-lg shadow-lg mx-auto aspect-video object-cover"
                    />
                    <figcaption className="text-center text-xs text-muted-foreground mt-2">
                        El Risitas (2015). Foto: Alflink999 - Eigenes Werk, <a href="https://creativecommons.org/licenses/by-sa/4.0" target="_blank" rel="noopener noreferrer" className="underline">CC BY-SA 4.0</a>
                    </figcaption>
                </figure>

                <h2><Utensils className="inline-block mr-2 h-6 w-6"/>Von der Küche ins Rampenlicht</h2>
                <p>
                    Geboren am 5. April 1956 in Sevilla, führte Juan Joya Borja zunächst ein unscheinbares Leben. Er verdingte sich mit einfachen Arbeiten, war Koch und trug schwere Zementsäcke. Niemand ahnte, dass in ihm ein Komiker von Weltrang schlummerte. Sein Schicksal wendete sich im Jahr 2000, als er in der Sendung "El Vagamundo" des legendären Moderators Jesús Quintero auftrat. Es war der Beginn einer außergewöhnlichen Karriere.
                </p>

                <h2><Laugh className="inline-block mr-2 h-6 w-6"/>Die Geburt von "El Risitas"</h2>
                <p>
                    Was Juan Joya von anderen Interviewgästen unterschied, war sein einzigartiges, ansteckendes Lachen. Es war ein heiseres, zahnloses Kichern, das sich zu einem schallenden Gelächter steigern konnte und niemanden unberührt ließ. Dieses Markenzeichen brachte ihm schnell den Spitznamen "El Risitas" – der Kichernde – ein und machte ihn in ganz Spanien bekannt. Er wurde zur festen Größe in Quinteros Shows und zum gern gesehenen Gast auf Festen und Partys. Seine Fähigkeit, aus den banalsten Alltagsgeschichten urkomische Anekdoten zu machen, war unübertroffen.
                </p>

                <h2><Film className="inline-block mr-2 h-6 w-6"/>Ein spanischer Star</h2>
                <p>
                    Durch seine ständige Präsenz im Fernsehen stieg El Risitas in die Riege der spanischen B-Prominenz auf. Diese neue Bekanntheit brachte ihm sogar eine kleine Rolle in der erfolgreichen Action-Komödie "Torrente 3: El protector" (2005) ein. Doch der größte Ruhm sollte erst noch kommen – und zwar aus einer völlig unerwarteten Richtung.
                </p>
                
                <h2><Globe className="inline-block mr-2 h-6 w-6"/>Das Meme, das um die Welt ging</h2>
                <p>
                    Im Jahr 2007 erzählte El Risitas in der Sendung "Ratones Coloraos" eine seiner berühmtesten Geschichten: Als junger Tellerwäscher hatte er die geniale Idee, eine Ladung fettiger Paella-Pfannen über Nacht im Meer zu deponieren, damit die Flut und das Salzwasser ihm die Reinigungsarbeit abnehmen würden. Als er am nächsten Morgen zurückkehrte, musste er mit Entsetzen feststellen, dass die Flut die Pfannen allesamt aufs offene Meer hinausgespült hatte.
                </p>
                <p>
                    Während er diese Geschichte erzählte, wurde er immer wieder von seinem eigenen, unkontrollierbaren Lachanfall übermannt. Genau dieses Interview, hochgeladen am 25. Juni 2007 auf YouTube, wurde zur Vorlage für ein globales Internet-Meme.
                </p>
                <blockquote>
                   Das Prinzip war simpel und genial: Der spanische Originalton blieb erhalten, während die Untertitel völlig neue, satirische Geschichten erzählten.
                </blockquote>
                <p>
                   Nachdem bereits 2014 die Muslimbrüder das Video zur Parodie auf den ägyptischen Präsidenten as-Sisi nutzten, kam der internationale Durchbruch im März 2015. Ein User unterlegte das Video mit fiktiven Untertiteln, in denen Risitas als frustrierter Apple-Ingenieur über das neue MacBook herzog. Das Video explodierte und erreichte in nur einem Monat über fünf Millionen Zuschauer. Unzählige weitere Parodien folgten und machten Juan Joya Borjas Gesicht und sein Lachen unsterblich.
                </p>

                 <h2>Ein leiser Abschied</h2>
                <p>
                    Abseits des Rampenlichts kämpfte El Risitas mit gesundheitlichen Problemen. Er litt an Diabetes, und im September 2020 musste ihm ein Bein amputiert werden. Am 28. April 2021 verstarb Juan Joya Borja im Alter von 65 Jahren in seiner Heimatstadt Sevilla. Er hinterließ ein Erbe, das weit über seine Fernsehauftritte hinausgeht: ein Lachen, das auch heute noch Menschen auf der ganzen Welt zum Schmunzeln bringt und beweist, dass Humor wirklich keine Sprache kennt.
                </p>
            </article>
        </div>
      </main>
      <Footer />
    </div>
  );
}
