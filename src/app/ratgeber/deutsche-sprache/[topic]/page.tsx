import { notFound } from 'next/navigation';
import { GuideArticlePage } from '@/components/ratgeber/guide-page';
import { getGuidePillar, getGuideArticle, getGuideArticles } from '@/lib/ratgeber/registry';
import { guideMetadata } from '@/lib/ratgeber/seo';
const pillar = getGuidePillar('deutsche-sprache')!;
export const dynamicParams = false;
export function generateStaticParams(){return getGuideArticles(pillar.slug).map(article=>({topic:article.slug}));}
export async function generateMetadata({params}:{params:Promise<{topic:string}>}){
 const {topic}=await params;const article=getGuideArticle(pillar.slug,topic);if(!article)notFound();
 return guideMetadata(article.title,article.description,'/ratgeber/deutsche-sprache/'+article.slug,true);
}
export default async function Page({params}:{params:Promise<{topic:string}>}){
 const {topic}=await params;const article=getGuideArticle(pillar.slug,topic);if(!article)notFound();
 return <GuideArticlePage pillar={pillar} article={article}/>;
}
