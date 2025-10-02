import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function RisitasLegalesPage() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-background text-foreground">
      <Header />
      <main className="flex-1 py-12 md:py-24">
        <div className="container px-4 md:px-6">
            <article className="prose prose-lg dark:prose-invert mx-auto">
                <div className="text-center mb-12">
                    <ShieldAlert className="w-16 h-16 mx-auto text-muted-foreground mb-4"/>
                    <h1>Rechtsbelehrung – Externe Medien</h1>
                    <p className="lead">Hinweise zur Einbettung von YouTube-Inhalten.</p>
                </div>

                <p>
                    Auf dieser Seite werden Inhalte von externen Plattformen, insbesondere YouTube, eingebettet. Durch die Interaktion mit diesen Inhalten stimmen Sie den Nutzungsbedingungen und Datenschutzrichtlinien der jeweiligen Plattform zu.
                </p>
                
                <h2>Urheberrechtshinweis</h2>
                <p>
                    Das eingebettete Video unterliegt dem Urheberrecht des jeweiligen Erstellers. Die Rechte für den gezeigten Inhalt liegen bei:
                </p>
                 <blockquote className="text-center">
                    <p>© RAVE_ZERO — YouTube</p>
                </blockquote>
                <p>
                    Wir erheben keinen Anspruch auf das Video und nutzen die Einbettungsfunktion von YouTube im Rahmen der von der Plattform bereitgestellten Möglichkeiten.
                </p>
                 <div className="text-center mt-12 not-prose">
                    <Link href="/lp-risitas">
                        <Button variant="secondary" size="lg">Ich habe verstanden und möchte zurück</Button>
                    </Link>
                </div>
            </article>
        </div>
      </main>
      <Footer />
    </div>
  );
}
