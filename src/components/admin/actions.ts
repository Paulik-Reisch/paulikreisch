"use server";

import { z } from "zod";
import {
  updateNewsletter,
  deleteNewsletter,
  addNewsletter,
  duplicateNewsletter,
  addCampaign,
  updateLegalPage,
  updateExcerpt,
  addAdminLog as addLog,
} from "@/lib/admin-writes";
import { getNewsletter } from "@/lib/firestore";
import { revalidatePath, updateTag } from "next/cache";
import { LEGAL_PAGES_CACHE_TAG } from "@/lib/legal-pages-cache";
import { getSession } from "@/lib/session";
import { sendCampaign } from "@/lib/resend";


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
    const errorMessages = validatedFields.error.issues.map((e) => e.message).join(". ");
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
    const errorMessages = validatedFields.error.issues.map((e) => e.message).join(". ");
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


// Campaign Actions
const SendNewsletterSchema = z.object({
  newsletterId: z.string().min(1, "Bitte wählen Sie einen Newsletter aus."),
});

export type SendNewsletterState = {
  success: boolean;
  message: string | null;
};

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
  
  try {
    // 1. Get newsletter
    const newsletter = await getNewsletter(newsletterId);
    if (!newsletter || !newsletter.content) {
      return { success: false, message: "Newsletter nicht gefunden oder hat keinen Inhalt." };
    }
    
    // 2. Create campaign record
    const campaignData = {
        newsletterId: newsletter.id,
        newsletterName: newsletter.name,
        newsletterSubject: newsletter.subject,
        recipientCount: 0, // We don't know the count beforehand with audiences
        tags: [], // Tags are now managed in Resend
        status: 'pending' as const,
    };
    await addCampaign(campaignData, session.user.id);

    // 3. Send email via Resend to the audience
    await sendCampaign(newsletter.subject, newsletter.content);

    revalidatePath("/admin");
    return { success: true, message: `Kampagne wurde erfolgreich zum Versand an die Gruppe übergeben.` };

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
    const errorMessages = validatedFields.error.issues.map((e) => e.message).join(". ");
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
    updateTag(LEGAL_PAGES_CACHE_TAG);
    return { success: true, error: null, message: "Seite erfolgreich aktualisiert." };
  } catch (e) {
    const error = e as Error;
    return { success: false, error: "Fehler beim Aktualisieren: " + error.message };
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
    const errorMessages = validatedFields.error.issues.map((e) => e.message).join(". ");
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
