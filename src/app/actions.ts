
"use server";

import { z } from "zod";
import {
  generateTestimonial,
} from "@/ai/flows/generate-testimonial";
import { continueChapter } from "@/ai/flows/continue-chapter-flow";
import { generateFootnote } from "@/ai/flows/generate-footnote-flow";
import { generateReportCard } from "@/ai/flows/generate-report-card-flow";
import { generateBureaucracyResponse } from "@/ai/flows/generate-bureaucracy-flow";
import { generateDbExcuse } from "@/ai/flows/generate-db-excuse-flow";
import { generateSatireType } from "@/ai/flows/generate-satire-type-flow";
import { pfeiferTranslate } from "@/ai/flows/pfeifer-translate-flow";
import { addOrder, addSubscriber } from "@/lib/firestore";
import { revalidatePath } from "next/cache";

const testimonialSchema = z.object({
  topic: z.string().min(2, { message: "Das Thema muss mindestens 2 Zeichen lang sein." }).max(50),
  customerType: z.string().min(2, { message: "Der Kundentyp muss mindestens 2 Zeichen lang sein." }).max(50),
});

export async function createTestimonialAction(
  prevState: {
    testimonial?: string;
    error?: string;
  },
  formData: FormData
) {
  const validatedFields = testimonialSchema.safeParse({
    topic: formData.get("topic"),
    customerType: formData.get("customerType"),
  });

  if (!validatedFields.success) {
    const errorMessages = validatedFields.error.errors.map(e => e.message).join('. ');
    return {
      error: errorMessages,
    };
  }

  try {
    const result = await generateTestimonial(validatedFields.data);
    return { testimonial: result.testimonial };
  } catch (e) {
    console.error(e);
    return { error: "Testimonial konnte nicht generiert werden. Die KI macht vielleicht gerade eine Kaffeepause." };
  }
}

const chapterSchema = z.object({
  chapterText: z.string().min(20, { message: "Das Kapitel muss mindestens 20 Zeichen lang sein, um fortgesetzt zu werden." }),
});

export async function continueChapterAction(
  prevState: {
    chapterContinuation?: string;
    error?: string;
  },
  formData: FormData
) {
  const validatedFields = chapterSchema.safeParse({
    chapterText: formData.get("chapterText"),
  });

  if (!validatedFields.success) {
    const errorMessages = validatedFields.error.errors.map(e => e.message).join('. ');
    return {
      error: errorMessages,
    };
  }

  try {
    const result = await continueChapter(validatedFields.data);
    return { chapterContinuation: result.continuation };
  } catch (e) {
    console.error(e);
    return { error: "Kapitel konnte nicht fortgesetzt werden. Der KI sind die Worte ausgegangen." };
  }
}

const footnoteSchema = z.object({
  topic: z.string().min(2, { message: "Das Thema muss mindestens 2 Zeichen lang sein." }).max(50),
});

export async function createFootnoteAction(
  prevState: {
    footnote?: string;
    error?: string;
  },
  formData: FormData
) {
  const validatedFields = footnoteSchema.safeParse({
    topic: formData.get("topic"),
  });

  if (!validatedFields.success) {
    const errorMessages = validatedFields.error.errors.map(e => e.message).join('. ');
    return {
      error: errorMessages,
    };
  }

  try {
    const result = await generateFootnote(validatedFields.data);
    return { footnote: result.footnote };
  } catch (e) {
    console.error(e);
    return { error: "Fußnote konnte nicht generiert werden. Die KI hat wohl gerade Schreibkrampf." };
  }
}

const reportCardSchema = z.object({
    studentName: z.string().min(2, { message: "Der Name muss mindestens 2 Zeichen haben." }).max(50),
});

export async function createReportCardAction(
  prevState: any,
  formData: FormData
) {
    const validatedFields = reportCardSchema.safeParse({
        studentName: formData.get("studentName"),
    });

    if (!validatedFields.success) {
        const errorMessages = validatedFields.error.errors.map(e => e.message).join('. ');
        return {
            reportCard: null,
            error: errorMessages,
        };
    }

    try {
        const result = await generateReportCard(validatedFields.data);
        return { reportCard: result, error: null };
    } catch (e) {
        console.error(e);
        return { reportCard: null, error: "Zeugnis konnte nicht erstellt werden. Die Notenkonferenz dauert wohl länger." };
    }
}

const bureaucracySchema = z.object({
    problem: z.string().min(5, { message: "Ihr Problem muss mindestens 5 Zeichen haben." }).max(200),
});

