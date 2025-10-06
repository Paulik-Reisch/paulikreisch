

"use server";

import { z } from "zod";
import {
  updateNewsletter,
  deleteNewsletter,
  addNewsletter,
  duplicateNewsletter,
  getAdminCredentials,
  addTagsToSubscribers,
  getSubscribers,
  getNewsletter,
  Subscriber,
  addCampaign,
  updateLegalPage,
  addPalabrota,
  updatePalabrota,
  deletePalabrota,
  updateExcerpt,
  addLog,
} from "@/lib/firestore";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { encrypt, getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { Resend } from 'resend';


const LoginSchema = z.object({
    username: z.string().min(1, "Benutzername ist erforderlich."),
    password: z.string().min(1, "Passwort ist erforderlich."),
});

export type LoginState = {
    success: boolean;
    error: string | null;
};

export async function loginAction(
    prevState: LoginState,
    formData: FormData
): Promise<LoginState> {
    const validatedFields = LoginSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
        const errorMessages = validatedFields.error.errors.map(e => e.message).join('. ');
        return { success: false, error: errorMessages };
    }
    
    const { username, password } = validatedFields.data;
    const credentials = await getAdminCredentials();

    if (!credentials) {
        return { success: false, error: "Admin-Zugangsdaten sind in der Datenbank nicht konfiguriert." };
    }

    const userPassword = credentials[username];

    if (!userPassword || userPassword !== password) {
        await addLog(username, 'Login fehlgeschlagen', `Falsches Passwort für Benutzer '${username}'`);
        return { success: false, error: "Falscher Benutzername oder Passwort." };
    }

    // Create session
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    const session = await encrypt({ user: { id: username }, expires });

    cookies().set("session", session, { expires, httpOnly: true });

    await addLog(username, 'Login erfolgreich', `Benutzer '${username}' hat sich angemeldet.`);
    revalidatePath("/admin");
    redirect('/admin');
}

export async function logoutAction() {
    const session = await getSession();
    const user = session?.user.id || 'Unbekannt';
    cookies().set("session", "", { expires: new Date(0) });
    await addLog(user, 'Logout', `Benutzer '${user}' hat sich abgemeldet.`);
    redirect('/login');
}

// Newsletter Editor Actions
export type AdminNewsletterState = {
  success: boolean;
  error?: string | null;
  message?: string;
  newNewsletterId?: string;
};

const initialNewsletterState: AdminNewsletterState = { success: false, error: null };

const AddNewsletterSchema = z.object({
  name: z.string().min(1, "Name ist erforderlich."),
  subject: z.string().min(1, "Betreff ist erforderlich."),
});

export async function addNewsletterAction(
  prevState: AdminNewsletterState,
  formData: FormData
): Promise<AdminNewsletterState> {
  const session = await getSession();
  if (!session) {
    return { success: false, error: "Nicht authentifiziert" };
  }

  const validatedFields = AddNewsletterSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    const errorMessages = validatedFields.error.errors.map((e) => e.message).join(". ");
    return { success: false, error: errorMessages };
  }

  try {
    const newId = await addNewsletter(validatedFields.data, session.user.id);
    revalidatePath("/admin");
    return { success: true, message: "Newsletter erfolgreich erstellt.", newNewsletterId: newId };
  } catch (e) {
    const error = e as Error;
    return { success: false, error: error.message };
  }
}

const UpdateNewsletterSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  subject: z.string().optional(),
  components: z.string().optional(), // components will be passed as a JSON string
  content: z.string().optional(), // Final HTML content
  useWrapper: z.string().optional(),
});

