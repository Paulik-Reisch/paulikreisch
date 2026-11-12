
"use server";

import { z } from "zod";
import {
  addLandingPage,
  updateLandingPage,
  deleteLandingPage,
} from "@/lib/admin-writes";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/session";

export type LandingPageActionState = {
  success: boolean;
  error?: string | null;
  message?: string;
  newSlug?: string;
};

const LandingPageSchema = z.object({
  title: z.string().min(1, "Titel ist erforderlich."),
  slug: z.string().min(1, "Slug ist erforderlich."),
  htmlContent: z.string().optional(),
  cssContent: z.string().optional(),
  jsContent: z.string().optional(),
});

export async function createLandingPageAction(prevState: LandingPageActionState, formData: FormData): Promise<LandingPageActionState> {
    const session = await getSession();
    if (!session) return { success: false, error: "Nicht authentifiziert" };

    const validatedFields = LandingPageSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
        return { success: false, error: "Validierungsfehler" };
    }
    
    try {
        const newSlug = await addLandingPage(validatedFields.data, session.user.id);
        revalidatePath("/admin/lp");
        revalidatePath("/lp", "layout");
        return { success: true, message: "Landing Page erfolgreich erstellt.", newSlug };
    } catch(e: any) {
        return { success: false, error: e.message };
    }
}

export async function updateLandingPageAction(prevState: LandingPageActionState, formData: FormData): Promise<LandingPageActionState> {
    const session = await getSession();
    if (!session) return { success: false, error: "Nicht authentifiziert" };
    
    const originalSlug = formData.get('originalSlug') as string;
    if (!originalSlug) return { success: false, error: "Original-Slug fehlt." };

    const validatedFields = LandingPageSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
        return { success: false, error: "Validierungsfehler" };
    }
    
    try {
        await updateLandingPage(originalSlug, validatedFields.data, session.user.id);
        revalidatePath("/admin/lp");
        revalidatePath(`/lp/${originalSlug}`);
        if(originalSlug !== validatedFields.data.slug) {
            revalidatePath(`/lp/${validatedFields.data.slug}`);
        }
        return { success: true, message: "Landing Page erfolgreich aktualisiert." };
    } catch(e: any) {
        return { success: false, error: e.message };
    }
}

export async function deleteLandingPageAction(prevState: any, formData: FormData): Promise<{ success: boolean; error: string | null }> {
    const session = await getSession();
    if (!session) return { success: false, error: "Nicht authentifiziert" };

    const slug = formData.get('slug') as string;
    if (!slug) return { success: false, error: "Slug fehlt."};

    try {
        await deleteLandingPage(slug, session.user.id);
        revalidatePath("/admin/lp");
        revalidatePath("/lp", "layout");
        return { success: true, error: null };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}
