"use server";

import { z } from "zod";
import {
  addAuthor,
  updateAuthor,
  deleteAuthor,
} from "@/lib/firestore";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/session";

export type AuthorActionState = {
  success: boolean;
  error?: string | null;
  message?: string;
  newSlug?: string;
};

const AuthorSchema = z.object({
  firstName: z.string().min(1, "Vorname ist erforderlich."),
  lastName: z.string().min(1, "Nachname ist erforderlich."),
  slug: z.string().min(1, "Slug ist erforderlich."),
  profilePictureUrl: z.string().url("Gültige Bild-URL ist erforderlich."),
  bio: z.string().min(1, "Biografie ist erforderlich."),
  websiteUrl: z.string().url("Gültige Website-URL ist erforderlich.").optional().or(z.literal('')),
});

export async function createAuthorAction(prevState: AuthorActionState, formData: FormData): Promise<AuthorActionState> {
    const session = await getSession();
    if (!session) return { success: false, error: "Nicht authentifiziert" };

    const validatedFields = AuthorSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
        return { success: false, error: "Validierungsfehler: " + validatedFields.error.issues.map(issue => issue.message).join(', ') };
    }
    
    try {
        const newSlug = await addAuthor(validatedFields.data, session.user.id);
        revalidatePath("/admin/authors");
        return { success: true, message: "Autor erfolgreich erstellt.", newSlug };
    } catch(e: any) {
        return { success: false, error: e.message };
    }
}

export async function updateAuthorAction(prevState: AuthorActionState, formData: FormData): Promise<AuthorActionState> {
    const session = await getSession();
    if (!session) return { success: false, error: "Nicht authentifiziert" };
    
    const originalSlug = formData.get('originalSlug') as string;
    if (!originalSlug) return { success: false, error: "Original-Slug fehlt." };

    const validatedFields = AuthorSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
        return { success: false, error: "Validierungsfehler" };
    }
    
    try {
        await updateAuthor(originalSlug, validatedFields.data, session.user.id);
        revalidatePath("/admin/authors");
        revalidatePath(`/autoren/${originalSlug}`);
        if(originalSlug !== validatedFields.data.slug) {
            revalidatePath(`/autoren/${validatedFields.data.slug}`);
        }
        return { success: true, message: "Autor erfolgreich aktualisiert.", newSlug: validatedFields.data.slug };
    } catch(e: any) {
        return { success: false, error: e.message };
    }
}

export async function deleteAuthorAction(prevState: any, formData: FormData): Promise<{ success: boolean; error: string | null }> {
    const session = await getSession();
    if (!session) return { success: false, error: "Nicht authentifiziert" };

    const slug = formData.get('slug') as string;
    if (!slug) return { success: false, error: "Slug fehlt."};

    try {
        await deleteAuthor(slug, session.user.id);
        revalidatePath("/admin/authors");
        return { success: true, error: null };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}