export async function updateNewsletterAction(
  prevState: AdminNewsletterState,
  formData: FormData
): Promise<AdminNewsletterState> {
   const session = await getSession();
   if (!session) {
    return { success: false, error: "Nicht authentifiziert" };
   }

  const validatedFields = UpdateNewsletterSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    const errorMessages = validatedFields.error.errors.map((e) => e.message).join(". ");
    return { success: false, error: errorMessages };
  }
  
  try {
    const { id, components, useWrapper, ...rest } = validatedFields.data;
    const dataToUpdate: any = { ...rest };
    
    if (components) {
        dataToUpdate.components = JSON.parse(components);
    }
    if (useWrapper) {
        dataToUpdate.useWrapper = useWrapper === 'true';
    }
    
    await updateNewsletter(id, dataToUpdate, session.user.id);
    revalidatePath("/admin");
    revalidatePath(`/admin/nle/${id}`);
    revalidatePath(`/nl/preview/${id}`);
    return { success: true, message: "Newsletter erfolgreich aktualisiert." };
  } catch (e) {
    const error = e as Error;
    return { success: false, error: "Fehler beim Aktualisieren: " + error.message };
  }
}


const DeleteNewsletterSchema = z.object({
  id: z.string(),
});

export async function deleteNewsletterAction(
  prevState: AdminNewsletterState,
  formData: FormData
): Promise<AdminNewsletterState> {
  const session = await getSession();
  if (!session) {
    return { success: false, error: "Nicht authentifiziert" };
  }

  const validatedFields = DeleteNewsletterSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return { success: false, error: "Ungültige Newsletter-ID." };
  }
  
  try {
    await deleteNewsletter(validatedFields.data.id, session.user.id);
    revalidatePath("/admin");
    return { success: true, message: "Newsletter wurde gelöscht." };
  } catch (e) {
    const error = e as Error;
    return { success: false, error: "Fehler beim Löschen: " + error.message };
  }
}

const DuplicateNewsletterSchema = z.object({
  id: z.string(),
});

export async function duplicateNewsletterAction(
    prevState: AdminNewsletterState,
    formData: FormData
): Promise<AdminNewsletterState> {
    const session = await getSession();
    if (!session) {
      return { success: false, error: "Nicht authentifiziert" };
    }

    const validatedFields = DuplicateNewsletterSchema.safeParse(Object.fromEntries(formData.entries()));
    if (!validatedFields.success) {
        return { success: false, error: "Ungültige Newsletter-ID." };
    }
    try {
        await duplicateNewsletter(validatedFields.data.id, session.user.id);
        revalidatePath("/admin");
        return { success: true, message: "Newsletter erfolgreich dupliziert." };
    } catch (e) {
        const error = e as Error;
        return { success: false, error: "Fehler beim Duplizieren: " + error.message };
    }
}


const TagSubscribersSchema = z.object({
    subscriberIds: z.string(),
    tagName: z.string().min(1, "Tag-Name darf nicht leer sein."),
});

export type TaggingState = {
    success: boolean;
    error: string | null;
};

export async function tagSubscribersAction(
    prevState: TaggingState,
    formData: FormData
): Promise<TaggingState> {
    const session = await getSession();
    if (!session) {
      return { success: false, error: "Nicht authentifiziert" };
    }

    const validatedFields = TagSubscribersSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
        return { success: false, error: "Ungültige Eingabe." };
    }

    try {
        const subscriberIds = JSON.parse(validatedFields.data.subscriberIds);
        const tags = validatedFields.data.tagName.split(',').map(t => t.trim()).filter(t => t);
        
        if (subscriberIds.length === 0) {
             return { success: false, error: "Keine Abonnenten ausgewählt." };
        }

        await addTagsToSubscribers(subscriberIds, tags, session.user.id);
        revalidatePath("/admin");
        return { success: true, error: null };
    } catch (e) {
        const error = e as Error;
        return { success: false, error: `Fehler beim Taggen: ${error.message}` };
    }
}


// Campaign Actions
const SendNewsletterSchema = z.object({
  newsletterId: z.string().min(1, "Bitte wählen Sie einen Newsletter aus."),
  tags: z.string(),
});

export type SendNewsletterState = {
  success: boolean;
  message: string | null;
};

