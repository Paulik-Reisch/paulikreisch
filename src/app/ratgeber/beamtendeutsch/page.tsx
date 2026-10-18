import { GuidePillarPage } from '@/components/ratgeber/guide-page';
import { getGuidePillar } from '@/lib/ratgeber/registry';
import { guideMetadata } from '@/lib/ratgeber/seo';
const pillar = getGuidePillar('beamtendeutsch')!;
export const metadata = guideMetadata(pillar.title,pillar.description,'/ratgeber/beamtendeutsch');
export default function Page(){ return <GuidePillarPage pillar={pillar}/>; }
