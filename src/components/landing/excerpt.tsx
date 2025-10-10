
"use client";

import { useState } from "react";
import { ExcerptGate } from "./ExcerptGate";
import { Button } from "../ui/button";
import { AlertTriangle, BookWarning, ShoppingCart } from "lucide-react";
import Link from "next/link";

export function Excerpt() {
  const [isGated, setIsGated] = useState(true);

  const handleUnlock = () => {
    setIsGated(false);
  };

  return (
    <section id="excerpt" className="w-full py-12 md:py-24 lg:py-32 bg-background">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold font-headline tracking-tighter sm:text-5xl">Ein kleiner Vorgeschmack auf Hallo Welt 2</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed text-balance">
              (Weil wir wissen, dass Sie nicht genug bekommen können.)
            </p>
          </div>
        </div>
        <div className="relative mx-auto max-w-3xl mt-12 text-left space-y-6">
          <h3 className="text-2xl font-bold font-headline tracking-tight">KAPITEL 6: Schlaflos in der Schrottimmobilie – Dachschaden inklusive</h3>
          <div className="prose dark:prose-invert max-w-none">
            <p>
                Wer zieht es nicht vor, statt unter bröckelnden Brücken zu hausieren und zu vagabundieren, lieber ein vernünftiges Dach über dem Kopf sein Eigen zu nennen?
            </p>
            <p>
                Doch für viele Menschen wird die Frage des Wohnens schnell zu einer Herausforderung. Anstatt dem Traum vom eigenen Heim nachgehen zu können, bleibt ihnen in Anbetracht ihres mageren Einkommens nichts anderes übrig, als bei zwielichtigen Vermietern, insbesondere der Sorte Lebenskünstler mit Schwerpunkt Gärungsbiologie<a href="#fn1" className="text-link no-underline">¹</a>, einen Wohnplatz anzufragen.
            </p>
             <p>
                Deren Alltagsgeschäft liegt darin, den Drogen- und Alkoholkonsum unserer Gesellschaft in die Höhe zu treiben und zwischen Flaschen und neuroeffizienzverstärkenden Substanzen – auch bekannt als Höllenzucker<a href="#fn2" className="text-link no-underline">²</a> – zu vegetieren.
            </p>
             <p>
                Dies wird schnell zum Verhängnis: Für die meisten gescholtenen Bürger ist es ziemlich unattraktiv, beim Besichtigen einer Wohnung durch ein verrauchtes und stinkendes Treppenhaus zu irren. Erst Slalomlauf zwischen Alkoholflaschen und dann die Treppen wieder runter mit Skiern auf dem hauseigenen Schnee? Das ist schließlich nur etwas für wahre, hochbegabte Adrenalinjunkies<a href="#fn3" className="text-link no-underline">³</a>. Doch mangels Alternativen bleibt oft keine andere Wahl, als diese von Kakerlaken und anderem Unge- ziefer behauste Baracke zu beziehen.
            </p>
          </div>

          <div className="relative">
            <div className={isGated ? "relative max-h-24 overflow-hidden" : ""}>
               <div className="prose dark:prose-invert max-w-none">
                 <p>
                    Beim Kochen des ersten Kaffees am Morgen stellt sich sogleich die Frage: Ist das wirklich Wasser, welches da aus dem Hahn trieft? Es gleicht beinahe der merkwürdig verfärbten Flüssig- keit, die bei radioaktivem Niederschlag am Ende einer verrosteten und von Schneckenschleim benetzten Regenrinne herauskommt, in diesem Gebäude aber auch ab und an durch die Decke tröpfelt. Gelegentlich befreit es den faulen Wohnungs- eigentümer zwar vom Putzen des Zimmers, ätzt aber dafür Löcher in die Möbel.
                </p>
              </div>
              {isGated && <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-background to-transparent pointer-events-none" />}
            </div>
             {isGated && (
                <div className="relative z-10 -mt-8">
                    <ExcerptGate onUnlock={handleUnlock} />
                </div>
            )}
          </div>

          {!isGated && (
            <>
            <div className="prose dark:prose-invert max-w-none space-y-6">
                 <p>
                    Hat man den Umzug vollends hinter sich gebracht und möchte mit einer Tasse Tee auf dem trostlosen Sofafetzen den Abend vor der flackernden Flimmerkiste genießen, offenbart sich ein ganz anderes tückisches Problem: die Nachbarn.
                </p>
                <p>
                    Jene Individuen, welche es darauf abgesehen haben, ihre unmittelbaren Mitmenschen zu tyrannisieren.
                </p>
                 <p>
                    Sei es der Lärm, der unverwechselbare Geruch gerauchten Unkrauts oder die rotzfrechen und verwöhnten Pimpfe von nebenan, die ständig mit Klingelstreichen oder derlei Unfug ihr Unwesen treiben.
                </p>
                <p>
                    Doch was ist das schlimmste aller Übel?
                </p>
                <p>
                    Die impertinenten Wanddurchdringer schikanieren ihre Mitbewohner ganz besonders mit der geheimsten aller Waffen: ihrer Daueranwesenheit. Es ist nicht der Bass, der einem die Eingeweide zum Schwingen bringt, und auch nicht der pene- trante Duft nach billigem Kräuterzucker, der neben Verwe- sungsrückständen durch das Lüftungsrohr zieht.
                </p>
                <p>
                    Nein, es ist das pure Bewusstsein, dass sie immer da sind.
                </p>

                <blockquote className="text-lg font-semibold italic text-center my-4 p-4 border-l-4 border-primary">
                    »Nachbarn sind wie Schimmel: Man sieht sie nicht immer, aber man weiß, dass sie hinter der Tapete gedeihen. Sobald man Schimmel sieht, will man ihn loswerden.«
                </blockquote>
                <p>
                    Der eine bohrt in Wänden, in denen es nachweislich nichts mehr zu bohren gibt. Man könnte meinen, er suche den direkten Durchgang zu einem fremden Wohnzimmer – in der Hoffnung, es ist weniger heruntergekommen als das eigene.
                </p>
                <p>
                    Und dann gibt es auch solche, die derart herzzerreißend und ohrenbetäubend nach ihrem heißgeliebten »Kevin« brüllen, dass man schon beinahe überlegen möchte, das Jugendamt zu informieren – oder das Ordnungsamt wegen Ruhestörung nach § 117 des Ordnungswidrigkeitengesetzes.
                </p>
                <p>
                    Falls man sich doch davon abwendet, poltert plötzlich um drei Uhr nachts geräuschvoll ein Müllsack nach dem anderen das Treppenhaus hinunter. Und wenn es mal um einen anderen Stoff geht, dann ist es der aus Baumwolle im Wäschekorb, welcher den ganzen Flur blockiert und die frische Luft durch muffigen Sockengeruch ersetzt.
                </p>
                <p>
                    Für solche Abenteuer zahlt man mitunter unverschämte elf Euro pro Quadratmeter Miete im Monat. Kalt – eine Heizung gibt es selbstverständlich nicht.
                </p>
                <p>
                    Dass dies keineswegs ein Einzelfall ist, offenbart die jüngst veröffentlichte Studie des angesehenen Instituts für Wohnraum- und Mietwucherforschung (IWMF).
                </p>
                <p>
                    Wie schon erwähnt, liegt der Mietpreisspiegel 2025/26 bei durchschnittlich 11 €/m² kalt. In Großstädten sogar bei bis zu 23 €/m² – allerdings ohne Heizung, Fenster oder Wände.
                </p>
                <p>
                    Auch konnten die Forschenden einen klaren Zusammenhang zwischen steigenden Mieten und Kriminalitätsraten  nachweisen. Je teurer die Wohnung, desto größer ist die Wahrscheinlichkeit, dass der Nachbar beim Pfandflaschensammeln gleichzeitig eine Fußmatte klaut oder einen Briefkasten entleert.
                </p>
                <p>
                    Aber es gibt auch eine gute Seite, welche die Studie offenbart. So deutet sie auf Immobilien hin, die für unter 10 €/m² (ja, die gibt es im Mietspiegel 2025/26) fast immer einen hauseigenen Zoo beinhalten. Darunter zählt das IWMF Kakerlaken, Ratten und gelegentliche Waschbärorgien in der Küche!
                </p>
            </div>

            <div className="mt-20 max-w-3xl mx-auto text-center p-8 border-2 border-dashed border-destructive rounded-lg bg-yellow-100/50 dark:bg-yellow-900/10">
                <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
                <h3 className="font-headline text-2xl font-bold text-destructive">Moment mal... Sie kennen "Hallo Welt 1" noch nicht?</h3>
                <p className="text-muted-foreground mt-2 text-balance">
                    Ernsthaft? Sie wagen es, sich an Teil 2 zu versuchen, ohne die Grundlagen des Wahnsinns zu kennen? Das ist, als würde man versuchen, einen Marathon zu laufen, ohne vorher das Krabbeln gelernt zu haben. Ein grober, fast unverzeihlicher Fehler.
                </p>
                 <Link href="/buchhandlung-paulik-reisch" className="mt-6 inline-block">
                    <Button size="lg" variant="destructive" className="h-14 text-lg animate-pulse">
                         <ShoppingCart className="mr-3"/>
                        SOFORT HIER KAUFEN!
                    </Button>
                </Link>
                <p className="text-xs text-muted-foreground mt-2">Befolgen Sie die Anweisungen, um Ihre Wissenslücke zu schließen.</p>
            </div>
            </>
         )}
          
          <div className="prose dark:prose-invert max-w-none">
            <ol className="text-xs text-muted-foreground space-y-2 pt-8">
                <li id="fn1">¹ Gärungsbiologie ist ein beschönigender Begriff für die Praktik des Produzierens von hochprozentig gebrannten Spirituosen. Mal dient dies dem Befriedigen der eigenen Sucht, mal als zusätzliche und unversteuerte Einkommensquelle.</li>
                <li id="fn2">² Der geschulte Leser mag bereits erahnen, was sich hinter diesem Begriff verbirgt. Für die eher schlichten Teilhaber hier eine kurze Schnuppererklärung: Höllenzucker ist ein biologischer Turbo-Kompostierer, welcher den natürlichen Zersetzungsprozess menschlicher DNA radikal beschleunigt. Er kann wahlweise oral oder nasal eingenommen werden.</li>
                <li id="fn3">³ Hochbegabte Adrenalinjunkies zeichnen sich dadurch aus, dass sie sowohl »hoch« im IQ-Test – meist knapp über Raumtemperatur – als auch »high« im Drogentest sind. Die Forschung ist sich bis heute uneins, ob ihre Begabung im geschickten Slalom durch Bierflaschen oder im simultanen Konsum verschiedenfarbiger Pillen besteht.</li>
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
