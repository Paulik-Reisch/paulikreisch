import type { Metadata } from 'next';
import { HomePage } from '@/components/home/home-page';
import { getHomeMetadata, homeStructuredData } from '@/lib/home-seo';

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return getHomeMetadata();
}

export default function Home() {
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homeStructuredData).replace(/</g, '\u003c') }} />
    <HomePage />
  </>;
}
