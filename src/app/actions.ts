'use server';

import { z } from "zod";
import { newsletterStoreEnabled } from "@/newsletter/server";

const SubscriberSchema = z.object({
  email: z.string().email("Bitte gib eine gültige E-Mail-Adresse ein."),
  source: z.string().optional(),
  consent: z.string().optional(),
});

export async function subscribeToNewsletterAction(
  prevState: { success?: boolean; error?: string; message?: string },
  formData: FormData
): Promise<{ success?: boolean; error?: string; message?: string }> {
  const rawConsent: unknown = formData.get("consent");
  const source = (formData.get("source") as string) || "unknown";
  const isFunnel = source.startsWith("funnel-");

  // Funnel sources: consent via hidden field "true" or checkbox; footer-newsletter requires explicit
  if (!isFunnel) {
    const parsed = SubscriberSchema.safeParse({
      email: formData.get("email"),
      source,
      consent: rawConsent,
    });
    // enforce consent for non-funnel
    if (!parsed.success) {
      const msg = parsed.error.issues.map((e) => e.message).join(". ");
      return { error: msg };
    }
    if (parsed.data.consent !== "true") {
      return { error: "Du musst Datenschutz & AGB akzeptieren." };
    }
  }

  const email = String(formData.get("email") || "").trim();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Bitte gib eine gültige E-Mail-Adresse ein." };
  }
  if (isFunnel && rawConsent !== "true" && rawConsent !== true) {
    // funnel hidden consent must be "true"
    // allow if source is funnel but consent missing -> still require
    const c = String(rawConsent || "");
    if (c !== "true") return { error: "Bitte stimme der Datenschutzerklärung zu." };
  }

  // No fallback to the legacy MailerSend/Firestore/Day-0/queue path. A disabled
  // new store means no newsletter registration or email side effects at all.
  if (!newsletterStoreEnabled()) {
    return { error: "Die Newsletter-Anmeldung ist gerade nicht verfügbar. Bitte versuche es später noch einmal." };
  }
  try {
    const { subscribeWithDoubleOptIn } = await import("@/newsletter/signup");
    const r = await subscribeWithDoubleOptIn({ email, source, hp: String(formData.get("website") || "") });
    if (!r.ok) return { error: "Bitte gib eine gültige E-Mail-Adresse ein." };
    return { success: true, message: "Fast geschafft: Wenn die Adresse stimmt, bekommst du gleich eine Mail mit einem Bestätigungslink." };
  } catch {
    console.error("Newsletter double opt-in failed");
    return { error: "Die Anmeldung ist gerade nicht möglich. Bitte versuche es später noch einmal." };
  }
}

export async function logEventAction(type: 'page_view' | 'newsletter_subscription' | string, userId: string, path: string, params: object = {}) {
  const { writeAnalyticsEvent } = await import("@/lib/analytics-server");
  await writeAnalyticsEvent(type, userId, path, params);
}
