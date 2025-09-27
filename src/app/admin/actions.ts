

"use server";

import { z } from "zod";
import {
  addProduct,
  updateProduct,
  deleteProduct,
  addNewsletter,
  updateNewsletter,
  deleteNewsletter,
  duplicateNewsletter,
  getAdminPassword,
  addTagsToSubscribers,
  getSubscribers,
  getNewsletter,
  Subscriber,
  addCampaign,
  updateLegalPage,
} from "@/lib/firestore";
import { revalidatePath } from "next/cache";
import { correctHtml } from "@/ai/flows/correct-html-flow";
import { cookies } from "next/headers";
import { encrypt } from "@/lib/session";
import { redirect } from "next/navigation";
import { Resend } from 'resend';


const LoginSchema = z.object({
    password: z.string(),
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
        return { success: false, error: "Ungültige Eingabe." };
    }
    
    const adminPassword = await getAdminPassword();

    if (!adminPassword) {
        return { success: false, error: "Admin-Passwort ist in der Datenbank nicht konfiguriert." };
    }

    if (validatedFields.data.password !== adminPassword) {
        return { success: false, error: "Falsches Passwort." };
    }

    // Create session
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    const session = await encrypt({ user: { id: 'admin' }, expires });

    cookies().set("session", session, { expires, httpOnly: true });

    revalidatePath("/admin");
    redirect('/admin');
}

export async function logoutAction() {
    cookies().set("session", "", { expires: new Date(0) });
    redirect('/admin/login');
}


// Products
const ProductSchema = z.object({
  title: z.string().min(1, "Titel ist erforderlich."),
  subtitle: z.string().optional(),
  price: z.coerce.number().min(0, "Preis muss positiv sein."),
  preorderPrice: z.coerce.number().optional(),
  amazonLink: z.string().url("Gültige URL erforderlich."),
  imageSrc: z.string().url("Gültige URL erforderlich."),
  aiHint: z.string().optional(),
  description: z.string().optional(),
});

export type AdminProductState = {
  success: boolean;
  error: string | null;
  message?: string;
};

const initialProductState: AdminProductState = { success: false, error: null };

export async function addProductAction(
  prevState: AdminProductState,
  formData: FormData
): Promise<AdminProductState> {
  const validatedFields = ProductSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    const errorMessages = validatedFields.error.errors.map((e) => e.message).join(". ");
    return { success: false, error: errorMessages };
  }

  try {
    await addProduct(validatedFields.data);
    revalidatePath("/admin");
    revalidatePath("/buchhandlung-paulik-reisch");
    return { success: true, message: "Produkt erfolgreich hinzugefügt." };
  } catch (e) {
    const error = e as Error;
    return { success: false, error: error.message };
  }
}

export async function updateProductAction(
  prevState: AdminProductState,
  formData: FormData
): Promise<AdminProductState> {
  const productId = formData.get("productId") as string;
  const productDataString = formData.get("productData") as string;

  if (!productId || !productDataString) {
    return { success: false, error: "Produkt-ID oder Daten fehlen." };
  }
  
  try {
    const productData = JSON.parse(productDataString);
    await updateProduct(productId, productData);
    revalidatePath("/admin");
    revalidatePath("/buchhandlung-paulik-reisch");
    return { success: true, message: "Produkt erfolgreich aktualisiert." };
  } catch (e) {
    const error = e as Error;
    return { success: false, error: "Fehler beim Aktualisieren: " + error.message };
  }
}

const DeleteProductSchema = z.object({
  productId: z.string(),
});

export async function deleteProductAction(
  prevState: AdminProductState,
  formData: FormData
): Promise<AdminProductState> {
  const validatedFields = DeleteProductSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return { success: false, error: "Ungültige Produkt-ID." };
  }

  try {
    await deleteProduct(validatedFields.data.productId);
    revalidatePath("/admin");
    revalidatePath("/buchhandlung-paulik-reisch");
    return { success: true, message: "Produkt wurde gelöscht." };
  } catch (e) {
    const error = e as Error;
    return { success: false, error: "Fehler beim Löschen: " + error.message };
  }
}

const CorrectHtmlSchema = z.object({
  html: z.string(),
});

export async function correctHtmlAction(
    prevState: { correctedHtml?: string; error?: string },
    formData: FormData
) {
    const validatedFields = CorrectHtmlSchema.safeParse({
        html: formData.get("html"),
    });

    if (!validatedFields.success) {
        return { error: "Ungültige Eingabe." };
    }

    try {
        const result = await correctHtml(validatedFields.data);
        return { correctedHtml: result.correctedHtml };
    } catch (e) {
        console.error(e);
        return { error: "HTML konnte nicht korrigiert werden. Die KI ist möglicherweise im Urlaub." };
    }
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
  const validatedFields = AddNewsletterSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    const errorMessages = validatedFields.error.errors.map((e) => e.message).join(". ");
    return { success: false, error: errorMessages };
  }

  try {
    const newId = await addNewsletter(validatedFields.data);
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
    
    await updateNewsletter(id, dataToUpdate);
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
  const validatedFields = DeleteNewsletterSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return { success: false, error: "Ungültige Newsletter-ID." };
  }
  
  try {
    await deleteNewsletter(validatedFields.data.id);
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
    const validatedFields = DuplicateNewsletterSchema.safeParse(Object.fromEntries(formData.entries()));
    if (!validatedFields.success) {
        return { success: false, error: "Ungültige Newsletter-ID." };
    }
    try {
        await duplicateNewsletter(validatedFields.data.id);
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

        await addTagsToSubscribers(subscriberIds, tags);
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
    const campaignId = await addCampaign(campaignData);

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

    // 4. Update campaign status to 'sent'
    // NOTE: This is not shown in the code but this is where you would update the campaign status
    // For example:
    // const campaignRef = doc(db, 'campaigns', campaignId);
    // await updateDoc(campaignRef, {
    //     status: 'sent',
    //     resendBatchId: data.id,
    // });


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
  const validatedFields = UpdateLegalPageSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    const errorMessages = validatedFields.error.errors.map((e) => e.message).join(". ");
    return { success: false, error: errorMessages };
  }

  try {
    const { pageId, title, content, components } = validatedFields.data;
    const pageData = {
        title,
        content,
        components: JSON.parse(components),
    };
    await updateLegalPage(pageId, pageData);
    revalidatePath("/admin");
    revalidatePath(`/${pageId}`);
    return { success: true, message: "Seite erfolgreich aktualisiert." };
  } catch (e) {
    const error = e as Error;
    return { success: false, error: "Fehler beim Aktualisieren: " + error.message };
  }
}
