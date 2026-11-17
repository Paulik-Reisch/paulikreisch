import { getPublishedNewsletterHtml } from "@/lib/newsletter-preview";

export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";

export default async function NewsletterPreviewPage({ params }: { params: Promise<{ slug: string }> }) {
  const content = await getPublishedNewsletterHtml((await params).slug);

  if (!content) {
    notFound();
  }

  return (
    <div dangerouslySetInnerHTML={{ __html: content }} />
  );
}
