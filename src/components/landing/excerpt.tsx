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
        <div className="mx-auto max-w-3xl mt-12 text-left space-y-6 columns-1 md:columns-2 gap-8">
            <h3 className="text-2xl font-bold font-headline tracking-tight col-span-full">KAPITEL 6: Schlaflos in der Schrottimmobilie - Dachschaden inklusive</h3>
            <p className="text-muted-foreground leading-relaxed">
                Wer zieht es nicht vor, statt unter bereits bröckelnden Brücken zu hausieren und zu vagabundieren, lieber ein vernünftiges Dach über dem Kopf sein Eigen nennen zu dürfen?
            </p>
            <p className="text-muted-foreground leading-relaxed">
                Für viele Menschen wird die Frage des Wohnens schnell zu einer Herausforderung. Anstatt dem Traum vom eigenen Heim nachgehen zu können, bleibt einigen in Anbetracht ihres mageren Einkommens nichts anderes übrig, als bei zwielichtigen Vermietern, insbesondere der Sorte Lebenskünstler mit Schwerpunkt Gärungsbiologie¹, einen Wohnplatz anzufragen.
            </p>
            <p className="text-muted-foreground leading-relaxed break-inside-avoid">
                Deren Alltagsgeschäft spiegelt zugleich den angestiegenen Drogen- und Alkoholkonsum unserer dicht bevölkerten Geringverdiener wider, wenn diese gezwungen sind, zwischen Flaschen und neuroeffizienzverstärkenden Substanzen (unter anderem bekannt als Höllenzucker²) zu vegetieren. Diese Tatsache wird schnell zum Verhängnis - oder führt gar zum Selbsterhängnis.
            </p>
            <p className="text-muted-foreground leading-relaxed">
                Für die meisten gescholtenen Bürger ist es ziemlich unattraktiv, beim Besichtigen einer Wohnung zunächst durch ein verrauchtes und stinkendes Treppenhaus zu irren. Slalomlauf zwischen Alkoholflaschen und dann die Treppen wieder bergab mit Skiern auf dem hauseigenen Schnee? Das ist schließlich nur etwas für wahre, hochbegabte Adrenalinjunkies³. Doch mangels Alternativen bleibt oft keine andere Wahl, als diese bröckelnde, teils von Kakerlaken und anderem Ungeziefer behauste, Baracke künftig als eigene Unterkunft anzunehmen.
            </p>
            <p className="text-muted-foreground leading-relaxed">
                Beim Kochen des ersten Kaffees am Morgen stellt sich sogleich die Frage: Ist das wirklich Wasser, welches da aus dem Hahn schießt? Denn es gleicht beinahe der merkwürdig verfärbten Flüssigkeit, die bei radioaktivem Niederschlag am Ende einer verrosteten und von Schneckenschleim benetzten Regenrinne heraustrieft, in diesem Gebäude aber auch ab und an durch die Deckenlöcher tröpfelt. Gelegentlich befreit es den faulen Wohnungseigentümer zwar vom Putzen des Zimmers, ätzt aber auch Löcher in die ohnehin schon maroden Möbel.
            </p>
        </div>
        <div className="mx-auto max-w-3xl mt-8 text-left space-y-4 text-xs text-muted-foreground">
            <p>¹ Gärungsbiologie ist ein beschönigender Begriff für die Praktik des Produzierens von hochprozentig gebrannten Spirituosen. Mal dient dies dem Befriedigen der eigenen Sucht, mal als zusätzliche und zumeist unversteuerte Einkommensquelle.</p>
            <p>² Der geschulte Leser mag bereits erahnen, was sich hinter dem Begriff Höllenzucker verbirgt. Für die eher schlichten Teilhaber hier eine kurze Schnuppererklärung.</p>
            <p>³ Nur zu Unterhaltungszwecken. Nicht nachmachen.</p>
        </div>
      </div>
    </section>
  );
}
