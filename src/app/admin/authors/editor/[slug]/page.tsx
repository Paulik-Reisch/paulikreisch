
import { getAuthorBySlug } from "@/lib/firestore";
import { notFound } from "next/navigation";
import { AuthorEditorClient } from "./editor-client";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function AuthorEditorPage({ params }: { params: { slug: string } }) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const { slug } = params;
  const isNew = slug === 'new';

  if (isNew) {
    return (
        <div>
            <h1 className="text-3xl font-bold font-headline mb-6">Neuen Autor anlegen</h1>
            <AuthorEditorClient />
        </div>
    )
  }

  const author = await getAuthorBySlug(slug);

  if (!author) {
    notFound();
  }

  return (
    <div>
        <h1 className="text-3xl font-bold font-headline mb-6">Autor bearbeiten</h1>
        <AuthorEditorClient author={author} />
    </div>
  );
}
