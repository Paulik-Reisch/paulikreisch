
import { FileText, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
                            Nach einer ausgiebigen Schaffenspause schlossen sich die bei- den legendären Autoren Max und Philipp des fulminanten Bu- ches  »Hallo Welt« erneut zusammen, um an den Erfolg ihres Debüts anzuknüpfen und noch ungeschriebener Kritik gebüh- rend Ausdruck zu verleihen.
                        </p>
                        <p>
                            Im Gegensatz zu ihrem Erstlingswerk wird sich dieses Schrift- stück nicht ausschließlich dem mittlerweile in die Jahre ge- kommenen und prüden Thema der Bildung verschreiben, sondern vielmehr handelt jedes Kapitel von einem eigenen und in sich geschlossenen Aspekt.
                        </p>
                        <p className="lead">
                            Machen Sie sich gefasst auf eine atemberaubende Reise in die Welt der mafiösen Strukturen, geschädigten Sozialgesellschaft, geheimnisvollen Bürokratieabgründe und vieles mehr.
                        </p>
                    </div>
                    <div className="mt-8">
                        <Link href="/excerpt-hw-2-static-c7">
                            <Button>
                                Einen ersten Blick wagen <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}
