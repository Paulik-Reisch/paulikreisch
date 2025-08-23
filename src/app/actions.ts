"use server";

import { z } from "zod";
import {
  generateTestimonial,
} from "@/ai/flows/generate-testimonial";
import { continueChapter } from "@/ai/flows/continue-chapter-flow";

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