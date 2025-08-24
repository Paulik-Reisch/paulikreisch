"use server";

import { z } from "zod";
import {
  generateTestimonial,
} from "@/ai/flows/generate-testimonial";
import { continueChapter } from "@/ai/flows/continue-chapter-flow";
import { generateFootnote } from "@/ai/flows/generate-footnote-flow";
import { generateReportCard } from "@/ai/flows/generate-report-card-flow";
import { generateBureaucracyResponse } from "@/ai/flows/generate-bureaucracy-flow";

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