export async function createBureaucracyResponseAction(
  prevState: any,
  formData: FormData
) {
    const validatedFields = bureaucracySchema.safeParse({
        problem: formData.get("problem"),
    });

    if (!validatedFields.success) {
        const errorMessages = validatedFields.error.errors.map(e => e.message).join('. ');
        return {
            response: null,
            error: errorMessages,
        };
    }

    try {
        const result = await generateBureaucracyResponse(validatedFields.data);
        return { response: result, error: null };
    } catch (e) {
        console.error(e);
        return { response: null, error: "Antwort konnte nicht erstellt werden. Der zuständige Sachbearbeiter ist im Urlaub." };
    }
}

export async function createDbExcuseAction(
  prevState: any,
  formData: FormData
) {
    try {
        const result = await generateDbExcuse();
        return { excuse: result, error: null };
    } catch (e) {
        console.error(e);
        return { excuse: null, error: "Ausrede konnte nicht generiert werden. Der Vorrat an kreativen Katastrophen ist vorübergehend erschöpft." };
    }
}


const GenerateSatireTypeInputSchema = z.object({
    q1: z.string().min(1, "Bitte beantworten Sie alle Fragen."),
    q2: z.string().min(1, "Bitte beantworten Sie alle Fragen."),
    q3: z.string().min(1, "Bitte beantworten Sie alle Fragen."),
    q4: z.string().min(1, "Bitte beantworten Sie alle Fragen."),
    q5: z.string().min(1, "Bitte beantworten Sie alle Fragen."),
});

export async function createSatireTypeAction(
    prevState: any,
    formData: FormData
) {
    const validatedFields = GenerateSatireTypeInputSchema.safeParse({
        q1: formData.get("q1"),
        q2: formData.get("q2"),
        q3: formData.get("q3"),
        q4: formData.get("q4"),
        q5: formData.get("q5"),
    });

    if (!validatedFields.success) {
        // Find the first error message and return it.
        const errorMessages = validatedFields.error.errors.map(e => e.message).join('. ');
        return {
            result: null,
            error: errorMessages,
        };
    }

    try {
        const result = await generateSatireType(validatedFields.data);
        return { result: result, error: null };
    } catch (e) {
        console.error(e);
        return { result: null, error: "Analyse fehlgeschlagen. Der Psychoanalytiker ist gerade in der Kaffeepause." };
    }
}

const pfeiferTranslateSchema = z.object({
  text: z.string().min(1, "Bitte geben Sie einen Text ein.").max(500, "Der Text darf maximal 500 Zeichen lang sein."),
  intensity: z.coerce.number().min(1).max(5).default(3),
});

export async function pfeiferTranslateAction(
  prevState: {
    translation?: string;
    error?: string;
  },
  formData: FormData
) {
  const validatedFields = pfeiferTranslateSchema.safeParse({
    text: formData.get("text"),
    intensity: formData.get("intensity"),
  });

  if (!validatedFields.success) {
    const errorMessages = validatedFields.error.errors.map(e => e.message).join('. ');
    return {
      error: errorMessages,
    };
  }

  try {
    const result = await pfeiferTranslate(validatedFields.data);
    return { translation: result.translation };
  } catch (e) {
    console.error(e);
    return { error: "Übersetzung fehlgeschlagen. La Silbadora macht gerade Siesta." };
  }
}


const OrderSchema = z.object({
  payload: z.string(),
});

export async function createOrderAction(
  prevState: any,
  formData: FormData
) {
  const validatedFields = OrderSchema.safeParse({
    payload: formData.get("payload"),
  });

  if (!validatedFields.success) {
    return { success: false, error: "Ungültige Bestelldaten." };
  }

  try {
    const orderData = JSON.parse(validatedFields.data.payload);
    await addOrder(orderData);
    revalidatePath("/admin");
    return { success: true, error: null };
  } catch (e) {
    console.error(e);
    return { success: false, error: "Bestellung konnte nicht gespeichert werden. Bitte versuchen Sie es erneut." };
  }
}

const SubscriberSchema = z.object({
    email: z.string().email("Bitte geben Sie eine gültige E-Mail Adresse ein."),
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
        await addSubscriber(validatedFields.data.email, validatedFields.data.source);
        return { success: true, message: `Wir haben eine Bestätigungs-E-Mail an ${validatedFields.data.email} gesendet. (Nicht wirklich, aber danke für's Mitmachen!)` };
    } catch (e) {
        console.error(e);
        const error = e as Error;
        if (error.message.includes("existiert bereits")) {
            return { success: true, message: `Diese E-Mail ist bereits registriert. Sie bleiben auf dem Laufenden!` };
        }
        return { error: "Anmeldung fehlgeschlagen. Das Internet ist wahrscheinlich wieder kaputt." };
    }
}

    