function replacePlaceholders(html: string, subscriber: Subscriber): string {
    return html.replace(/{EMAIL}/g, subscriber.email);
    // Add more placeholder replacements here, e.g., {NAME}
}

export async function sendNewsletterAction(
  prevState: SendNewsletterState,
  formData: FormData
): Promise<SendNewsletterState> {
   const session = await getSession();
   if (!session) {
    return { success: false, message: "Nicht authentifiziert" };
   }

  const validatedFields = SendNewsletterSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return { success: false, message: "Ungültige Eingabe." };
  }

  const { newsletterId } = validatedFields.data;
  const tags: string[] = JSON.parse(validatedFields.data.tags);

  if (tags.length === 0) {
    return { success: false, message: "Bitte wählen Sie mindestens einen Tag als Zielgruppe aus." };
  }
  
  if (!process.env.RESEND_API_KEY) {
     return { success: false, message: "Resend API-Schlüssel ist nicht konfiguriert. Bitte im Secret Manager hinterlegen." };
  }

  try {
    // 1. Get newsletter and subscribers
    const newsletter = await getNewsletter(newsletterId);
    if (!newsletter || !newsletter.content) {
      return { success: false, message: "Newsletter nicht gefunden oder hat keinen Inhalt." };
    }
    
    const allSubscribers = await getSubscribers();
    const targetSubscribers = allSubscribers.filter(s => 
        tags.every(tag => s.tags?.includes(tag))
    );

    if (targetSubscribers.length === 0) {
      return { success: false, message: "Es wurden keine Abonnenten für die ausgewählten Tags gefunden." };
    }
    
    // 2. Create campaign record
    const campaignData = {
        newsletterId: newsletter.id,
        newsletterName: newsletter.name,
        newsletterSubject: newsletter.subject,
        recipientCount: targetSubscribers.length,
        tags,
        status: 'pending' as const,
    };
    const campaignId = await addCampaign(campaignData, session.user.id);

    // 3. Send emails
    const resend = new Resend(process.env.RESEND_API_KEY);
    const emailsToSend = targetSubscribers.map(subscriber => ({
        from: 'Hallo Welt <hallo-welt@paulik-reisch.de>',
        to: [subscriber.email],
        subject: newsletter.subject,
        html: replacePlaceholders(newsletter.content, subscriber),
    }));

    const { data, error } = await resend.batch.send(emailsToSend);

    if (error || !data) {
      console.error("Resend error:", error);
      // TODO: Update campaign status to 'failed'
      return { success: false, message: `Fehler beim E-Mail-Versand: ${error?.message || 'Unbekannter Fehler'}` };
    }

    revalidatePath("/admin");
    return { success: true, message: `Kampagne erfolgreich erstellt und Versand an ${targetSubscribers.length} Empfänger gestartet.` };

  } catch (e) {
    const error = e as Error;
    console.error("Newsletter send action error:", error);
    return { success: false, message: `Fehler bei der Kampagnen-Ausführung: ${error.message}` };
  }
}

// Legal Page Actions
const UpdateLegalPageSchema = z.object({
  pageId: z.string(),
  title: z.string().min(1, "Titel darf nicht leer sein."),
  content: z.string(),
  components: z.string(),
  showTitle: z.boolean(),
  showDate: z.boolean(),
});

export type AdminLegalPageState = {
  success: boolean;
  error: string | null;
  message?: string;
};

const initialLegalPageState: AdminLegalPageState = { success: false, error: null };

