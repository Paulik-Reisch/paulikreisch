export function Excerpt() {
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
        <div className="mx-auto max-w-3xl mt-12 text-left space-y-6 md:columns-2 md:gap-8">
            <h3 className="text-2xl font-bold font-headline tracking-tight md:col-span-full">KAPITEL 6: Schlaflos in der Schrottimmobilie – Dachschaden inklusive</h3>
            <p className="text-muted-foreground leading-relaxed">
                Wer zieht es nicht vor, statt unter bröckelnden Brücken zu hausieren und zu vagabundieren, lieber ein vernünftiges Dach über dem Kopf sein Eigen zu nennen?
            </p>
            <p className="text-muted-foreground leading-relaxed">
                Doch für viele Menschen wird die Frage des Wohnens schnell zu einer Herausforderung. Anstatt dem Traum vom eigenen Heim nachgehen zu können, bleibt ihnen in Anbetracht ihres mageren Einkommens nichts anderes übrig, als bei zwielichtigen Vermietern, insbesondere der Sorte Lebenskünstler mit Schwerpunkt Gärungsbiologie¹, einen Wohnplatz anzufragen.
            </p>
            <p className="text-muted-foreground leading-relaxed break-inside-avoid">
                Deren Alltagsgeschäft liegt darin, den Drogen- und Alkoholkonsum unserer Gesellschaft in die Höhe zu treiben und zwischen Flaschen und neuroeffizienzverstärkenden Substanzen – auch bekannt als Höllenzucker² – zu vegetieren.
            </p>
            <p className="text-muted-foreground leading-relaxed">
                Dies wird schnell zum Verhängnis: Für die meisten gescholtenen Bürger ist es ziemlich unattraktiv, beim Besichtigen einer Wohnung durch ein verrauchtes und stinkendes Treppenhaus zu irren. Erst Slalomlauf zwischen Alkoholflaschen und dann die Treppen wieder runter mit Skiern auf dem hauseigenen Schnee? Das ist schließlich nur etwas für wahre, hochbegabte Adrenalinjunkies³. Doch mangels Alternativen bleibt oft keine andere Wahl, als diese von Kakerlaken und anderem Ungeziefer behauste Baracke zu beziehen.
            </p>
            <p className="text-muted-foreground leading-relaxed">
                Beim Kochen des ersten Kaffees am Morgen stellt sich sogleich die Frage: Ist das wirklich Wasser, welches da aus dem Hahn trieft? Es gleicht beinahe der merkwürdig verfärbten Flüssigkeit, die bei radioaktivem Niederschlag am Ende einer verrosteten und von Schneckenschleim benetzten Regenrinne herauskommt, in diesem Gebäude aber auch ab und an durch die Decke tröpfelt. Gelegentlich befreit es den faulen Wohnungseigentümer zwar vom Putzen des Zimmers, ätzt aber dafür Löcher in die Möbel.
            </p>
        </div>
        <div className="mx-auto max-w-3xl mt-8 text-left space-y-4 text-xs text-muted-foreground">
            <p>¹ Gärungsbiologie ist ein beschönigender Begriff für die Praktik des Produzierens von hochprozentig gebrannten Spirituosen. Mal dient dies dem Befriedigen der eigenen Sucht, mal als zusätzliche und unversteuerte Einkommensquelle.</p>
            <p>² Der geschulte Leser mag bereits erahnen, was sich hinter diesem Begriff verbirgt. Für die eher schlichten Teilhaber hier eine kurze Schnuppererklärung: Höllenzucker ist ein biologischer Turbo-Kompostierer, welcher den natürlichen Zersetzungsprozess menschlicher DNA radikal beschleunigt. Er kann wahlweise oral oder nasal eingenommen werden.</p>
            <p>³ Hochbegabte Adrenalinjunkies zeichnen sich dadurch aus, dass sie sowohl »hoch« im IQ-Test – meist knapp über Raumtemperatur – als auch »high« im Drogentest sind. Die Forschung ist sich bis heute uneins, ob ihre Begabung im geschickten Slalom durch Bierflaschen oder im simultanen Konsum verschiedenfarbiger Pillen besteht.</p>
        </div>
      </div>
    </section>
  );
}
