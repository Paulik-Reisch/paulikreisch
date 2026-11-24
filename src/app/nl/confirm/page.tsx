"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { Button } from "@/components/ui/button";
import styles from "@/components/landing/utility-pages.module.css";

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
    <div className={styles.page}>
      <Header />
      <main className={styles.newsletterMain}>
        <section className={styles.newsletterPanel}>
          <p className={styles.eyebrow}>Paulik &amp; Reisch / Newsletter</p>
          {step === "confirm" && token && (
            <>
              <h1 className={styles.newsletterTitle}>Anmeldung bestätigen</h1>
              <p className={styles.newsletterText}>
                Mit einem Klick bestätigst Du, dass Du den Newsletter von Paulik &amp; Reisch per E-Mail erhalten möchtest. Abmelden geht jederzeit.
              </p>
              <Button className={styles.primaryButton} onClick={confirmSignup} disabled={loading}>
                {loading ? "Wird verarbeitet…" : "Ja, Newsletter senden"}
              </Button>
            </>
          )}
          {step === "confirm" && !token && (
            <>
              <h1 className={styles.newsletterTitle}>Bestätigungs-Link fehlt</h1>
              <p className={styles.newsletterText}>
                Bitte nutze den Link aus der Bestätigungs-Mail.
              </p>
            </>
          )}
          {step === "done" && (
            <>
              <h1 className={styles.newsletterTitle}>Anmeldung bestätigt</h1>
              <p className={styles.newsletterText}>Danke. Ab jetzt bekommst Du unseren Newsletter.</p>
              <Button asChild variant="secondary" className={styles.secondaryButton}><Link href="/">Zur Startseite</Link></Button>
            </>
          )}
          {step === "failed" && (
            <>
              <h1 className={styles.newsletterTitle}>Bestätigung nicht möglich</h1>
              <p className={styles.newsletterText}>
                Der Link ist ungültig oder abgelaufen, oder der Dienst ist gerade nicht erreichbar. Bitte fordere auf der Website eine neue Bestätigungs-Mail an.
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

export default function ConfirmPage() {
  return (
    <Suspense fallback={null}>
      <ConfirmInner />
    </Suspense>
  );
}
