"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE, encrypt, getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { getAdminAuth } from "@/lib/firebase-admin";
import { isAdminEmail } from "@/lib/admin-allowlist";
import { assertAdminMutationOrigin } from "@/lib/admin-request";
import { addAdminLog } from "@/lib/admin-writes";

const LoginSchema = z.object({
    idToken: z.string().min(1, "Anmeldung unvollstaendig."),
});

export type LoginState = {
    success: boolean;
    error: string | null;
};

/**
 * Der Client meldet sich per Firebase Auth (E-Mail + Passwort) an und reicht
 * das ID-Token hier ein. Server-seitig wird das Token verifiziert und die
 * E-Mail gegen die Admin-Allowlist geprueft. Erst dann gibt es die Session.
 */
export async function loginAction(
    prevState: LoginState,
    formData: FormData
): Promise<LoginState> {
    await assertAdminMutationOrigin();
    const validatedFields = LoginSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
        const errorMessages = validatedFields.error.issues.map(e => e.message).join('. ');
        return { success: false, error: errorMessages };
    }

    const { idToken } = validatedFields.data;

    let email: string | undefined;
    let emailVerified = false;
    try {
        const decoded = await getAdminAuth().verifyIdToken(idToken);
        email = decoded.email;
        emailVerified = decoded.email_verified === true;
    } catch {
        await addAdminLog('unbekannt', 'Login fehlgeschlagen', 'Ungueltiges Firebase-ID-Token.');
        return { success: false, error: "Anmeldung fehlgeschlagen. Bitte erneut versuchen." };
    }

    if (!email || !emailVerified || !isAdminEmail(email)) {
        await addAdminLog(email ?? 'unbekannt', 'Login fehlgeschlagen', `E-Mail '${email ?? 'unbekannt'}' ist nicht fuer den Admin-Bereich freigegeben.`);
        return { success: false, error: "Dieses Konto ist nicht fuer den Admin-Bereich freigegeben." };
    }

    // Create session
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    const session = await encrypt({ user: { id: email }, expires });

    (await cookies()).set(ADMIN_SESSION_COOKIE, session, { expires, httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/' });

    await addAdminLog(email, 'Login erfolgreich', `Benutzer '${email}' hat sich angemeldet.`);
    revalidatePath("/admin/authors");
    redirect('/admin/authors');
}

export async function logoutAction() {
    await assertAdminMutationOrigin();
    const session = await getSession();
    const user = session?.user.id || 'Unbekannt';
    (await cookies()).set(ADMIN_SESSION_COOKIE, "", { expires: new Date(0), httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/' });
    await addAdminLog(user, 'Logout', `Benutzer '${user}' hat sich abgemeldet.`);
    redirect('/login');
}
