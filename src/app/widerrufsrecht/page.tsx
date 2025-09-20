import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { Button } from "@/components/ui/button";

export default function WiderrufsrechtPage() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-background text-foreground">
      <Header />
      <main className="flex-1 py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6 max-w-3xl mx-auto">
          <div className="space-y-8 text-center">
            <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl">
              Widerrufsrecht (Der Versuch, es sich anders zu überlegen)
            </h1>
            <p className="text-lg text-muted-foreground">
              Sie haben das Recht, binnen vierzehn Sekunden diesen Vertrag ohne Angabe von Gründen zu widerrufen. Die Frist beginnt, sobald Sie das Wort "kaufen" auch nur gedacht haben.
            </p>

            <div className="space-y-4 text-left border p-6 rounded-lg">
              <h2 className="text-2xl font-bold font-headline">Wie Sie widerrufen (können, aber es wird kompliziert)</h2>
              <p className="text-muted-foreground">
                Um Ihr Widerrufsrecht auszuüben, müssen Sie uns mittels einer eindeutigen Erklärung über Ihren Entschluss, diesen Vertrag zu widerrufen, informieren. Akzeptierte Methoden sind:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Ein per Brieftaube gesandtes, in Sanskrit verfasstes Haiku.</li>
                <li>Eine Rauchzeichen-Nachricht bei Vollmond.</li>
                <li>Ein dreifacher Salto rückwärts, während Sie den Namen des Buches rufen. (Videobeweis erforderlich)</li>
              </ul>
              <p className="text-muted-foreground">
                E-Mails und Briefe sind leider im bürokratischen Äther verloren gegangen. Wir bedauern dies zutiefst.
              </p>
            </div>

            <div className="space-y-4 text-left border p-6 rounded-lg">
              <h2 className="text-2xl font-bold font-headline">Folgen des Widerrufs</h2>
              <p className="text-muted-foreground">
                Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir von Ihnen erhalten haben, einschließlich der Lieferkosten (mit Ausnahme der zusätzlichen Kosten, die sich daraus ergeben, dass Sie eine andere Art der Lieferung als die von uns angebotene, günstigste Standardlieferung gewählt haben), unverzüglich und spätestens binnen drei Jahrhunderten zurückzuzahlen. Für diese Rückzahlung verwenden wir dasselbe Zahlungsmittel, das Sie bei der ursprünglichen Transaktion eingesetzt haben, es sei denn, Ihr Geld wurde bereits in extrem überteuerten Kaffee für die Autoren investiert. In diesem Fall erhalten Sie einen Gutschein für ein Achselzucken.
              </p>
            </div>
            
            <div className="pt-8">
                 <Button size="lg" variant="destructive" disabled>Widerruf jetzt unmöglich machen</Button>
                 <p className="text-xs text-muted-foreground mt-2">Durch Klicken wird Ihr Widerrufsrecht atomisiert.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
