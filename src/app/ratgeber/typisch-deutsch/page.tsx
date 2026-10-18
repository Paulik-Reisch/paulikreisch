import { GuidePillarPage } from '@/components/ratgeber/guide-page';
import { getGuidePillar } from '@/lib/ratgeber/registry';
import { guideMetadata } from '@/lib/ratgeber/seo';
const pillar = getGuidePillar('typisch-deutsch')!;
export const metadata = guideMetadata(pillar.title,pillar.description,'/ratgeber/typisch-deutsch');
export default function Page(){ return <GuidePillarPage pillar={pillar}/>; }
