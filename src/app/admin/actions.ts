
"use server";

import { z } from "zod";
import {
  getAdminCredentials,
  addLog,
  addArticle,
  updateArticle,
  deleteArticle,
} from "@/lib/firestore";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { encrypt, getSession } from "@/lib/session";
import { redirect } from "next/navigation";


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

    cookies().set("session", session, { expires, httpOnly: true, path: '/' });

    await addLog(username, 'Login erfolgreich', `Benutzer '${username}' hat sich angemeldet.`);
    revalidatePath("/admin");
    redirect('/admin');
}

export async function logoutAction() {
    const session = await getSession();
    const user = session?.user.id || 'Unbekannt';
    cookies().set("session", "", { expires: new Date(0), path: '/' });
    await addLog(user, 'Logout', `Benutzer '${user}' hat sich abgemeldet.`);
    redirect('/login');
}

// --- Article Actions ---

export type ArticleActionState = {
  success: boolean;
  error?: string | null;
  message?: string;
  newSlug?: string;
};

const ArticleSchema = z.object({
  title: z.string().min(1, "Titel ist erforderlich."),
  slug: z.string().min(1, "Slug ist erforderlich."),
  category: z.string().min(1, "Kategorie ist erforderlich."),
  imageUrl: z.string().url("Gültige Bild-URL ist erforderlich."),
  imageAlt: z.string().min(1, "Bild-Alt-Text ist erforderlich."),
  teaser: z.string().min(1, "Teaser-Text ist erforderlich."),
  content: z.string().min(1, "Inhalt ist erforderlich."),
  readTime: z.coerce.number().min(1, "Lesezeit muss mindestens 1 sein."),
  accessLevel: z.enum(['free', 'leadwall', 'sharewall']),
  author: z.enum(['redaktion', 'gastbeitrag']).optional(),
});

export async function createArticleAction(prevState: ArticleActionState, formData: FormData): Promise<ArticleActionState> {
    const session = await getSession();
    if (!session) return { success: false, error: "Nicht authentifiziert" };

    const validatedFields = ArticleSchema.safeParse({
        ...Object.fromEntries(formData.entries()),
    });

    if (!validatedFields.success) {
        return { success: false, error: validatedFields.error.flatten().fieldErrors.title?.join(', ') || "Validierungsfehler" };
    }
    
    try {
        const newSlug = await addArticle(validatedFields.data, session.user.id);
        revalidatePath("/admin");
        revalidatePath("/a", "layout");
        return { success: true, message: "Artikel erfolgreich erstellt.", newSlug };
    } catch(e: any) {
        return { success: false, error: e.message };
    }
}

export async function updateArticleAction(prevState: ArticleActionState, formData: FormData): Promise<ArticleActionState> {
    const session = await getSession();
    if (!session) return { success: false, error: "Nicht authentifiziert" };
    
    const originalSlug = formData.get('originalSlug') as string;
    if (!originalSlug) return { success: false, error: "Original-Slug fehlt." };

    const validatedFields = ArticleSchema.safeParse({
        ...Object.fromEntries(formData.entries()),
    });

    if (!validatedFields.success) {
        return { success: false, error: "Validierungsfehler" };
    }
    
    try {
        await updateArticle(originalSlug, validatedFields.data, session.user.id);
        revalidatePath("/admin");
        revalidatePath(`/a/${originalSlug}`);
        if(originalSlug !== validatedFields.data.slug) {
            revalidatePath(`/a/${validatedFields.data.slug}`);
        }
        revalidatePath('/a'); // Revalidate the overview page
        return { success: true, message: "Artikel erfolgreich aktualisiert.", newSlug: validatedFields.data.slug };
    } catch(e: any) {
        return { success: false, error: e.message };
    }
}

export async function deleteArticleAction(prevState: any, formData: FormData): Promise<{ success: boolean; error: string | null }> {
    const session = await getSession();
    if (!session) return { success: false, error: "Nicht authentifiziert" };

    const slug = formData.get('slug') as string;
    if (!slug) return { success: false, error: "Slug fehlt."};

    try {
        await deleteArticle(slug, session.user.id);
        revalidatePath("/admin");
        revalidatePath("/a", "layout");
        return { success: true, error: null };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}