export async function updateLegalPageAction(
  prevState: AdminLegalPageState,
  formData: FormData
): Promise<AdminLegalPageState> {
  const session = await getSession();
   if (!session) {
    return { success: false, error: "Nicht authentifiziert" };
   }

  const rawData = Object.fromEntries(formData.entries());
  const validatedFields = UpdateLegalPageSchema.safeParse({
      ...rawData,
      showTitle: rawData.showTitle === 'true',
      showDate: rawData.showDate === 'true',
  });

  if (!validatedFields.success) {
    const errorMessages = validatedFields.error.errors.map((e) => e.message).join(". ");
    return { success: false, error: errorMessages };
  }

  try {
    const { pageId, ...pageData } = validatedFields.data;
    const finalData = {
        ...pageData,
        components: JSON.parse(pageData.components),
    };
    await updateLegalPage(pageId, finalData, session.user.id);
    revalidatePath("/admin");
    revalidatePath(`/${pageId}`);
    return { success: true, message: "Seite erfolgreich aktualisiert." };
  } catch (e) {
    const error = e as Error;
    return { success: false, error: "Fehler beim Aktualisieren: " + error.message };
  }
}


// Palabrotas Actions
export type PalabrotaState = {
  success: boolean;
  error: string | null;
  message?: string;
};

const initialPalabrotaState: PalabrotaState = { success: false, error: null };

const PalabrotaSchema = z.object({
  id: z.string().optional(),
  de: z.string().min(1, "Deutsches Wort ist erforderlich."),
  es: z.string().min(1, "Spanisches Wort ist erforderlich."),
  wortart: z.string().min(1, "Wortart ist erforderlich."),
  anwendung: z.string().min(1, "Anwendung ist erforderlich."),
  synonyme: z.string().min(1, "Synonyme sind erforderlich."),
  beispiel: z.string().min(1, "Beispiel ist erforderlich."),
  pfeiferFaktor: z.coerce.number().min(0).max(5),
});

export async function addPalabrotaAction(
  prevState: PalabrotaState,
  formData: FormData
): Promise<PalabrotaState> {
  const session = await getSession();
  if (!session) {
    return { success: false, error: "Nicht authentifiziert", message: null };
  }
  const validatedFields = PalabrotaSchema.omit({ id: true }).safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    const errorMessages = validatedFields.error.errors.map((e) => e.message).join(". ");
    return { success: false, error: errorMessages, message: null };
  }

  try {
    await addPalabrota(validatedFields.data, session.user.id);
    revalidatePath("/admin");
    revalidatePath("/lp-palabrotas");
    return { success: true, error: null, message: "Wort erfolgreich hinzugefügt." };
  } catch (e) {
    const error = e as Error;
    return { success: false, error: `Fehler beim Hinzufügen: ${error.message}`, message: null };
  }
}

export async function updatePalabrotaAction(
  prevState: PalabrotaState,
  formData: FormData
): Promise<PalabrotaState> {
  const session = await getSession();
  if (!session) {
    return { success: false, error: "Nicht authentifiziert", message: null };
  }
  const validatedFields = PalabrotaSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    const errorMessages = validatedFields.error.errors.map((e) => e.message).join(". ");
    return { success: false, error: errorMessages, message: null };
  }

  try {
    const { id, ...dataToUpdate } = validatedFields.data;
    if (!id) {
        return { success: false, error: "ID ist erforderlich.", message: null };
    }
    await updatePalabrota(id, dataToUpdate, session.user.id);
    revalidatePath("/admin");
    revalidatePath("/lp-palabrotas");
    return { success: true, error: null, message: "Wort erfolgreich aktualisiert." };
  } catch (e) {
    const error = e as Error;
    return { success: false, error: `Fehler beim Aktualisieren: ${error.message}`, message: null };
  }
}

const DeletePalabrotaSchema = z.object({
  id: z.string(),
});

export async function deletePalabrotaAction(
  prevState: PalabrotaState,
  formData: FormData
): Promise<PalabrotaState> {
  const session = await getSession();
  if (!session) {
    return { success: false, error: "Nicht authentifiziert", message: null };
  }
  const validatedFields = DeletePalabrotaSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return { success: false, error: "Ungültige ID.", message: null };
  }

  try {
    await deletePalabrota(validatedFields.data.id, session.user.id);
    revalidatePath("/admin");
    revalidatePath("/lp-palabrotas");
    return { success: true, error: null, message: "Wort erfolgreich gelöscht." };
  } catch (e) {
    const error = e as Error;
    return { success: false, error: `Fehler beim Löschen: ${error.message}`, message: null };
  }
}

