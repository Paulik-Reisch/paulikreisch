import { getLandingPages, getLegalPages, getAllSeoMetadata } from '@/lib/firestore';
import { SeoAdminView } from './seo-view';

export default async function SeoAdminPage() {
  const [landingPages, legalPages, allSeoData] = await Promise.all([getLandingPages(), getLegalPages(), getAllSeoMetadata()]);
  return <SeoAdminView landingPages={landingPages} legalPages={legalPages} allSeoData={allSeoData} />;
}
