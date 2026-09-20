"use server";

import "server-only";
import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";

type GroupApi = {
  addRecipients(groupId: string, recipients: Recipient[]): Promise<unknown>;
  getRecipients(groupId: string, options: { limit: number }): Promise<{ body: { data: Array<{ email: string; name?: string }> } }>;
};

// MailerSend's SDK does not currently provide a newsletter groups API.
// Keep the existing Firestore fallback and fail explicitly for campaigns.
function getGroupApi(client: MailerSend): GroupApi {
  const candidate = client as MailerSend & { groups?: GroupApi };
  if (!candidate.groups) throw new Error('Newsletter-Gruppen sind mit dem installierten MailerSend-SDK nicht verfügbar. Bitte zuerst einen Listenanbieter anbinden.');
  return candidate.groups;
}

let mailerSendInstance: MailerSend | null = null;
function getMailerSend() {
  if (mailerSendInstance) return mailerSendInstance;
  const apiKey = process.env.MAILERSEND_API_KEY;
  if (apiKey) {
    mailerSendInstance = new MailerSend({ apiKey });
    return mailerSendInstance;
  }
  console.warn("MAILERSEND_API_KEY is not set. MailerSend functionality will be disabled.");
  return null;
}

export async function addContact(email: string) {
  const mailerSend = getMailerSend();
  const groupId = process.env.MAILERSEND_GROUP_ID;

  if (!mailerSend || !groupId) {
    console.error("MailerSend is not configured. Missing MAILERSEND_API_KEY or MAILERSEND_GROUP_ID.");
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[DEV ONLY] Simulating MailerSend contact add for ${email}.`);
      return { id: 'dev-simulated-contact' };
    }
    throw new Error("E-Mail-Dienst ist auf dem Server nicht konfiguriert.");
  }
  
  try {
    const recipients = [new Recipient(email, "")];
    await getGroupApi(mailerSend).addRecipients(groupId, recipients);
    return { success: true };
  } catch (e: any) {
    console.error("MailerSend addContact error:", e.body || e);
    throw new Error("Fehler bei der Anmeldung zum Newsletter. Möglicherweise ist diese E-Mail bereits registriert.");
  }
}

export async function sendTransactionalEmail(to: string, subject: string, html: string, textFallback?: string) {
  const mailerSend = getMailerSend();
  if (!mailerSend) {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[DEV] Would send transactional to ${to}: ${subject}`);
      return { id: 'dev-simulated-send' };
    }
    throw new Error("MailerSend nicht konfiguriert");
  }
  const from = new Sender(process.env.MAILERSEND_FROM_EMAIL || "newsletter@paulik-reisch.de", process.env.MAILERSEND_FROM_NAME || "Paulik & Reisch");
  const recipient = [new Recipient(to, "")];
  const params = new EmailParams()
    .setFrom(from)
    .setTo(recipient)
    .setReplyTo(from)
    .setSubject(subject)
    .setHtml(html)
    .setText(textFallback || html.replace(/<[^>]*>/g, ''));
  const res = await mailerSend.email.send(params);
  return { id: res.headers?.['x-message-id'] };
}

export async function sendCampaign(subject: string, htmlContent: string) {
  const mailerSend = getMailerSend();
  const groupId = process.env.MAILERSEND_GROUP_ID;

  if (!mailerSend || !groupId) {
    console.error("MailerSend ist nicht konfiguriert. MAILERSEND_API_KEY oder MAILERSEND_GROUP_ID fehlt.");
    throw new Error("E-Mail-Dienst ist auf dem Server nicht konfiguriert.");
  }

  try {
    const { body } = await getGroupApi(mailerSend).getRecipients(groupId, { limit: 1000 });
    const recipients: Recipient[] = body.data.map((r: any) => new Recipient(r.email, r.name || ""));

    if (recipients.length === 0) {
      console.log("Keine Empfänger in der Gruppe, Kampagne nicht gesendet.");
      return { message: "Keine Empfänger gefunden." };
    }

    const sentFrom = new Sender("newsletter@paulik-reisch.de", "Paulik & Reisch");

    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setReplyTo(sentFrom)
      .setSubject(subject)
      .setHtml(htmlContent)
      .setText(htmlContent.replace(/<[^>]*>?/gm, ''));

    const response = await mailerSend.email.send(emailParams);
    
    return { id: response.headers['x-message-id'] };

  } catch (e: any) {
    console.error(`Fehler beim Senden der Kampagne:`, e.body || e);
    throw new Error(e.message || 'Konnte Kampagne nicht via MailerSend versenden.');
  }
}
