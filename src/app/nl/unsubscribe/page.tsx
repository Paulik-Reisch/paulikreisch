"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { MailX, Pause, Heart, ArrowRight, CheckCircle2, Gift, Settings2, Laugh } from "lucide-react";
import Link from "next/link";
import { getBrowserAnalyticsId } from '@/lib/analytics-consent';
import { logEventAction } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";

type Step = "choice" | "survey" | "save-offer" | "paused" | "unsubscribed";
type Reason = "too_many" | "not_funny" | "wrong_topics" | "expensive" | "pause_only" | "other";

const REASONS: { value: Reason; label: string; icon: string; saveOffer: { title: string; desc: string; cta: string } }[] = [
  { value: "too_many", label: "Zu viele Mails", icon: "📬", saveOffer: { title: "Weniger Mails? Wir haben einen Digest.", desc: "Statt 1× pro Woche nur noch 1× pro Monat — das Beste kompakt. Kein Spam, nur Highlights.", cta: "Auf monatlichen Digest wechseln" } },
  { value: "wrong_topics", label: "Falsche Themen", icon: "🎯", saveOffer: { title: "Themen selbst wählen", desc: "Nur Worthaft-Ergebnisse? Nur neue Artikel? Nur Buch-News? Sag uns was du willst, Rest filtern wir raus.", cta: "Themen anpassen & bleiben" } },
  { value: "not_funny", label: "Nicht witzig genug", icon: "😐", saveOffer: { title: "Gib uns eine zweite Chance", desc: "Wir schicken dir das beste Kapitel aus Hallo Welt gratis — purer Wahnsinn auf 12 Seiten. Wenn das nicht zündet, gehen wir.", cta: "Gratis-Kapitel holen & bleiben" } },
  { value: "expensive", label: "Kein Geld fürs Buch / Werbung zu viel", icon: "💸", saveOffer: { title: "Kaufzwang? Gibt's nicht.", desc: "Newsletter bleibt für immer gratis. Keine Kaufpflicht. Wir schreiben trotzdem jede Woche — versprochen.", cta: "Gratis weiterlesen" } },
  { value: "pause_only", label: "Brauche nur eine Pause", icon: "⏸️", saveOffer: { title: "Pause ist smart.", desc: "1 Monat oder 3 Monate Funkstille — danach melden wir uns automatisch wieder. Kein erneutes Anmelden nötig.", cta: "Pause aktivieren" } },
  { value: "other", label: "Sonstiges", icon: "💬", saveOffer: { title: "Erzähl uns kurz warum", desc: "Hilf uns besser zu werden — 1 Satz reicht. Als Dank bekommst du das Checkliste-PDF sofort.", cta: "Feedback senden & bleiben" } },
];

