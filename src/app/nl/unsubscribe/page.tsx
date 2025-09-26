import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { Button } from "@/components/ui/button";
import { MailX } from "lucide-react";
import Link from "next/link";

export default function UnsubscribePage() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-background text-foreground">
      <Header />
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center p-8">
            <MailX className="w-24 h-24 mx-auto text-destructive mb-8"/>
            <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-6xl text-balance">
                Sie wurden (fast) abgemeldet.
            </h1>
            <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl mt-4 text-balance">
                In einer perfekten Welt würde dieser Klick Sie von unserem Newsletter befreien. Aber da Perfektion langweilig ist, dient diese Seite nur zur Beruhigung Ihres Gewissens.
            </p>
            <p className="text-sm text-muted-foreground mt-2">(In einer echten Anwendung wären Sie jetzt abgemeldet. Versprochen.)</p>
            <Link href="/" className="mt-8 inline-block">
                <Button variant="secondary">Zurück zur Startseite (und zum Wahnsinn)</Button>
            </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
