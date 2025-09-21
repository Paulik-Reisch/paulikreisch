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
} from "@/lib/firestore";
import { revalidatePath } from "next/cache";

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
    content: z.string().min(1, "Inhalt ist erforderlich."),
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
        await addLegalPage(pageId, { title, content });
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
    content: z.string().min(1, "Inhalt darf nicht leer sein."),
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
        await updateLegalPage(pageId, { title, content });
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

export async function createDefaultLegalPagesAction(): Promise<AdminLegalPageState> {
    const defaultPages = [
        { pageId: "impressum", title: "Impressum", content: "<h1>Impressum</h1><p>Bitte füllen Sie diese Seite mit Ihren Daten.</p>" },
        { pageId: "datenschutz", title: "Datenschutzerklärung", content: "<h1>Datenschutzerklärung</h1><p>Bitte füllen Sie diese Seite mit Ihren Datenschutzbestimmungen.</p>" },
        { pageId: "cookie-richtlinie", title: "Cookie-Richtlinie", content: "<h1>Cookie-Richtlinie</h1><p>Bitte füllen Sie diese Seite mit Ihren Cookie-Richtlinien.</p>" },
        { pageId: "agb", title: "Allgemeine Geschäftsbedingungen", content: "<h1>AGB</h1><p>Bitte füllen Sie diese Seite mit Ihren AGBs.</p>" },
        { pageId: "lizenz", title: "Lizenz", content: "<h1>Lizenz</h1><p>Bitte füllen Sie diese Seite mit Ihren Lizenzinformationen.</p>" },
    ];

    const results = { created: [] as string[], errors: [] as string[] };

    for (const page of defaultPages) {
        try {
            await addLegalPage(page.pageId, { title: page.title, content: page.content });
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
