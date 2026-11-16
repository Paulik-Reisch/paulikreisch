"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { Button } from "@/components/ui/button";

type Step = "confirm" | "done" | "failed";

function UnsubscribeInner() {
  const token = useSearchParams().get("t") || "";
  const [step, setStep] = useState<Step>("confirm");
  const [loading, setLoading] = useState(false);

  async function unsubscribe() {
    setLoading(true);
    try {
      const res = await fetch("/nl/unsubscribe/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await res.json().catch(() => ({ ok: false }));
      setStep(res.ok && data.ok ? "done" : "failed");
    } catch {
      setStep("failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col min-h-[100dvh] bg-background text-foreground">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-[520px] text-center">
          {step === "confirm" && token && (
            <>
              <h1 className="font-headline text-3xl font-bold">Newsletter abbestellen</h1>
              <p className="mt-3 text-muted-foreground text-balance">
                Wenn du auf den Button klickst, bekommst du keine Newsletter-Mails mehr von uns.
              </p>
              <Button className="mt-6 w-full" onClick={unsubscribe} disabled={loading}>
                {loading ? "Wird verarbeitet…" : "Jetzt abmelden"}
              </Button>
            </>
          )}
          {step === "confirm" && !token && (
            <>
              <h1 className="font-headline text-3xl font-bold">Abmelde-Link fehlt</h1>
              <p className="mt-3 text-muted-foreground text-balance">
                Bitte nutze den Abmelde-Link am Ende einer Newsletter-Mail. Ohne ihn können wir dich nicht sicher abmelden.
                Schreib uns sonst über das Impressum.
              </p>
            </>
          )}
          {step === "done" && (
            <>
              <h1 className="font-headline text-3xl font-bold">Du bist abgemeldet</h1>
              <p className="mt-3 text-muted-foreground text-balance">Du bekommst keine Newsletter-Mails mehr von uns.</p>
              <Link href="/"><Button variant="secondary" className="mt-6">Zur Startseite</Button></Link>
            </>
          )}
          {step === "failed" && (
            <>
              <h1 className="font-headline text-3xl font-bold">Abmeldung nicht möglich</h1>
              <p className="mt-3 text-muted-foreground text-balance">
                Der Link ist ungültig oder abgelaufen, oder der Dienst ist gerade nicht erreichbar. Bitte versuche es mit dem Link aus der neuesten Mail noch einmal.
              </p>
              <Button className="mt-6" variant="outline" onClick={() => setStep("confirm")}>Erneut versuchen</Button>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <Suspense fallback={null}>
      <UnsubscribeInner />
    </Suspense>
  );
}
