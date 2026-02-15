

'use server';

import { z } from "zod";
import { addOrder, addLog, getCountdownTarget, updateCountdownTarget, logAnalyticsEvent } from "@/lib/firestore";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/session";
import { addContact } from "@/lib/resend";


const OrderSchema = z.object({
  payload: z.string(),
});

export async function createOrderAction(
  prevState: any,
  formData: FormData
) {
  const session = await getSession();
  if (!session) {
    return { success: false, error: "Nicht authentifiziert" };
  }

  const validatedFields = OrderSchema.safeParse({
    payload: formData.get("payload"),
  });

  if (!validatedFields.success) {
    return { success: false, error: "Ungültige Bestelldaten." };
  }

  try {
    const orderData = JSON.parse(validatedFields.data.payload);
    await addOrder(orderData, session.user.id);
    revalidatePath("/admin");
    return { success: true, error: null };
  } catch (e) {
    console.error(e);
    return { success: false, error: "Bestellung konnte nicht gespeichert werden. Bitte erneut versuchen." };
  }
}

const SubscriberSchema = z.object({
    email: z.string().email("Bitte geben Sie eine gültige E-Mail-Adresse ein."),
    source: z.string().optional(),
});

export async function subscribeToNewsletterAction(
    prevState: {
        success?: boolean;
        error?: string;
        message?: string;
    },
    formData: FormData
) {
    const validatedFields = SubscriberSchema.safeParse({
        email: formData.get("email"),
        source: formData.get("source"),
    });

    if (!validatedFields.success) {
        const errorMessages = validatedFields.error.errors.map(e => e.message).join('. ');
        return {
            error: errorMessages,
        };
    }
    
    try {
        await addContact(validatedFields.data.email);
        return { success: true, message: `Wir haben eine Bestätigungs-E-Mail an ${validatedFields.data.email} gesendet.` };
    } catch (e) {
        console.error(e);
        const error = e as any;
        if (error.name === 'validation_error' && error.message.includes('`email` must be unique')) {
            return { success: true, message: `Diese E-Mail-Adresse ist bereits registriert.` };
        }
        return { error: "Anmeldung fehlgeschlagen. Das Internet ist wahrscheinlich wieder kaputt." };
    }
}


export async function reduceCountdownAction(): Promise<{ newTargetDate: string } | { error: string }> {
    try {
        const currentTarget = await getCountdownTarget();
        const timeReductions = [
            15 * 60 * 1000,
            60 * 60 * 1000,
            3 * 60 * 60 * 1000,
            4 * 24 * 60 * 60 * 1000,
        ];
        const randomReduction = timeReductions[Math.floor(Math.random() * timeReductions.length)];
        const newTargetDate = new Date(currentTarget.getTime() - randomReduction);

        await updateCountdownTarget(newTargetDate);

        return { newTargetDate: newTargetDate.toISOString() };
    } catch (e) {
        console.error("Error reducing countdown:", e);
        return { error: "Zeit konnte nicht reduziert werden." };
    }
}

export async function logEventAction(type: 'page_view' | 'newsletter_subscription' | string, userId: string, path: string, params: object = {}) {
    await logAnalyticsEvent(type, path, userId, params);
}