const BulkAddPalabrotasSchema = z.object({
  wordList: z.string().min(1, "Die Wortliste darf nicht leer sein."),
});

export async function bulkAddPalabrotasAction(
  prevState: PalabrotaState,
  formData: FormData
): Promise<PalabrotaState> {
    const session = await getSession();
    if (!session) {
        return { success: false, error: "Nicht authentifiziert", message: null };
    }
    const validatedFields = BulkAddPalabrotasSchema.safeParse(Object.fromEntries(formData.entries()));
    if (!validatedFields.success) {
        const errorMessages = validatedFields.error.errors.map((e) => e.message).join(". ");
        return { success: false, error: errorMessages, message: null };
    }

    try {
        const { wordList } = validatedFields.data;
        const pairs = wordList.split(';').map(p => p.trim()).filter(p => p);
        let addedCount = 0;

        for (const pair of pairs) {
            const parts = pair.split(' ').map(p => p.trim());
            if (parts.length >= 2) {
                const de = parts[0];
                const es = parts.slice(1).join(' '); // Spanish part can have spaces

                const newPalabrota = {
                    de,
                    es,
                    wortart: "N/A",
                    anwendung: "N/A",
                    synonyme: "N/A",
                    beispiel: "N/A",
                    pfeiferFaktor: 3,
                };
                await addPalabrota(newPalabrota, session.user.id);
                addedCount++;
            }
        }
        revalidatePath("/admin");
        revalidatePath("/lp-palabrotas");
        return { success: true, error: null, message: `${addedCount} Wörter erfolgreich per Massen-Import hinzugefügt.` };

    } catch (e) {
        const error = e as Error;
        return { success: false, error: `Fehler beim Massen-Import: ${error.message}`, message: null };
    }
}

// --- Excerpt Actions ---
export type AdminExcerptState = {
  success: boolean;
  error?: string | null;
  message?: string;
  slug?: string;
  isPublished?: boolean;
};

const UpdateExcerptSchema = z.object({
  slug: z.string(),
  title: z.string().optional(),
  content: z.string().optional(),
  isPublished: z.boolean().optional(),
});

export async function updateExcerptAction(
  prevState: AdminExcerptState,
  formData: FormData
): Promise<AdminExcerptState> {
  const session = await getSession();
  if (!session) {
    return { success: false, error: "Nicht authentifiziert" };
  }
  
  const formEntries = Object.fromEntries(formData.entries());
  
  const dataToValidate: { [key: string]: any } = {};
  if ('slug' in formEntries) dataToValidate.slug = formEntries.slug;
  if ('title' in formEntries) dataToValidate.title = formEntries.title;
  if ('content' in formEntries) dataToValidate.content = formEntries.content;
  if ('isPublished' in formEntries) dataToValidate.isPublished = formEntries.isPublished === 'true';

  const validatedFields = UpdateExcerptSchema.safeParse(dataToValidate);

  if (!validatedFields.success) {
    const errorMessages = validatedFields.error.errors.map((e) => e.message).join(". ");
    return { success: false, error: errorMessages };
  }

  try {
    const { slug, ...dataToUpdate } = validatedFields.data;
    await updateExcerpt(slug, dataToUpdate, session.user.id);
    revalidatePath("/admin");
    revalidatePath(`/exzerpt/${slug}`);
    revalidatePath('/exzerpte');
    return { 
        success: true, 
        message: "Exzerpt erfolgreich aktualisiert.", 
        slug: slug,
        isPublished: dataToUpdate.isPublished
    };
  } catch (e) {
    const error = e as Error;
    return { success: false, error: "Fehler beim Aktualisieren: " + error.message };
  }
}
