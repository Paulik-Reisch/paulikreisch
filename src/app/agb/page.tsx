
import { getLegalPageCached } from "@/lib/legal-pages-cache";
import { notFound } from "next/navigation";
import { LegalPage } from "@/components/landing/legal-page";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Allgemeine Geschäftsbedingungen',
  description: 'Bedingungen für die Nutzung unserer Angebote und den Erwerb unserer Publikationen.',
  alternates: { canonical: '/agb' },
};

// This is now a Server Component
export default async function AGBPage() {
  const page = await getLegalPageCached('agb');

  if (!page) {
    notFound();
  }

  const lastUpdatedDate = format(new Date(page.lastUpdated), "dd. MMMM yyyy", { locale: de });
  const showTitle = page.showTitle !== false;
  const showDate = page.showDate !== false;

  return (
    <LegalPage title={showTitle ? page.title : 'Allgemeine Geschäftsbedingungen'} description="Bedingungen für die Nutzung unserer Angebote und den Erwerb unserer Publikationen.">
      {showDate && <p className="text-sm text-muted-foreground">Zuletzt aktualisiert am {lastUpdatedDate}</p>}
      <div dangerouslySetInnerHTML={{ __html: page.content }} />
    </LegalPage>
  );
}
