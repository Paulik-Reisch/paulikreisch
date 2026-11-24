"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { Button } from "@/components/ui/button";
import styles from "@/components/landing/utility-pages.module.css";

type Step = "confirm" | "done" | "failed";

function UnsubscribeInner() {
  const params = useSearchParams();
  const token = params.get("t") || "";
  const legacyLink = params.has("email");
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
    <div className={styles.page}>
      <Header />
      <main className={styles.newsletterMain}>
        <section className={styles.newsletterPanel}>
          <p className={styles.eyebrow}>Paulik &amp; Reisch / Newsletter</p>
          {step === "confirm" && token && (
            <>
              <h1 className={styles.newsletterTitle}>Newsletter abbestellen</h1>
              <p className={styles.newsletterText}>
                Wenn Du auf den Button klickst, bekommst Du keine Newsletter-Mails mehr von uns.
              </p>
              <Button className={styles.primaryButton} onClick={unsubscribe} disabled={loading}>
                {loading ? "Wird verarbeitet…" : "Jetzt abmelden"}
              </Button>
            </>
          )}
          {step === "confirm" && !token && (
            <>
              <h1 className={styles.newsletterTitle}>{legacyLink ? "Alter Abmelde-Link" : "Abmelde-Link fehlt"}</h1>
              <p className={styles.newsletterText}>
                {legacyLink
                  ? "Dieser ältere Link enthält keinen sicheren persönlichen Schlüssel. Hier wurde noch keine Abmeldung vorgenommen."
                  : "Bitte nutze den persönlichen Abmelde-Link am Ende einer Newsletter-Mail. Ohne ihn können wir Dich nicht sicher abmelden."}
                {" "}Bitte schreib uns über das <Link href="/impressum" className="underline">Impressum</Link>, wenn Dein Link nicht funktioniert.
              </p>
            </>
          )}
          {step === "done" && (
            <>
              <h1 className={styles.newsletterTitle}>Du bist abgemeldet</h1>
              <p className={styles.newsletterText}>Du bekommst keine Newsletter-Mails mehr von uns.</p>
              <Button asChild variant="secondary" className={styles.secondaryButton}><Link href="/">Zur Startseite</Link></Button>
            </>
          )}
          {step === "failed" && (
            <>
              <h1 className={styles.newsletterTitle}>Abmeldung nicht möglich</h1>
              <p className={styles.newsletterText}>
                Der Link ist ungültig oder abgelaufen, oder der Dienst ist gerade nicht erreichbar. Bitte versuche es mit dem Link aus der neuesten Mail noch einmal.
              </p>
              <Button className={styles.secondaryButton} variant="outline" onClick={() => setStep("confirm")}>Erneut versuchen</Button>
            </>
          )}
        </section>
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
