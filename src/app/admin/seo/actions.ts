
"use server";

import { z } from "zod";
import { updateSeoMetadata, getArticleBySlug } from "@/lib/firestore";
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

        // If the slug is for an article, fetch the article to use its title and teaser as a fallback
        if (slug.startsWith('a-')) {
            const article = await getArticleBySlug(slug.replace('a-', ''));
            if (article) {
                if (!dataToUpdate.title) dataToUpdate.title = article.title;
                if (!dataToUpdate.ogTitle) dataToUpdate.ogTitle = article.title;
                if (!dataToUpdate.twitterTitle) dataToUpdate.twitterTitle = article.title;

                if (!dataToUpdate.metaDescription) dataToUpdate.metaDescription = article.teaser;
                if (!dataToUpdate.ogDescription) dataToUpdate.ogDescription = article.teaser;
                if (!dataToUpdate.twitterDescription) dataToUpdate.twitterDescription = article.teaser;
            }
        }
        
        await updateSeoMetadata(slug, dataToUpdate, session.user.id);
        
        const path = slug.startsWith('a-') ? `/a/${slug.replace('a-', '')}` : `/${slug}`;
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
