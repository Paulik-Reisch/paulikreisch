import type { GuideArticle } from './types';
import { guidePillars } from './pillars';
import satire from './content/satire-schreiben.json';
import zeugnis from './content/zeugnissprache.json';
import lehrer from './content/geschenk-lehrer.json';
import abi from './content/abiturgeschenk.json';
import schule from './content/schulalltag.json';
import witze from './content/schulwitze.json';
import amt from './content/beamtendeutsch.json';
import sprache from './content/deutsche-sprache.json';
import deutsch from './content/typisch-deutsch.json';
import etikette from './content/etikette.json';
export { guidePillars } from './pillars';
export const guideContent: Record<string, GuideArticle[]> = {
  'satire-schreiben':satire, zeugnissprache:zeugnis, 'geschenk-lehrer':lehrer, abiturgeschenk:abi,
  schulalltag:schule, schulwitze:witze, beamtendeutsch:amt, 'deutsche-sprache':sprache, 'typisch-deutsch':deutsch, etikette,
};
export const getGuidePillar = (slug: string) => guidePillars.find(pillar => pillar.slug === slug);
export const getGuideArticles = (slug: string): GuideArticle[] => guideContent[slug] ?? [];
export const getGuideArticle = (pillar: string, slug: string) => getGuideArticles(pillar).find(article => article.slug === slug);
export const guidePaths = () => guidePillars.flatMap(pillar => [
  `/ratgeber/${pillar.slug}`, ...getGuideArticles(pillar.slug).map(article => `/ratgeber/${pillar.slug}/${article.slug}`),
]);
