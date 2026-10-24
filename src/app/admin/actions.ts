"use server";

import { z } from "zod";
import {
  getAdminCredentials,
  addLog,
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
        const errorMessages = validatedFields.error.issues.map(e => e.message).join('. ');
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

    (await cookies()).set("session", session, { expires, httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/' });

    await addLog(username, 'Login erfolgreich', `Benutzer '${username}' hat sich angemeldet.`);
    revalidatePath("/admin/authors");
    redirect('/admin/authors');
}

export async function logoutAction() {
    const session = await getSession();
    const user = session?.user.id || 'Unbekannt';
    (await cookies()).set("session", "", { expires: new Date(0), path: '/' });
    await addLog(user, 'Logout', `Benutzer '${user}' hat sich abgemeldet.`);
    redirect('/login');
}
