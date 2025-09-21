import { getLegalPage } from "@/lib/firestore";
import { notFound } from "next/navigation";
import { EditorClient } from "./editor-client";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";

export default async function EditorPage({ params }: { params: { slug: string } }) {
  const page = await getLegalPage(params.slug);

  if (!page) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-muted/40">
      <Header />
      <main className="flex-1 flex flex-col p-4 md:p-6">
          <EditorClient page={page} />
      </main>
      <Footer />
    </div>
  );
}
