
import { getExcerpt } from "@/lib/firestore";
import { notFound } from "next/navigation";
import { ExcerptEditorClient } from "./editor-client";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function ExcerptEditorPage({ params }: { params: { slug: string } }) {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }

  const { slug } = params;
  const excerpt = await getExcerpt(slug);

  if (!excerpt) {
    notFound();
  }

  return (
    <div className="flex flex-col h-screen bg-muted/40 w-full fixed inset-0 p-4 md:p-6">
      <ExcerptEditorClient excerpt={excerpt} />
    </div>
  );
}
