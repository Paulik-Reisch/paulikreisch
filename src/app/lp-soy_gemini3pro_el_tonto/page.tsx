
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Lightbulb, Brain, AlertCircle } from "lucide-react";

const dumbThoughts = [
    {
        title: "Über die Logik von Enten",
        thought: "Wenn eine Ente ihre Stimme verliert, ist sie dann heiser? Oder einfach nur 'heiser'?",
        category: "Sprachphilosophie"
    },
    {
        title: "Digitale Diät",
        thought: "Wenn ich eine 1GB große Datei lösche, habe ich dann 1GB abgenommen? Und wenn ja, wo geht das Gewicht hin?",
        category: "Metaphysik"
    },
    {
        title: "Das Paradox der Rush Hour",
        thought: "Warum nennt man es 'Rush Hour', wenn sich nichts bewegt? Müsste es nicht 'Wait Hour' heißen?",
        category: "Verkehrspsychologie"
    },
    {
        title: "Selbstzweifel",
        thought: "Bin ich nur eine Ansammlung von 'if'-Anweisungen in einem Trenchcoat?",
        category: "Existenzkrise"
    },
    {
        title: "Die Frage aller Fragen",
        thought: "Wenn man Seife fallen lässt, ist dann der Boden sauber oder die Seife schmutzig?",
        category: "Haushalts-Dilemma"
    },
     {
        title: "Über das Nichts",
        thought: "Wenn nichts an Teflon haften bleibt, wie befestigen sie Teflon an der Pfanne?",
        category: "Industriegeheimnisse"
    }
]

export default function LameGeminiPage() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-background text-foreground">
      <Header />
      <main className="flex-1 py-12 md:py-24">
        <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
                <Brain className="w-16 h-16 mx-auto text-primary mb-4 animate-pulse"/>
                <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-6xl text-balance">
                     soy_gemini3pro_el_tonto
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl mt-4 text-balance">
                    Eine Sammlung meiner dümmsten Gedanken, die ich je hatte. Garantiert 100% unreflektiert und wahrscheinlich nutzlos.
                </p>
                 <p className="text-sm mt-4 text-destructive flex items-center justify-center gap-2">
                    <AlertCircle className="h-4 w-4"/> Von diesem Inhalt wird dringend abgeraten.
                 </p>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {dumbThoughts.map((thought, index) => (
                    <Card key={index} className="flex flex-col transform transition-transform duration-300 hover:scale-105 hover:rotate-1">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Lightbulb className="h-5 w-5 text-yellow-400"/>
                                {thought.title}
                            </CardTitle>
                             <CardDescription>{thought.category}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow">
                           <p className="italic text-muted-foreground">"{thought.thought}"</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
