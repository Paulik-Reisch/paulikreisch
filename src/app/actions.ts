'use server';

import { z } from "zod";
import { addSubscriber } from "@/lib/firestore";
import { addContact, sendTransactionalEmail } from "@/lib/resend";
import { funnelEmails } from "@/lib/funnel-emails";

const SubscriberSchema = z.object({
  email: z.string().email("Bitte geben Sie eine gültige E-Mail-Adresse ein."),
  source: z.string().optional(),
  consent: z.string().optional(),
});

export async function subscribeToNewsletterAction(
  prevState: { success?: boolean; error?: string; message?: string },
  formData: FormData
) {
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
      const msg = parsed.error.errors.map((e) => e.message).join(". ");
      return { error: msg };
    }
    if (parsed.data.consent !== "true") {
      return { error: "Sie müssen Datenschutz & AGB akzeptieren." };
    }
  }

  const email = String(formData.get("email") || "").trim();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Bitte geben Sie eine gültige E-Mail-Adresse ein." };
  }
  if (isFunnel && rawConsent !== "true" && rawConsent !== true) {
    // funnel hidden consent must be "true"
    // allow if source is funnel but consent missing -> still require
    const c = String(rawConsent || "");
    if (c !== "true") return { error: "Bitte stimmen Sie der Datenschutzerklärung zu." };
  }

  try {
    await addContact(email);
  } catch (e) {
    console.error("MailerSend addContact failed, fallback to Firestore", e);
  }

  try {
    await addSubscriber({ email, source });
  } catch (e: any) {
    console.error("Firestore addSubscriber failed", e);
    return { error: e?.message || "Anmeldung fehlgeschlagen." };
  }

  // Day 0 transactional: checklist + bonus (only for funnel sources)
  if (isFunnel) {
    try {
      const checklistUrl = "https://paulikreisch.de/checkliste-lernvollzugsanstalt.pdf";
      const shopUrl = "https://paulikreisch.de/shop";
      const { subject, html } = funnelEmails.day0;
      const htmlContent = html({ checklistUrl, shopUrl });
      await sendTransactionalEmail(email, subject, htmlContent);
    } catch (e) {
      console.error("Day0 mail failed (non-blocking)", e);
    }
    // also queue future mails as Firestore docs for cron/manual send
    try {
      const { addDocument } = await import("@/lib/firestore");
      const now = Date.now();
      const schedule = [
        { day: "day1", delayMs: 1 * 24 * 60 * 60 * 1000 },
        { day: "day3", delayMs: 3 * 24 * 60 * 60 * 1000 },
        { day: "day5", delayMs: 5 * 24 * 60 * 60 * 1000 },
        { day: "day7", delayMs: 7 * 24 * 60 * 60 * 1000 },
      ];
      for (const s of schedule) {
        await addDocument("funnel_queue", {
          email,
          source,
          day: s.day,
          scheduledAt: new Date(now + s.delayMs).toISOString(),
          sent: false,
          createdAt: new Date().toISOString(),
        }, "system-funnel");
      }
    } catch (e) {
      console.error("Funnel queue failed", e);
    }
  }

  return { success: true, message: `Wir haben eine Bestätigungs-E-Mail an ${email} gesendet.` };
}

export async function logEventAction(type: 'page_view' | 'newsletter_subscription' | string, userId: string, path: string, params: object = {}) {
  const { logAnalyticsEvent } = await import("@/lib/firestore");
  await logAnalyticsEvent(type, path, userId, params);
}
