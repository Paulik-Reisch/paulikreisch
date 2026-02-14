import { getSeoMetadata } from "@/lib/firestore";
import { notFound } from "next/navigation";
import { SeoEditorClient } from "./editor-client";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function SeoEditorPage({ params }: { params: { slug: string } }) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const { slug } = params;
  // We fetch metadata. If it's null, the editor will show empty fields.
  const metadata = await getSeoMetadata(slug);

  const getPagePath = () => {
    if (slug.startsWith('a-')) return `/artikel/${slug.replace('a-', '')}`;
    if (slug.startsWith('lp-')) return `/lp/${slug.replace('lp-', '')}`;
    if (slug === 'home') return '/';
    return `/${slug}`;
  }

  return (
    <div>
        <h1 className="text-3xl font-bold font-headline mb-1">SEO-Editor</h1>
        <p className="text-muted-foreground mb-6">Optimieren Sie die Metadaten für die Seite: <code className="bg-muted px-2 py-1 rounded-md text-sm">{getPagePath()}</code></p>
        <SeoEditorClient slug={slug} metadata={metadata} />
    </div>
  );
}
