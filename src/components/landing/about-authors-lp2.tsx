
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, PenTool } from "lucide-react";

export function AboutAuthorsLP2() {
  return (
    <section id="about-authors" className="w-full py-12 md:py-16 bg-background">
      <div className="container px-4 md:px-6 animate-in fade-in-0 slide-in-from-top-12 duration-1000">
        <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Über die Autoren</div>
                <h2 className="text-3xl font-bold font-headline tracking-tighter sm:text-4xl">Die Könige der Kritik</h2>
                <p className="text-muted-foreground md:text-lg/relaxed text-balance">
                    Philipp Paulik und Maximilian Reisch sind zwei furchtlose Schriftsteller, die den Fehler machten, hinzuschauen. Angetrieben von der Wut über zu viele Bahnfahrten, klemmen sie sich genau dorthin, wo es am meisten stinkt.
                </p>
                <p className="text-muted-foreground md:text-lg/relaxed text-balance">
                    Glück für Sie, denn jetzt müssen Sie nicht mehr alleine leiden. Das haben die beiden schon erledigt und in dieses Buch gepackt.
                </p>
            </div>
            <div className="space-y-6">
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3"><PenTool className="h-5 w-5 text-primary"/> Mitwirkende</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm space-y-3">
                        <div>
                            <h4 className="font-semibold">Namentlich Erwähnte:</h4>
                            <p className="text-muted-foreground">P. Paulik, M. Reisch</p>
                        </div>
                         <div>
                            <h4 className="font-semibold">Anderweitig Erwähnte:</h4>
                            <p className="text-muted-foreground">Dilettanten und Troglodyten, Ratten und Insekten, Senioren, Sesselfurzer, limitierte Teilmengen der rar gesäten intellektuellen Menschen</p>
                        </div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3"><Users className="h-5 w-5 text-primary"/> Erfundene Studien</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm">
                        <p className="text-muted-foreground">Mietspiegel 2025/26 des Instituts für Wohnraum- und Mietwucherforschung (IWMF)</p>
                    </CardContent>
                </Card>
            </div>
        </div>
      </div>
    </section>
  );
}
