
"use server";

import { z } from "zod";
import { updateSeoMetadata } from "@/lib/admin-writes";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/session";

export type SeoActionState = {
  success: boolean;
  error?: string | null;
  message?: string;
};

const SeoMetadataSchema = z.object({
  slug: z.string(),
  title: z.string().optional(),
  metaDescription: z.string().optional(),
  keywords: z.string().optional(),
  canonicalUrl: z.string().optional(),
  robots: z.string().optional(),
  
  // OG
  ogTitle: z.string().optional(),
  ogDescription: z.string().optional(),
  ogImage: z.string().optional(),
  ogImageAlt: z.string().optional(),
  
  // Twitter
  twitterTitle: z.string().optional(),
  twitterDescription: z.string().optional(),
  twitterImage: z.string().optional(),
  twitterCard: z.string().optional(),

  // AEO
  aiSummary: z.string().optional(),
  aiKeywords: z.string().optional(),
});

export async function updateSeoMetadataAction(prevState: SeoActionState, formData: FormData): Promise<SeoActionState> {
    const session = await getSession();
    if (!session) return { success: false, error: "Nicht authentifiziert" };

    const validatedFields = SeoMetadataSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
        return { success: false, error: "Validierungsfehler: " + validatedFields.error.flatten().fieldErrors.title?.join(', ') };
    }
    
    try {
        const { slug, ...dataToUpdate } = validatedFields.data;

        await updateSeoMetadata(slug, dataToUpdate, session.user.id);
        
        const path = `/${slug}`;
        if (path !== '/home' && path !== '/') {
            revalidatePath(path);
        } else {
            revalidatePath('/');
        }
        revalidatePath('/admin/seo');

        return { success: true, message: "SEO-Metadaten erfolgreich aktualisiert." };
    } catch(e: any) {
        return { success: false, error: e.message };
    }
}
