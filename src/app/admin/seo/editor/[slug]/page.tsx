import { getSeoMetadata, getLegalPages, getPublishedExcerpts } from "@/lib/firestore";
import { notFound } from "next/navigation";
import { SeoEditorClient } from "./editor-client";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

// Re-use static paths from the overview page
const staticLPs = [
    { path: '/', title: 'Homepage' },
    { path: '/buchhandlung-paulik-reisch', title: 'Buchhandlung' },
    { path: '/lp2', title: 'LP2 - Excerpt Gate' },
    { path: '/lp3', title: 'LP3 - Book is Live' },
    { path: '/lp-series', title: 'LP - Buchserie' },
    { path: '/lp-pfeifer', title: 'LP - Pfeifer' },
    { path: '/lp-risitas', title: 'LP - Risitas' },
    { path: '/lp-luin', title: 'LP - Luin' },
    { path: '/los-chipirones', title: 'LP - Los Chipirones' },
];

async function getPageTitle(slug: string): Promise<string> {
    if (slug.startsWith('exzerpt-')) {
        const excerptSlug = slug.replace('exzerpt-', '');
        const excerpt = await getPublishedExcerpts().then(excerpts => excerpts.find(e => e.slug === excerptSlug));
        return excerpt?.title || slug;
    }
    
    const staticPage = staticLPs.find(p => (p.path.replace('/', '') || 'home') === slug);
    if (staticPage) return staticPage.title;

    const dynamicPage = await getLegalPages().then(pages => pages.find(p => p.id === slug));
    if (dynamicPage) return dynamicPage.title;

    return slug; // Fallback
}


export default async function SeoEditorPage({ params }: { params: { slug: string } }) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const { slug } = params;
  const seoData = await getSeoMetadata(slug);
  const pageTitle = await getPageTitle(slug);

  // We pass a default object if no data exists, so the form has all fields
  const initialData = seoData || {
      id: slug,
      title: '',
      metaDescription: '',
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-background text-foreground">
      <SeoEditorClient initialData={initialData} pageTitle={pageTitle} pageSlug={slug} />
    </div>
  );
}
