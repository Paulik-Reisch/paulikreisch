"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { Button } from "@/components/ui/button";

type Step = "confirm" | "done" | "failed";

function ConfirmInner() {
  const token = useSearchParams().get("t") || "";
  const [step, setStep] = useState<Step>("confirm");
  const [loading, setLoading] = useState(false);

  async function confirmSignup() {
    setLoading(true);
    try {
      const res = await fetch("/nl/confirm/submit", {
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
              <h1 className="font-headline text-3xl font-bold">Anmeldung bestätigen</h1>
              <p className="mt-3 text-muted-foreground text-balance">
                Mit einem Klick bestätigst du, dass du den Newsletter von Paulik &amp; Reisch per E-Mail erhalten möchtest (ca. einmal pro Woche). Abmelden geht jederzeit.
              </p>
              <Button className="mt-6 w-full" onClick={confirmSignup} disabled={loading}>
                {loading ? "Wird verarbeitet…" : "Ja, Newsletter senden"}
              </Button>
            </>
          )}
          {step === "confirm" && !token && (
            <>
              <h1 className="font-headline text-3xl font-bold">Bestätigungs-Link fehlt</h1>
              <p className="mt-3 text-muted-foreground text-balance">
                Bitte nutze den Link aus der Bestätigungs-Mail.
              </p>
            </>
          )}
          {step === "done" && (
            <>
              <h1 className="font-headline text-3xl font-bold">Anmeldung bestätigt</h1>
              <p className="mt-3 text-muted-foreground text-balance">Danke. Ab jetzt bekommst du unseren Newsletter.</p>
              <Link href="/"><Button variant="secondary" className="mt-6">Zur Startseite</Button></Link>
            </>
          )}
          {step === "failed" && (
            <>
              <h1 className="font-headline text-3xl font-bold">Bestätigung nicht möglich</h1>
              <p className="mt-3 text-muted-foreground text-balance">
                Der Link ist ungültig oder abgelaufen, oder der Dienst ist gerade nicht erreichbar. Bitte fordere auf der Website eine neue Bestätigungs-Mail an.
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

export default function ConfirmPage() {
  return (
    <Suspense fallback={null}>
      <ConfirmInner />
    </Suspense>
  );
}
