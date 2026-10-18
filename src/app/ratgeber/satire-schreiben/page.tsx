import { GuidePillarPage } from '@/components/ratgeber/guide-page';
import { getGuidePillar } from '@/lib/ratgeber/registry';
import { guideMetadata } from '@/lib/ratgeber/seo';
const pillar = getGuidePillar('satire-schreiben')!;
export const metadata = guideMetadata(pillar.title,pillar.description,'/ratgeber/satire-schreiben');
export default function Page(){ return <GuidePillarPage pillar={pillar}/>; }
