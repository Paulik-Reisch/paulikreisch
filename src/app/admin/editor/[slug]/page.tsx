
import { getArticleBySlug } from "@/lib/firestore";
import { notFound } from "next/navigation";
import { ArticleEditorClient } from "./editor-client";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function ArticleEditorPage({ params }: { params: { slug: string } }) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const { slug } = params;
  const isNew = slug === 'new';

  if (isNew) {
    return (
        <div>
            <h1 className="text-3xl font-bold font-headline mb-6">Neuer Artikel</h1>
            <ArticleEditorClient />
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
        <ArticleEditorClient article={article} />
    </div>
  );
}
