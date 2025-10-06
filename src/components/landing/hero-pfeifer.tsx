"use client";

import React, { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { subscribeToNewsletterAction } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "../ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Loader2, Mail } from "lucide-react";


const schimpfwoerter = [
    { de: "Dummkopf", es: "gilipollas", anwendung: "Für Personen, deren Gehirn im Standby-Modus steckt." },
    { de: "Arschloch", es: "capullo / cabrón", anwendung: "Universell einsetzbar für sympathische Mitmenschen." },
    { de: "Idiot", es: "idiota", anwendung: "Wenn 'Dummkopf' die Situation untertreibt." },
    { de: "Hurensohn", es: "hijo de puta", anwendung: "Fortgeschrittenes Vokabular für den fortgeschrittenen Frust." },
    { de: "Scheiße", es: "mierda", anwendung: "Klassiker. Passt immer, wenn etwas nicht nach Plan läuft." },
    { de: "Verdammt", es: "joder", anwendung: "Das spanische 'Verdammt' - ein echter Alleskönner." },
    { de: "Blödmann", es: "tonto del culo", anwendung: "Für den ganz besonderen Blödmann in Ihrem Leben." },
    { de: "Wichser", es: "pajero", anwendung: "Wenn jemand ein selbstverliebtes Ekelpaket ist." },
    { de: "Miststück", es: "zorra", anwendung: "Für eine besonders raffinierte weibliche Nervensäge." },
    { de: "Leck mich am Arsch!", es: "¡Vete a la mierda!", anwendung: "Höfliche Aufforderung, sich zu entfernen." },
    { de: "Vollidiot", es:"subnormal", anwendung: "Die Steigerung von 'Idiot'. Eskalationsstufe Rot." },
    { de: "Penner", es: "pringado", anwendung: "Für den sympathischen Verlierertypen von nebenan." },
    { de: "Verpiss dich!", es: "¡Lárgate!", anwendung: "Wenn nonverbale Hinweise nicht mehr ausreichen." },
    { de: "Halt die Klappe!", es: "¡Cállate la boca!", anwendung: "Die freundliche Bitte um akustische Ruhe." },
    { de: "deine Mutter", es: "tu puta madre", anwendung: "Letztes Mittel. Nur für absolute Notfälle." },
];

const witze = [
    { witz: "¿Qué le dice un semáforo a otro? — ¡No me mires, que me estoy cambiando!", uebersetzung: "Was sagt eine Ampel zur anderen? — Schau mich nicht an, ich ziehe mich gerade um!", erklaerung: "Wortspiel: 'cambiar' bedeutet sowohl 'sich umziehen' als auch '(Farbe) wechseln'." },
    { witz: "¿Cuál es el último animal que subió al arca de Noé? — El del-fín.", uebersetzung: "Welches ist das letzte Tier, das die Arche Noah bestieg? — Der Del-phin.", erklaerung: "Wortspiel: 'del fin' klingt wie 'delfín' (Delphin) und bedeutet 'vom Ende'." },
    { witz: "Papá, ¿qué se siente tener un hijo tan guapo? — No sé, hijo, pregúntale a tu abuelo.", uebersetzung: "Papa, wie fühlt es sich an, einen so gutaussehenden Sohn zu haben? — Ich weiß nicht, mein Sohn, frag deinen Großvater.", erklaerung: "Der Vater gibt das 'Kompliment' indirekt an sich selbst weiter." },
    { witz: "Entra un hombre a una pajarería y pregunta: ¿Cuánto cuesta el loro? — 6.000 euros. — ¡Caramba! ¿Y qué hace? — Habla 7 idiomas y sabe de computación. — ¡Me lo llevo! Al día siguiente, vuelve: ¡El loro no ha dicho ni una palabra! — Es que es muy tímido. ¡Usted háblele primero!", uebersetzung: "Ein Mann geht in eine Tierhandlung und fragt: Was kostet der Papagei? - 6.000 Euro. - Wow! Was kann er denn? - Er spricht 7 Sprachen und kennt sich mit Computern aus. - Ich nehme ihn! Am nächsten Tag kommt er zurück: Der Papagei hat kein Wort gesagt! - Er ist nur sehr schüchtern. Sprechen Sie ihn einfach zuerst an!", erklaerung: "Eine klassische Pointe, die die hohe Erwartung mit einer banalen Ausrede bricht." },
    { witz: "¿Cómo se llama el campeón de buceo japonés? — Tokofondo.", uebersetzung: "Wie heißt der japanische Meister im Tauchen? — Tokofondo.", erklaerung: "Klingt wie ein japanischer Name, bedeutet aber wörtlich 'Ich berühre den Grund' (toco fondo)." },
    { witz: "Van dos soldados en una moto y no se cae ninguno. ¿Por qué? — ¡Porque van soldados!", uebersetzung: "Zwei Soldaten fahren auf einem Motorrad und keiner fällt herunter. Warum? — Weil sie 'gelötet' sind!", erklaerung: "Wortspiel: 'soldado' ist ein Soldat, aber 'soldados' (Plural) klingt wie 'gelötet'." },
    { witz: "¿Qué le dice un pez a otro? — ¡Nada!", uebersetzung: "Was sagt ein Fisch zum anderen? — Nichts! / Schwimm!", erklaerung: "Wortspiel: 'Nada' bedeutet 'nichts' und ist auch die Imperativform von 'nadar' (schwimmen)." },
    { witz: "En una entrevista de trabajo: ¿Nivel de inglés? — Alto. — A ver, traduzca 'fiesta'. — Party. — Úselo en una frase. — Hoy 'party' un plato de lentejas y estaban riquísimas.", uebersetzung: "Im Vorstellungsgespräch: Englisch-Niveau? - Hoch. - Übersetzen Sie 'Fest'. - Party. - Verwenden Sie es in einem Satz. - Heute 'teilte' ich einen Teller Linsen und sie waren köstlich.", erklaerung: "Wortspiel: 'Party' klingt wie 'partí', die Vergangenheitsform von 'partir' (teilen/aufteilen)." },
    { witz: "¿Por qué los pájaros no usan Facebook? — Porque ya tienen Twitter.", uebersetzung: "Warum benutzen Vögel kein Facebook? — Weil sie schon Twitter haben.", erklaerung: "Wortspiel, das das Zwitschern ('tweet') der Vögel mit dem sozialen Netzwerk verbindet." },
    { witz: "¿Qué es un 'lapier'? — Una 'piedul'.", uebersetzung: "Was ist ein 'Schoßbein'? — Ein 'Fußtei'.", erklaerung: "Völlig unsinniges Wortspiel, das Silben verdreht. 'Lapiz' (Bleistift) wird zu 'Pizla'." },
    { witz: "¿Cómo se dice 'espejo' en chino? — Aitoiyó.", uebersetzung: "Wie sagt man 'Spiegel' auf Chinesisch? — Aitoiyó.", erklaerung: "Lautmalerisch für 'Ahí estoy yo' (Da bin ich)." },
    { witz: "Se abre el telón y se ve a un hombre con un solo pelo. Se cierra el telón. ¿Cómo se llama la película? — El solitario.", uebersetzung: "Der Vorhang geht auf und man sieht einen Mann mit nur einem Haar. Der Vorhang fällt. Wie heißt der Film? — Der Einsame.", erklaerung: "Ein einfacher, visueller Witz." },
    { witz: "Era un hombre tan, tan, tan alto que se comió un yogur y cuando le llegó al estómago ya estaba caducado.", uebersetzung: "Es war einmal ein Mann, der war so, so, so groß, dass er einen Joghurt aß und als dieser im Magen ankam, war er schon abgelaufen.", erklaerung: "Eine klassische spanische 'tan, tan'-Übertreibung." },
    { witz: "¿Cómo maldice un pollito a otro? — ¡Caldito seas!", uebersetzung: "Wie verflucht ein Küken ein anderes? — 'Brühe sollst du sein!'", erklaerung: "Wortspiel: Klingt wie 'maldito seas' (verflucht seist du), aber 'caldito' ist eine kleine Brühe." },
    { witz: "¿Qué le dice un espagueti a otro? — ¡Oye, el cuerpo me pide salsa!", uebersetzung: "Was sagt eine Spaghetti zur anderen? — Hey, mein Körper verlangt nach Soße! / Hey, mein Körper will tanzen!", erklaerung: "Wortspiel: 'Salsa' ist sowohl Soße als auch ein Tanzstil." },
    { witz: "¿Para qué va una caja al gimnasio? — ¡Para hacerse caja fuerte!", uebersetzung: "Warum geht eine Kiste ins Fitnessstudio? — Um ein Tresor zu werden!", erklaerung: "Wortspiel: 'caja fuerte' bedeutet Tresor, wörtlich aber 'starke Kiste'." },
    { witz: "Un gato va caminando por un tejado y maúlla: '¡Miau, miau!'. Se le acerca otro gato y le dice: '¡Guau, guau!'. El primer gato se extraña: '¿Por qué ladras?'. Y el otro le contesta: 'Es que estoy aprendiendo idiomas.'", uebersetzung: "Eine Katze geht über ein Dach und miaut: 'Miau, miau!'. Eine andere Katze kommt und sagt: 'Wau, wau!'. Die erste Katze wundert sich: 'Warum bellst du?'. Die andere antwortet: 'Ich lerne gerade Sprachen.'", erklaerung: "Ein absurder Witz, der auf der Idee des Sprachenlernens basiert." },
    { witz: "¿Cuál es el colmo de un jardinero? — Que su novia se llame Rosa y lo deje plantado.", uebersetzung: "Was ist das Ärgste für einen Gärtner? — Dass seine Freundin Rosa heißt und ihn sitzen lässt.", erklaerung: "Wortspiel: 'dejar plantado' bedeutet 'jemanden sitzen lassen', wörtlich aber 'jemanden eingepflanzt lassen'." },
    { witz: "¿Qué hace una abeja en el gimnasio? — Zumba.", uebersetzung: "Was macht eine Biene im Fitnessstudio? — Zumba.", erklaerung: "Wortspiel: 'Zumba' ist ein Fitness-Tanz, und Bienen summen ('zumbar')." },
    { witz: "Esto es un hombre que entra a un bar de pinchos y dice: ¡Ay! ¡Ay! ¡Ay!", uebersetzung: "Kommt ein Mann in eine Tapas-Bar (mit Spießen) und sagt: 'Au! Au! Au!'", erklaerung: "Wortspiel: 'Pinchos' sind kleine Snacks auf Spießen, aber 'pincho' bedeutet auch 'Stich' oder 'Stachel'." },
];

const initialNewsletterState = { success: undefined, error: undefined, message: undefined };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        </>
      ) : (
        "Benachrichtigen Sie mich!"
      )}
    </Button>
  );
}