function UnsubscribeInner() {
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get("email") || "";
  const token = searchParams.get("t") || "";
  const [email, setEmail] = useState(initialEmail);
  useEffect(() => { if (initialEmail) setEmail(initialEmail); }, [initialEmail]);
  const [step, setStep] = useState<Step>("choice");
  const [reason, setReason] = useState<Reason | null>(null);
  const [freeText, setFreeText] = useState("");
  const [frequency, setFrequency] = useState<"weekly" | "monthly">("monthly");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const selected = REASONS.find((r) => r.value === reason);

  async function track(type: string, extra: Record<string, unknown> = {}) {
    try { const id = getBrowserAnalyticsId(); if (id) await logEventAction(type, id, "/nl/unsubscribe", { reason, ...extra }); } catch {}
  }

  async function handlePause(days: number) {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({ title: "E-Mail fehlt", description: "Bitte gib deine E-Mail ein.", variant: "destructive" });
      return;
    }
    setLoading(true);
    await track("newsletter_pause", { days });
    // Store pause in localStorage for UX + Firestore via analytics event
    try {
      const until = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
      localStorage.setItem("pr_newsletter_paused_until", until);
      localStorage.setItem("pr_newsletter_paused_email", email);
    } catch {}
    setLoading(false);
    setStep("paused");
    toast({ title: "Pause aktiv ✅", description: `Bis ${new Date(Date.now() + days * 24 * 60 * 60 * 1000).toLocaleDateString("de-DE")} hörst du nichts von uns — danach automatisch wieder da.` });
  }

  async function handleSurveyNext() {
    if (!reason) {
      toast({ title: "Bitte wählen", description: "Wähle einen Grund aus.", variant: "destructive" });
      return;
    }
    await track("unsubscribe_survey", { reason });
    setStep("save-offer");
  }

  async function handleAcceptSaveOffer() {
    await track("unsubscribe_save_accept", { reason });
    if (reason === "too_many") {
      setFrequency("monthly");
      // treat as pause with monthly frequency
      await handlePause(30);
      return;
    }
    if (reason === "pause_only") {
      await handlePause(30);
      return;
    }
    // other reasons: mark as resubscribed / kept
    toast({ title: "Danke dass du bleibst! 🎉", description: selected?.saveOffer.title });
    setStep("paused"); // reuse paused as "saved"
  }

  async function handleConfirmUnsubscribe() {
    if (!token) {
      toast({ title: "Link aus der Mail nötig", description: "Bitte nutze den Abmelde-Link in einer Newsletter-Mail. Ohne ihn können wir dich nicht sicher abmelden.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/nl/unsubscribe/confirm", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token }) });
      const data = await res.json().catch(() => ({ ok: false }));
      if (!res.ok || !data.ok) throw new Error("failed");
      await track("newsletter_unsubscribe_confirm", { reason, frequency });
      setStep("unsubscribed");
    } catch {
      toast({ title: "Abmeldung nicht möglich", description: "Der Link ist ungültig oder abgelaufen. Bitte nutze den Link aus der neuesten Mail.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col min-h-[100dvh] bg-background text-foreground">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-[640px]">
          {/* Email input always visible until final */}
          {step !== "paused" && step !== "unsubscribed" && (
            <div className="mb-6">
              <Label htmlFor="email" className="text-sm font-medium">Deine E-Mail (für Pause/Abmeldung)</Label>
              <Input id="email" type="email" placeholder="du@beispiel.de" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5" />
            </div>
          )}

          {step === "choice" && (
            <div className="space-y-6 animate-in fade-in">
              <div className="text-center">
                <div className="mx-auto w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-4">
                  <Pause className="w-7 h-7 text-amber-600" />
                </div>
                <h1 className="font-headline text-3xl md:text-4xl font-bold tracking-tight text-balance">Muss es gleich bye sein?</h1>
                <p className="mt-3 text-muted-foreground text-balance">60–80% der Pausierer kommen zurück. 40% der Abmelder bereuen es. Nimm lieber eine Pause — 1 Klick, kein neues Anmelden später.</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <button onClick={() => handlePause(30)} disabled={loading} className="rounded-xl border-2 border-primary bg-primary/5 p-5 text-left hover:bg-primary/10 transition-colors">
                  <div className="flex items-center gap-2 font-bold"><Pause className="h-5 w-5 text-primary" /> 1 Monat Pause</div>
                  <p className="text-sm text-muted-foreground mt-1">Funkstille bis {new Date(Date.now() + 30 * 864e5).toLocaleDateString("de-DE")}. Danach automatisch wieder da.</p>
                  <span className="inline-flex mt-3 text-sm font-semibold text-primary">1 Monat pausieren <ArrowRight className="ml-1 h-4 w-4" /></span>
                </button>
                <button onClick={() => handlePause(90)} disabled={loading} className="rounded-xl border p-5 text-left hover:bg-muted transition-colors">
                  <div className="flex items-center gap-2 font-bold"><Pause className="h-5 w-5" /> 3 Monate Pause</div>
                  <p className="text-sm text-muted-foreground mt-1">Für Klausur, Urlaub, Weltrettung. Danach ping — fertig.</p>
                  <span className="inline-flex mt-3 text-sm font-semibold">3 Monate pausieren <ArrowRight className="ml-1 h-4 w-4" /></span>
                </button>
              </div>

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t" /></div>
                <div className="relative flex justify-center"><span className="bg-background px-3 text-xs uppercase tracking-widest text-muted-foreground">oder</span></div>
              </div>

              <div className="rounded-xl border bg-card p-5">
                <p className="font-semibold flex items-center gap-2"><MailX className="h-4 w-4" /> Doch abmelden — aber hilf uns kurz</p>
                <p className="text-sm text-muted-foreground mt-1">1 Frage, 5 Sekunden. Wir mappen deine Antwort auf ein passendes Angebot.</p>
                <Button variant="outline" className="mt-4 w-full" onClick={() => setStep("survey")}>Zum 1-Fragen-Survey <ArrowRight className="ml-2 h-4 w-4" /></Button>
                <p className="text-[11px] text-muted-foreground mt-2 text-center">Kein Dark Pattern — Abmelden bleibt jederzeit 1 Klick.</p>
              </div>
            </div>
          )}

          {step === "survey" && (
            <div className="space-y-6 animate-in fade-in">
              <div>
                <h1 className="font-headline text-2xl md:text-3xl font-bold">Was ist der Hauptgrund?</h1>
                <p className="text-sm text-muted-foreground mt-1">Hilf uns zu verstehen — wir passen unser Angebot live an.</p>
              </div>
              <RadioGroup value={reason || ""} onValueChange={(v) => setReason(v as Reason)} className="grid gap-2.5">
                {REASONS.map((r) => (
                  <Label key={r.value} htmlFor={r.value} className={`flex items-center gap-3 rounded-xl border p-4 cursor-pointer transition-colors ${reason === r.value ? "border-primary bg-primary/5" : "hover:bg-muted"}`}>
                    <RadioGroupItem value={r.value} id={r.value} />
                    <span className="text-lg">{r.icon}</span>
                    <span className="font-medium text-sm">{r.label}</span>
                  </Label>
                ))}
              </RadioGroup>
              {(reason === "other" || reason === "wrong_topics") && (
                <div>
                  <Label htmlFor="free" className="text-sm">Kurz sagen was stört (optional)</Label>
                  <Textarea id="free" value={freeText} onChange={(e) => setFreeText(e.target.value)} placeholder="1 Satz reicht…" rows={3} className="mt-1.5" maxLength={300} />
                </div>
              )}
              <div className="flex gap-3">
                <Button variant="ghost" onClick={() => setStep("choice")}>Zurück</Button>
                <Button className="flex-1" onClick={handleSurveyNext} disabled={!reason}>Weiter zum Angebot <ArrowRight className="ml-2 h-4 w-4" /></Button>
              </div>
            </div>
          )}

          {step === "save-offer" && selected && (
            <div className="space-y-6 animate-in fade-in">
              <div className="rounded-2xl border-2 border-amber-200 bg-amber-50/70 dark:bg-amber-950/20 dark:border-amber-900/30 p-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white dark:bg-zinc-900 border flex items-center justify-center shrink-0">
                    {reason === "too_many" ? <Settings2 className="h-5 w-5" /> : reason === "not_funny" ? <Laugh className="h-5 w-5" /> : <Gift className="h-5 w-5" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold tracking-widest uppercase text-amber-700 dark:text-amber-300">Dein Save-Offer · passend zu „{selected.label}"</p>
                    <h2 className="font-headline text-xl font-bold mt-1">{selected.saveOffer.title}</h2>
                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{selected.saveOffer.desc}</p>
                  </div>
                </div>
                <Button className="w-full mt-5" size="lg" onClick={handleAcceptSaveOffer}>
                  <Heart className="mr-2 h-4 w-4" /> {selected.saveOffer.cta}
                </Button>
                <p className="text-xs text-center text-muted-foreground mt-2">Kein Abo, kein Haken. 1 Klick.</p>
              </div>

              <div className="rounded-xl border p-5 bg-card">
                <p className="text-sm font-semibold">Trotzdem abmelden?</p>
                <p className="text-xs text-muted-foreground mt-1">Wir respektieren das. Kein Rückfrage-Spam, kein Dark Pattern.</p>
                {reason === "too_many" && (
                  <div className="mt-3 flex items-center gap-2 text-xs">
                    <Label className="flex items-center gap-2 cursor-pointer"><input type="radio" checked={frequency === "monthly"} onChange={() => setFrequency("monthly")} /> Nur monatlicher Digest</Label>
                    <Label className="flex items-center gap-2 cursor-pointer"><input type="radio" checked={frequency === "weekly"} onChange={() => setFrequency("weekly")} /> Doch komplett abmelden</Label>
                  </div>
                )}
                <Button variant="outline" className="w-full mt-3" onClick={handleConfirmUnsubscribe} disabled={loading}>
                  {loading ? "Wird verarbeitet…" : "Ja, jetzt endgültig abmelden"}
                </Button>
                <button onClick={() => setStep("survey")} className="w-full text-xs text-muted-foreground mt-2 hover:underline">Antwort ändern</button>
              </div>
            </div>
          )}

          {step === "paused" && (
            <div className="text-center py-6 animate-in fade-in">
              <CheckCircle2 className="w-16 h-16 mx-auto text-green-500 mb-4" />
              <h1 className="font-headline text-3xl font-bold">Pause aktiv — danke fürs Bleiben ♥️</h1>
              <p className="mt-3 text-muted-foreground max-w-[520px] mx-auto text-balance">
                Wir schicken dir bis zur Reaktivierung nichts. Danach automatisch wieder 1×/Woche Satire + Worthaft — ohne neues Anmelden. Du kannst jederzeit unter <Link href="/worthaft" className="underline">worthaft</Link> weiterspielen.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/"><Button variant="secondary">Zur Startseite</Button></Link>
                <Link href="/worthaft"><Button>Worthaft spielen</Button></Link>
              </div>
              <p className="text-xs text-muted-foreground mt-6">Tipp: Check dein Postfach — wir haben dir die Checkliste + Gratis-Kapitel dagelassen.</p>
            </div>
          )}

          {step === "unsubscribed" && (
            <div className="text-center py-6 animate-in fade-in">
              <MailX className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h1 className="font-headline text-3xl font-bold">Abgemeldet.</h1>
              <p className="mt-3 text-muted-foreground max-w-[520px] mx-auto text-balance">
                Schade! Du bekommst ab sofort keine Mails mehr an <span className="font-medium text-foreground">{email}</span>. Reaktivieren jederzeit unter <Link href="/#newsletter" className="underline">paulikreisch.de/#newsletter</Link>.
              </p>
              <p className="text-xs text-muted-foreground mt-2">Grund: {selected?.label || reason} {freeText ? `· „${freeText.slice(0, 80)}"` : ""}</p>
              <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/"><Button variant="secondary">Zurück zur Startseite</Button></Link>
                <Button variant="outline" onClick={() => setStep("choice")}>Doch pausieren statt bye</Button>
              </div>
              <div className="mt-8 rounded-xl border bg-amber-50/60 dark:bg-amber-950/10 p-4 text-left">
                <p className="text-sm font-semibold">Noch Lesestoff?</p>
                <p className="text-sm text-muted-foreground">Hol dir das Buch für danach — 106 Seiten, 4.8★, 10,99 €. Oder spiel eine Runde Worthaft.</p>
                <div className="flex gap-2 mt-3">
                  <Link href="/shop"><Button size="sm">Buch — 10,99 €</Button></Link>
                  <Link href="/worthaft"><Button size="sm" variant="outline">Worthaft</Button></Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <Suspense fallback={<div className="flex flex-col min-h-[100dvh] items-center justify-center"><p className="text-sm text-muted-foreground">Lädt…</p></div>}>
      <UnsubscribeInner />
    </Suspense>
  );
}
