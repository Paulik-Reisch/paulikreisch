"use server";

import { z } from "zod";
import {
  generateTestimonial,
} from "@/ai/flows/generate-testimonial";

const testimonialSchema = z.object({
  topic: z.string().min(2, { message: "Topic must be at least 2 characters." }).max(50),
  customerType: z.string().min(2, { message: "Customer type must be at least 2 characters." }).max(50),
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
    return { error: "Failed to generate testimonial. The AI might be on a coffee break." };
  }
}