function HW2LeadForm({ title, description, source }: { title: string, description: string, source: string }) {
    const formRef = useRef<HTMLFormElement>(null);
    const [state, formAction] = useActionState(subscribeToNewsletterAction, initialNewsletterState);
    const { toast } = useToast();

    useEffect(() => {
        if (state.success) {
            toast({ title: "Erfolgreich eingetragen!", description: state.message });
            formRef.current?.reset();
        }
        if (state.error) {
            toast({ variant: "destructive", title: "Fehler", description: state.error });
        }
    }, [state, toast]);

    return (
        <div className="not-prose my-12 text-center p-8 bg-muted/50 border border-dashed rounded-lg">
            <h3 className="font-headline text-2xl font-bold">{title}</h3>
            <p className="mt-2 text-muted-foreground max-w-xl mx-auto text-balance">
                {description}
            </p>
            <form ref={formRef} action={formAction} className="mt-4 flex flex-col sm:flex-row gap-2 max-w-sm mx-auto">
                <Input name="email" className="flex-1" placeholder="meine.email@provider.de" type="email" required />
                <input type="hidden" name="source" value={source} />
                <SubmitButton />
            </form>
        </div>
    )
}

export function HeroPfeifer() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <article className="prose prose-lg dark:prose-invert mx-auto">
          <header className="text-center mb-12">
            <Badge variant="secondary">Exklusiv-Enthüllung</Badge>
            <h1 className="font-headline text-4xl sm:text-6xl font-bold tracking-tighter mt-4 text-balance">
              Hallo Welt & das Mysterium der "La Silbadora Pfeifer"
            </h1>
            <p className="text-xl text-muted-foreground mt-4 text-balance">
              Die redaktionelle Analyse eines Phänomens, das die Grundpfeiler
              unserer Gesellschaft erschüttert.
            </p>
          </header>

          <div className="relative aspect-video mb-12 rounded-lg overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-500 -rotate-1">
            <Image
              src="https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/r-pfeifer-con-espania.png?alt=media&token=d858afac-622b-42b9-837e-c2ac5143189a"
              alt="Die legendäre Spanischlehrerin R. Pfeifer mit einer Spanienflagge im Hintergrund"
              data-ai-hint="teacher spain"
              layout="fill"
              objectFit="cover"
            />
          </div>

          <p>
            In den verrauchten Amtsstuben und schlecht beleuchteten
            Universitätskorridoren flüstert man ihren Namen nur:{" "}
            <span className="font-semibold italic">La Silbadora</span>.
            Ein Phantom. Eine Frau, deren pfeifende Melodien die
            Gesetze der Physik außer Kraft zu setzen vermögen. Doch was steckt wirklich hinter diesem Mythos?
            Unsere Recherche führt uns zurück in die heiligen Hallen der Lernvollzugsanstalt Siebenkirchen-Seelscheid.
          </p>
          <p>
            Die Legende hat einen Namen: Rabea Pfeifer. Im Buch <Link href="/buchhandlung-paulik-reisch" className="text-link">Hallo Welt</Link> als <strong className="font-headline">R. Pfeffer</strong> verewigt, war sie die Spanischlehrerin, die den jungen Autoren den Weg wies. Nicht den Weg zur Grammatik – nein, den Weg zu den wirklich wichtigen Dingen im Leben. Frau Pfeifer – eine Frau, deren Begeisterung für die spanische Sprache nur von ihrer Abneigung gegen Mathematik und funktionierende Technik übertroffen wird.
          </p>
          
           <blockquote>
            »Sie sprang mit heuchlerischem Enthusiasmus vor die Tafel«, erinnert sich einer der Autoren, »und lehrte uns die ersten wirklich nützlichen Wörter.« Nicht »hola«, nicht »gracias«. Sie lehrte uns das, was man braucht, wenn der Bus zu spät kommt oder das Mensaessen wieder nach atomarer Kernschmelze schmeckt - beides natürlich ausführlich in <Link href="/buchhandlung-paulik-reisch" className="text-link">Hallo Welt</Link> beschrieben.
          </blockquote>

          <p>
            Es war nach der 8. Klasse, als unsere Helden unter die Fittiche von La Silbadora kamen. Sie lernten, dass Sprache mehr ist als nur Kommunikation. Sie ist eine <Link href="/lp-palabrotas" className="text-link">Waffe</Link>. Ein Werkzeug. Eine Kunstform. Insbesondere die Kunstform der gepflegten Beleidigung. Frau Pfeifer vermittelte ihnen die wertvollsten Lektionen ihres Lebens in Form von handverlesenen <Link href="/lp-palabrotas" className="text-link">»palabrotas« – Schimpfwörtern</Link>.
          </p>

            <div className="my-12 not-prose">
                <h3 className="font-headline text-2xl font-bold text-center mb-4">Grundwortschatz Spanisch nach R. Pfeifer</h3>
                 <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead className="font-semibold">Deutsches Schimpfwort</TableHead>
                        <TableHead className="font-semibold">Spanische Übersetzung</TableHead>
                        <TableHead className="font-semibold">Anwendungsgebiet</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {schimpfwoerter.map((wort) => (
                        <TableRow key={wort.de}>
                            <TableCell>{wort.de}</TableCell>
                            <TableCell className="italic">{wort.es}</TableCell>
                             <TableCell className="text-sm text-muted-foreground">{wort.anwendung}</TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <p className="text-xs text-center text-muted-foreground mt-2">Haftungsausschluss: Die Verwendung dieser Vokabeln erfolgt auf eigene Gefahr. Kann zu blauen Augen oder diplomatischen Krisen führen.</p>
                <div className="text-center mt-6">
                    <Link href="/lp-palabrotas">
                        <Button size="lg" variant="outline" className="h-14 text-lg">
                            <Image src="https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/pfeifer-translate-logo.png?alt=media&token=b9cc1522-b994-43d9-ac64-a034cf323a91" alt="Pfeifer Translate Logo" width={28} height={28} className="mr-3 rounded-full"/>
                            Zum Palabrotas-Duden
                        </Button>
                    </Link>
                </div>
            </div>
            
            <HW2LeadForm
                title="Lust auf noch mehr Wortakrobatik?"
                description="Seien Sie der Erste, der erfährt, wann 'Hallo Welt 2' erscheint. Wir benachrichtigen Sie, versprochen."
                source="Pfeifer-lead-1"
            />

            <p>
                Neueste Berichte aus dem inneren Zirkel besagen, dass La Silbadora kürzlich ein Exemplar von »Hallo Welt« in die Hände bekam. Zeugen berichten von einem unkontrollierbaren Lachanfall, der durch die Gänge der Lernvollzugsanstalt hallte. Sie konnte sich nicht mehr halten und stürzte – so die dramatische Schilderung – die berüchtigten Treppen des Schulgebäudes hinab. <Link href="/buchhandlung-paulik-reisch" className="text-link">Wer das Buch gelesen hat</Link>, weiß, was das normalerweise zur Folge hat: einen Genickbruch!
            </p>
            <p>
                Doch dann geschah ein schieres Wunder: In einer Bewegung, die man nur als übernatürlich beschreiben kann, schnipste La Silbadora im freien Fall mit den Fingern. Wie von Geisterhand materialisierte sich ein Exemplar von <Link href="/buchhandlung-paulik-reisch" className="text-link">"Hallo Welt 1"</Link> direkt unter ihr und federte den Aufprall ab. Sie landete weich; ihr Genick blieb intakt.
            </p>
             <p>
                Ende gut, alles gut. Selbst das Buch war nicht zerknickt. Denn das ist gedruckte und geschriebene Qualität, die Leben rettet.
            </p>
          
          <div className="text-center my-12 py-12 border-t border-b border-dashed not-prose">
            <h2 className="font-headline text-3xl font-bold">Erleben Sie das Pfeifkonzert selbst!</h2>
            <p className="mt-4 text-muted-foreground">
              »Hallo Welt« ist die Anleitung zum Überleben in einer Welt, die den Verstand verloren hat. Oder der schnellste Weg, ihn selbst zu verlieren.
            </p>
            <Link href="/buchhandlung-paulik-reisch" className="mt-6 inline-block">
                <Button size="lg" className="animate-pulse" variant="default">Jetzt dem Wahnsinn stellen</Button>
            </Link>
          </div>
          
            <p>
                Die Chipirones essende Frau Silbadora mag Witze sehr. Sehr sogar. Es wird gemunkelt, dass ihre legendären Pfeifmelodien oft überpfiffene Versionen von Pointen sind, die nur sie versteht. Ihr Lachen, so heißt es, könne das Fundament jedes noch so stabilen Schulgebäudes erschüttern und sei der wahre Grund für die Risse in den Wänden der Lernvollzugsanstalt.
            </p>
            <p>
                Die Autoren Philipp und Max wussten um diese heimliche Leidenschaft. In einem Anflug jugendlicher Genialität (oder war es doch nur Prokrastination vor den Spanisch-Hausaufgaben?) erschufen sie ein digitales Denkmal für ihre Mentorin. Ein Ort, an dem der Witz regiert und die Ernsthaftigkeit draußen bleiben muss. Eine Ode an das, was Frau Pfeifer ihnen wirklich beigebracht hat: das Leben nicht ganz so ernst zu nehmen.
            </p>
            <p>
                Diese Webseite trug den klangvollen Namen »eñje«. Sie mag heute zwar so verstaubt sein wie die Kreide unter der Tafel, aber es ist uns gelungen, einige der besten Artefakte aus den digitalen Trümmern zu bergen. Eine Sammlung von Witzen, die einst das Herz (und das Zwerchfell) von La Silbadora erfreuten.
            </p>

            <div className="my-12 not-prose">
                <h3 className="font-headline text-2xl font-bold text-center mb-4">Die besten Witze von eñje</h3>
                 <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="font-semibold">Spanischer Witz</TableHead>
                            <TableHead className="font-semibold">Deutsche Übersetzung</TableHead>
                            <TableHead className="font-semibold">Sprachliche Erklärung</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {witze.map((item, index) => (
                        <TableRow key={index}>
                            <TableCell className="italic">{item.witz}</TableCell>
                            <TableCell>{item.uebersetzung}</TableCell>
                            <TableCell className="text-sm text-muted-foreground">{item.erklaerung}</TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <div className="text-center mt-6">
                    <Link href="/lp-palabrotas">
                         <Button size="lg" variant="secondary">
                            <Image src="https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/pfeifer-translate-logo.png?alt=media&token=b9cc1522-b994-43d9-ac64-a034cf323a91" alt="Pfeifer Translate Logo" width={24} height={24} className="mr-2 rounded-full"/>
                            Mehr Witze erzählt bekommen
                        </Button>
                    </Link>
                </div>
            </div>
            
            <p>
                Drei Jahre nach der Lernvollzugszeit. Ein milder Sommerabend in Italien. La Silbadora sitzt mit ihren beiden ehemaligen Schützlingen am Strand. Eine Flasche Rotwein macht die Runde, das Rauschen der Wellen liefert den Soundtrack. Sie blicken zurück auf die wilde Zeit, auf Treppenstürze, unsinnige Regeln und den täglichen Kampf gegen die Absurdität. Und mitten in diesem Moment des Friedens, zwischen zwei Schlucken Wein, entweicht ihr ein leises, fast unhörbares Pfeifen – eine Melodie, die nur die drei verstehen. Ein Witz ohne Worte. Die Legende lebt.
            </p>

            <HW2LeadForm
                title="Die Geschichte geht weiter ..."
                description="Gefällt Ihnen, was Sie lesen? 'Hallo Welt 2' setzt dem Ganzen die Krone auf. Tragen Sie sich ein und erfahren Sie als Erster, wann das nächste Kapitel des Wahnsinns beginnt."
                source="Pfeifer-lead-2"
            />
        </article>
      </div>
    </section>
  );
}
