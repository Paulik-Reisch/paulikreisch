import { getNewsletterAdmin } from '@/lib/admin-writes';
import { getSession } from '@/lib/session';
import { notFound, redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';
export default async function NewsletterDraftPreview({ params }: { params: Promise<{ slug: string }> }) {
  if (!await getSession()) redirect('/login');
  const newsletter = await getNewsletterAdmin((await params).slug);
  if (!newsletter?.content) notFound();
  return <section>
    <h1 className="text-2xl font-bold mb-4">Newsletter-Vorschau</h1>
    <p className="text-sm text-muted-foreground mb-4">Private Ansicht. Nicht über diesen Link veröffentlicht.</p>
    <iframe title="Newsletter-Vorschau" sandbox="" referrerPolicy="no-referrer"
      srcDoc={newsletter.content} className="w-full min-h-[80vh] border-0 bg-white" />
  </section>;
}
