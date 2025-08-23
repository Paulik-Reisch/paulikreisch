import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const excerpt1 = (
    <div className="space-y-4 text-muted-foreground leading-relaxed">
        <h3 className="text-2xl font-bold font-headline tracking-tight text-foreground">KAPITEL 8: Gefahren der Oberstufe - Garantiert eine Stufe zu hoch</h3>
        <p>Ein weiterer, durchaus interessanter Fakt ist, dass der Name Oberstufe eine ganz neue Bedeutung erhält, da man, um die Unterrichtsräume derer zu erreichen, zunächst zwei Stockwerke in die Höhe zurücklegen muss.</p>
        <p>Oftmals beschweren sich Lehrkräfte, dass sie sich deswegen wie eine Seniorin oder ein Senior vorkommen und das hechelnde Atmen produziert zudem eine nicht unerhebliche Menge an CO2. Dies erschwert die ohnehin schon schwierige Bekämpfung des Klimawandels in enormer Weise.</p>
        <p>Ein weiterer, wichtiger Aspekt dabei ist zudem die Tatsache, dass durch das viele Treppensteigen die Treppen selbst und ebenso das Schuhwerk der schwer schuftenden Personen abnormal stark abgenutzt werden. Dies führt dazu, dass die Putzkräfte mehr Schuhabrieb entfernen müssen und zusätzlich die Treppensteiger schneller gezwungen sind, sich neues Schuhwerk anzuschaffen.</p>
        <p>Es sind auch andauernde Schäden an Treppenstufen festzustellen, da die maximale Abnutzungskapazität durch Lernende und Lehrende sinkt.</p>
        <p>Wodurch die Schule ebenso in eine unangenehme Lage gerät, ist das (möglicherweise) vermehrte Auftreten der Ratten, die durch weniger Treppenbelag leichter an die Oberfläche gelangen können und gegebenenfalls dazu führen, dass erschrockene Personen rücklings die Treppe herunterfallen und sich das Genick brechen könnten. Zusätzlich könnten sie andere Schülerinnen oder Schüler mit in den Tod reißen, wenn sie während des freien Falls in andere Personen hineinfallen.</p>
        <p>Dadurch entsteht das Problem, dass eine gerichtliche Verhandlung nicht mehr möglich ist, da Täter und Opfer gleichermaßen dem Leben abgedankt haben.</p>
        <p>Zudem ist fraglich, wie die Entsorgung der Leichen vonstattengehen sollte, denn wie können die Särge bei solch einer schlechten Infrastruktur hinauf- und wieder herab transportiert werden?</p>
    </div>
);

const excerpt2 = (
    <div className="space-y-4 text-muted-foreground leading-relaxed">
        <h3 className="text-2xl font-bold font-headline tracking-tight text-foreground">KAPITEL 15: Eine der größten Hürden: Die Schulzeiten</h3>
        <p>Wie Sie selbst sicherlich noch aus Ihrer eigenen Jugend wissen, startet der von Eintönigkeit geprägte Schulalltag für den eifrigen Gefolgsmann des deutschen Bürokratievollstreckers zu einer überaus unpassenden Zeit.</p>
        <p>Um es präziser auszudrücken, in unserem Falle zehn Minuten vor acht Uhr morgens. Dies ist für viele, wenn nicht sogar alle Schülerinnen und Schüler, wie man so schön sagt, ein schwerer Schlag ins Gesicht. Dadurch, dass die Schule so enorm früh startet, müssen Betroffene logischerweise noch viel früher aufstehen. Jedoch kann es oftmals schwer sein, noch gefühlt mitten in der Nacht das heimische Bett zu verlassen und den Schulweg anzutreten, da die Leistungsfähigkeit so früh am Morgen kaum zu unterbieten ist.</p>
        <p>In der Folge daraus resultierend sind Schülerinnen und Schüler in den ersten beiden Unterrichtsstunden meist noch so müde, dass sie schlichtweg ihre Rübe, auch Kopf genannt, auf dem Schultisch ablegen möchten.</p>
        <p>Da die Tische aber oftmals mit Kaugummis oder derlei Unannehmlichkeiten übersät sind, bereitet sich diese Aktivität als ungemein schwierig. Zudem gibt es immer wieder Lehrkräfte, die mit dem Dämmerzustand der Lernenden nicht einverstanden zu sein scheinen und sie schlicht rücksichtslos wecken und ihnen mittels dieser barbarischen Taktik ihres unweigerlich dringend verdienten und notwendigen Schlafes berauben. Möglicherweise aber erleiden die Lernenden dadurch einen erneuten Schock beziehungsweise ein physisches Trauma, sodass sie schlagartig die Kraft verlässt, sie vom Stuhl kippen und sich beim Aufprall auf den nicht allzu weichen (und keineswegs sauberen) Boden das Genick brechen könnten.</p>
    </div>
);

export function ExcerptsTabs() {
  return (
    <section id="excerpts" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold font-headline tracking-tighter sm:text-5xl">Immer noch nicht überzeugt?</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed text-balance">
              Hier sind zwei weitere Gründe, warum Sie dieses Buch brauchen. Lesen Sie kostenlos Auszüge aus zwei verschiedenen, absolut chaotischen Kapiteln.
            </p>
          </div>
        </div>
        <div className="mx-auto max-w-4xl mt-12">
            <Tabs defaultValue="chapter8" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="chapter8">Kapitel 8: Treppen-Terror</TabsTrigger>
                    <TabsTrigger value="chapter15">Kapitel 15: Morgenmuffel</TabsTrigger>
                </TabsList>
                <TabsContent value="chapter8" className="p-6 border rounded-b-lg">
                   {excerpt1}
                </TabsContent>
                <TabsContent value="chapter15" className="p-6 border rounded-b-lg">
                    {excerpt2}
                </TabsContent>
            </Tabs>
        </div>
      </div>
    </section>
  );
}
