import { getNewsletter } from "@/lib/firestore";
import { notFound } from "next/navigation";

export default async function NewsletterPreviewPage({ params }: { params: { slug: string } }) {
  const newsletter = await getNewsletter(params.slug);

  if (!newsletter || !newsletter.content) {
    notFound();
  }

  return (
    <div dangerouslySetInnerHTML={{ __html: newsletter.content }} />
  );
}
