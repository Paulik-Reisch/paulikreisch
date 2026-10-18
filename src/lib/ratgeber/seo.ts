import type { Metadata } from 'next';
import type { GuideArticle } from './types';
import { guideRevision, type GuidePillar } from './pillars';
export const guideSite = 'https://paulikreisch.de';
const publisher = { '@type':'Organization', '@id':`${guideSite}/#organization`, name:'Paulik & Reisch', url:guideSite };
export function guideMetadata(title: string, description: string, path: string, article = false): Metadata {
  return {
    title:{absolute:`${title} | Paulik & Reisch`}, description,
    alternates:{canonical:path}, robots:{index:true,follow:true,'max-image-preview':'large'},
    openGraph:{title,description,url:`${guideSite}${path}`,type:article?'article':'website',locale:'de_DE',siteName:'Paulik & Reisch',images:[{url:`${guideSite}/hero-ab/hero-01-papier.jpg`,alt:'Hallo Welt – Satire von Paulik & Reisch',width:2100,height:900}]},
    twitter:{card:'summary_large_image',title,description,images:[`${guideSite}/hero-ab/hero-01-papier.jpg`]},
  };
}
export function guideBreadcrumbs(items: {name:string;path:string}[]) {
  return {'@type':'BreadcrumbList',itemListElement:items.map((item,index)=>({'@type':'ListItem',position:index+1,name:item.name,item:`${guideSite}${item.path}`}))};
}
export function guideSchema(pillar: GuidePillar, article?: GuideArticle, articles: GuideArticle[] = []) {
  const path = `/ratgeber/${pillar.slug}${article?`/${article.slug}`:''}`;
  const url = `${guideSite}${path}`;
  const title = article?.title ?? pillar.title;
  const description = article?.description ?? pillar.description;
  const breadcrumbs = [{name:'Startseite',path:'/'},{name:'Ratgeber',path:'/ratgeber'},{name:pillar.title,path:`/ratgeber/${pillar.slug}`}];
  if(article) breadcrumbs.push({name:article.title,path});
  const faq = article?.faqs ?? [];
  return {'@context':'https://schema.org','@graph':[
    publisher,
    {'@type':article?'WebPage':'CollectionPage','@id':`${url}#webpage`,url,name:title,description,inLanguage:'de-DE',isPartOf:{'@id':`${guideSite}/ratgeber#collection`},mainEntity:{'@id':`${url}${article?'#article':'#topics'}`}},
    guideBreadcrumbs(breadcrumbs),
    article ? {'@type':'Article','@id':`${url}#article`,url,headline:title,description,inLanguage:'de-DE',dateModified:guideRevision,mainEntityOfPage:{'@id':`${url}#webpage`},author:publisher,publisher,articleSection:pillar.title}
      : {'@type':'ItemList','@id':`${url}#topics`,numberOfItems:articles.length,itemListElement:articles.map((item,index)=>({'@type':'ListItem',position:index+1,name:item.title,url:`${url}/${item.slug}`}))},
    ...(faq.length?[{'@type':'FAQPage','@id':`${url}#fragen`,isPartOf:{'@id':`${url}#webpage`},mainEntity:faq.map(item=>({'@type':'Question',name:item.question,acceptedAnswer:{'@type':'Answer',text:item.answer}}))}]:[]),
  ]};
}
export const serializeGuideSchema = (value: unknown) => JSON.stringify(value).replace(/</g,'\\u003c').replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029');
