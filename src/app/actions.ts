

'use server';

import { z } from "zod";
import { addOrder, addSubscriber, addLog } from "@/lib/firestore";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/session";


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
    return { success: false, error: "Bestellung konnte nicht gespeichert werden. Bitte versuche es erneut." };
  }
}

const SubscriberSchema = z.object({
    email: z.string().email("Bitte gib eine gültige E-Mail-Adresse ein."),
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
    const session = await getSession();
    const user = session?.user?.id || 'Gast';

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
        await addSubscriber(validatedFields.data.email, validatedFields.data.source, user);
        return { success: true, message: `Wir haben eine Bestätigungs-E-Mail an ${validatedFields.data.email} gesendet.` };
    } catch (e) {
        console.error(e);
        const error = e as Error;
        if (error.message.includes("existiert bereits")) {
            return { success: true, message: `Diese E-Mail ist bereits registriert. Du bleibst auf dem Laufenden!` };
        }
        return { error: "Anmeldung fehlgeschlagen. Das Internet ist wahrscheinlich wieder kaputt." };
    }
}
