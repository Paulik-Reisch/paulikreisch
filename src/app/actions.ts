"use server";

import { z } from "zod";
import {
  generateTestimonial,
} from "@/ai/flows/generate-testimonial";

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
