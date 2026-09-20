
import { getLandingPageBySlug } from "@/lib/firestore";
import { notFound } from "next/navigation";
import { LpEditorClient } from "./editor-client";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function LandingPageEditorPage({ params }: { params: Promise<{ slug: string }> }) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const { slug } = await params;
  const isNew = slug === 'new';

  if (isNew) {
    return (
        <div>
            <h1 className="text-3xl font-bold font-headline mb-6">Neue Landing Page</h1>
            <LpEditorClient />
        </div>
    )
  }

  const landingPage = await getLandingPageBySlug(slug);

  if (!landingPage) {
    notFound();
  }

  return (
    <div>
        <h1 className="text-3xl font-bold font-headline mb-6">Landing Page bearbeiten: {landingPage.title}</h1>
        <LpEditorClient page={landingPage} />
    </div>
  );
}
