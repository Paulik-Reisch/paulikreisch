"use server";

import { z } from "zod";
import {
  addProduct,
  updateProduct,
  addLegalPage,
  updateLegalPage,
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
};

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
    return { success: true, error: null };
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
    return { success: true, error: null };
  } catch (e) {
    const error = e as Error;
    return { success: false, error: "Fehler beim Aktualisieren: " + error.message };
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
};

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
        return { success: true, error: null };
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
        return { success: true, error: null };
    } catch (e) {
        const error = e as Error;
        return { success: false, error: "Fehler beim Aktualisieren: " + error.message };
    }
}