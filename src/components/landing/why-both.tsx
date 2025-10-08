import { CheckCircle, PlusCircle, SmilePlus } from "lucide-react";

export function WhyBoth() {
  return (
    <section id="why-both" className="w-full py-8 md:py-8 bg-muted/40">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold font-headline tracking-tighter sm:text-5xl">Warum Sie beide Bücher brauchen</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed text-balance">
              Nur ein Buch zu lesen ist wie nur einen Schuh anzuziehen. Es funktioniert, aber jeder wird Sie komisch ansehen.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 mt-12">
          <div className="grid gap-4 text-center p-4">
            <CheckCircle className="h-12 w-12 mx-auto text-primary" />
            <h3 className="text-xl font-bold font-headline">Vollständige Verwirrung</h3>
            <p className="text-sm text-muted-foreground text-balance">
              Verstehen Sie das ganze Ausmaß des Chaos. Die Handlungsstränge sind so lose verknüpft, dass Sie sich fragen werden, ob es überhaupt welche gibt.
            </p>
          </div>
          <div className="grid gap-4 text-center p-4">
            <PlusCircle className="h-12 w-12 mx-auto text-primary" />
            <h3 className="text-xl font-bold font-headline">Doppelte Dosis Sarkasmus</h3>
            <p className="text-sm text-muted-foreground text-balance">
              Verdoppeln Sie die Anzahl der inneren Monologe und sarkastischen Bemerkungen. Ihr Zynismus-Level wird es Ihnen danken.
            </p>
          </div>
          <div className="grid gap-4 text-center p-4">
            <SmilePlus className="h-12 w-12 mx-auto text-primary" />
            <h3 className="text-xl font-bold font-headline">Unterstützen Sie die Autoren</h3>
            <p className="text-sm text-muted-foreground text-balance">
              Helfen Sie Philipp und Max, ihre Sucht nach überteuertem Kaffee zu finanzieren, damit sie noch mehr von diesem Unsinn schreiben können.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
