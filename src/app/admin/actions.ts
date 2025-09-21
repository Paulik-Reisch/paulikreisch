
"use server";

import { z } from "zod";
import {
  addProduct,
  updateProduct,
  deleteProduct,
  addLegalPage,
  updateLegalPage,
  deleteLegalPage,
  Product,
  addNewsletter,
  updateNewsletter,
  deleteNewsletter,
  PageComponent,
} from "@/lib/firestore";
import { revalidatePath } from "next/cache";
import { correctHtml } from "@/ai/flows/correct-html-flow";

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


// Legal Pages
const LegalPageSchema = z.object({
    pageId: z.string().min(2, "Seiten-ID ist erforderlich.").regex(/^[a-z0-9-]+$/, "ID darf nur Kleinbuchstaben, Zahlen und Bindestriche enthalten."),
    title: z.string().min(1, "Titel ist erforderlich."),
    content: z.string(), // This will be the generated HTML from components
    components: z.string(), // This will be a JSON string of components
});

export type AdminLegalPageState = {
    success: boolean;
    error: string | null;
    message?: string;
};

const initialLegalPageState: AdminLegalPageState = { success: false, error: null };


export async function addLegalPageAction(
    prevState: AdminLegalPageState,
    formData: FormData
): Promise<AdminLegalPageState> {
    const validatedFields = LegalPageSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
        const errorMessages = validatedFields.error.errors.map((e) => e.message).join(". ");
        return { success: false, error: errorMessages };
    }

    try {
        const { pageId, title, content } = validatedFields.data;
        const components: PageComponent[] = JSON.parse(validatedFields.data.components);
        await addLegalPage(pageId, { title, content, components });
        revalidatePath("/admin");
        revalidatePath(`/${pageId}`);
        return { success: true, message: "Seite erfolgreich erstellt." };
    } catch (e) {
        const error = e as Error;
        return { success: false, error: error.message };
    }
}

const UpdateLegalPageSchema = z.object({
    pageId: z.string(),
    title: z.string().min(1, "Titel darf nicht leer sein."),
    content: z.string(),
    components: z.string(),
});

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
        const { pageId, title, content } = validatedFields.data;
        const components = JSON.parse(validatedFields.data.components);
        await updateLegalPage(pageId, { title, content, components });
        revalidatePath("/admin");
        revalidatePath(`/${pageId}`);
        return { success: true, message: "Seite erfolgreich aktualisiert." };
    } catch (e) {
        const error = e as Error;
        return { success: false, error: "Fehler beim Aktualisieren: " + error.message };
    }
}

const DeleteLegalPageSchema = z.object({
  pageId: z.string(),
});

export async function deleteLegalPageAction(
    prevState: AdminLegalPageState,
    formData: FormData
): Promise<AdminLegalPageState> {
    const validatedFields = DeleteLegalPageSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
        return { success: false, error: "Ungültige Seiten-ID." };
    }
    
    try {
        await deleteLegalPage(validatedFields.data.pageId);
        revalidatePath("/admin");
        // We can't easily revalidate a dynamic slug that no longer exists,
        // but revalidating /admin is the most important part.
        return { success: true, message: "Seite wurde gelöscht." };
    } catch (e) {
        const error = e as Error;
        return { success: false, error: "Fehler beim Löschen: " + error.message };
    }
}

// Helper to generate simple HTML from page components
function generatePageHtml(components: PageComponent[]): string {
    return components.map(component => {
        const props = component.props;
        switch(component.type) {
            case 'heading':
                const Tag = props.level || 'h1';
                return `<${Tag} class="${props.className || 'text-4xl font-bold tracking-tighter sm:text-5xl'}">${props.text || ''}</${Tag}>`;
            case 'text':
                return `<p class="${props.className || 'text-muted-foreground md:text-xl'}">${(props.text || '').replace(/\n/g, '<br />')}</p>`;
            case 'button':
                return `<div class="mt-6"><a href="${props.href || '#'}" class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 shadow-md transform active:scale-95 border h-11 px-8 bg-primary text-primary-foreground hover:bg-primary/90">${props.text || 'Klick'}</a></div>`;
            case 'image':
                return `<div class="my-6"><img src="${props.src || 'https://placehold.co/800x450'}" alt="${props.alt || ''}" class="w-full h-auto rounded-lg shadow-md" /></div>`;
            case 'spacer':
                 return `<div style="height: ${props.height || '2rem'}"></div>`;
            default:
                return '';
        }
    }).join('\n');
}

export async function createDefaultLegalPagesAction(): Promise<AdminLegalPageState> {
    const defaultPages = [
        { 
            pageId: "impressum", 
            title: "Impressum", 
            components: [
                { id: "h1", type: 'heading', props: { text: 'Impressum', level: 'h1', className: 'text-4xl font-bold mb-4'}},
                { id: "h2", type: 'heading', props: { text: 'Angaben gemäß § 5 TMG', level: 'h2', className: 'text-2xl font-bold mt-6 mb-2'}},
                { id: "p1", type: 'text', props: { text: '[Vollständiger Name]<br />[Straße und Hausnummer]<br />[PLZ und Ort]', className: 'text-base'}},
                { id: "h3", type: 'heading', props: { text: 'Kontakt', level: 'h2', className: 'text-2xl font-bold mt-6 mb-2'}},
                { id: "p2", type: 'text', props: { text: 'Telefon: [Ihre Telefonnummer]<br />E-Mail: [Ihre E-Mail-Adresse]', className: 'text-base'}}
            ]
        },
        { 
            pageId: "datenschutz", 
            title: "Datenschutzerklärung", 
            components: [
                { id: "h1", type: 'heading', props: { text: 'Datenschutzerklärung', level: 'h1', className: 'text-4xl font-bold mb-4'}},
                { id: "p1", type: 'text', props: { text: 'Wir nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Hier finden Sie Informationen darüber, wie wir mit Ihren Daten umgehen.', className: 'text-base'}}
            ]
        },
    ];

    const results = { created: [] as string[], errors: [] as string[] };

    for (const page of defaultPages) {
        try {
            const content = generatePageHtml(page.components as PageComponent[]);
            await addLegalPage(page.pageId, { title: page.title, content, components: page.components as PageComponent[] });
            results.created.push(page.pageId);
        } catch (e) {
            const error = e as Error;
            // Ignore errors for pages that already exist
            if (!error.message.includes("existiert bereits")) {
                results.errors.push(`${page.pageId}: ${error.message}`);
            }
        }
    }

    if (results.errors.length > 0) {
        return { success: false, error: `Fehler beim Erstellen der Seiten: ${results.errors.join(", ")}` };
    }

    revalidatePath("/admin");
    defaultPages.forEach(p => revalidatePath(`/${p.pageId}`));
    
    const message = results.created.length > 0 
        ? `Seiten erfolgreich erstellt: ${results.created.join(", ")}`
        : "Alle Standardseiten existieren bereits.";

    return { success: true, message };
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
    const { id, components, ...rest } = validatedFields.data;
    const dataToUpdate: any = { ...rest };
    
    if (components) {
        dataToUpdate.components = JSON.parse(components);
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
