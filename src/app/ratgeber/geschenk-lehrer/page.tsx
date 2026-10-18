import { GuidePillarPage } from '@/components/ratgeber/guide-page';
import { getGuidePillar } from '@/lib/ratgeber/registry';
import { guideMetadata } from '@/lib/ratgeber/seo';
const pillar = getGuidePillar('geschenk-lehrer')!;
export const metadata = guideMetadata(pillar.title,pillar.description,'/ratgeber/geschenk-lehrer');
export default function Page(){ return <GuidePillarPage pillar={pillar}/>; }
