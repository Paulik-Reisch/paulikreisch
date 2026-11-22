import { getLandingPages } from '@/lib/firestore';
import { LandingPagesAdminView } from './landing-pages-view';

export default async function LandingPagesAdminPage() {
  return <LandingPagesAdminView landingPages={await getLandingPages()} />;
}
