
import { getNewsletter } from "@/lib/firestore";
import { notFound } from "next/navigation";
import { NewsletterEditorClient } from "./editor-client";

export default async function NewsletterEditorPage({ params }: { params: { slug: string } }) {
  const newsletter = await getNewsletter(params.slug);

  if (!newsletter) {
    notFound();
  }

  return (
    <div className="flex flex-col h-screen bg-muted/40 w-full fixed inset-0">
      <NewsletterEditorClient newsletter={newsletter} />
    </div>
  );
}
