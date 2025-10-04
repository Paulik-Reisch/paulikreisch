

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
    <div className="flex flex-col h-full">
      <div className="h-full">
         <EditorClient page={page} />
      </div>
    </div>
  );
}
