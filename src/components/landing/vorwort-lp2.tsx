
import { FileText } from "lucide-react";

export function VorwortLP2() {
    return (
        <section id="vorwort" className="w-full py-12 md:py-16 bg-muted/40">
            <div className="container px-4 md:px-6 animate-in fade-in-0 slide-in-from-top-12 duration-1000">
                <div className="mx-auto max-w-3xl text-center">
                    <FileText className="mx-auto h-12 w-12 text-primary" />
                    <h2 className="mt-4 text-3xl font-bold font-headline tracking-tighter sm:text-4xl">
                        Ein Wort vorweg von den Autoren
                    </h2>
                    <div className="mt-6 prose prose-lg dark:prose-invert mx-auto text-left">
                        <p>
                            Nach einer ausgiebigen Schaffenspause schlossen sich die beiden legendären Autoren Max und Philipp des fulminanten Buches »Hallo Welt« erneut zusammen, um an den Erfolg ihres Debüts anzuknüpfen und noch ungeschriebener Kritik gebührend Ausdruck zu verleihen.
                        </p>
                        <p>
                            Im Gegensatz zu ihrem Erstlingswerk wird sich dieses Schriftstück nicht ausschließlich dem mittlerweile in die Jahre gekommenen und prüden Thema der Bildung verschreiben, sondern vielmehr handelt jedes Kapitel von einem eigenen und in sich geschlossenen Aspekt.
                        </p>
                        <p className="lead">
                            Machen Sie sich gefasst auf eine atemberaubende Reise in die Welt der mafiösen Strukturen, geschädigten Sozialgesellschaft, geheimnisvollen Bürokratieabgründe und vieles mehr.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}
