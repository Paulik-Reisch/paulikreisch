
import { getLegalPage } from "@/lib/firestore";
import { notFound } from "next/navigation";
import { EditorClient } from "./editor-client";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function EditorPage({ params }: { params: { slug: string } }) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const { slug } = params;
  const page = await getLegalPage(slug);

  if (!page) {
    notFound();
  }

  return (
    <div className="flex flex-col h-screen bg-muted/40 w-full fixed inset-0 p-4 md:p-6">
      <EditorClient page={page} />
    </div>
  );
}
