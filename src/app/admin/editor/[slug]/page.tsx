
import { getArticleBySlug, getAuthors } from "@/lib/firestore";
import { notFound } from "next/navigation";
import { ArticleEditorClient } from "./editor-client";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function ArticleEditorPage({ params }: { params: Promise<{ slug: string }> }) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const { slug } = await params;
  const isNew = slug === 'new';

  const authors = await getAuthors();

  if (isNew) {
    return (
        <div>
            <h1 className="text-3xl font-bold font-headline mb-6">Neuer Artikel</h1>
            <ArticleEditorClient authors={authors} />
        </div>
    )
  }

  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <div>
        <h1 className="text-3xl font-bold font-headline mb-6">Artikel bearbeiten</h1>
        <ArticleEditorClient article={article} authors={authors} />
    </div>
  );
}
