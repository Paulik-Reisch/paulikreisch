import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { guidePillars, getGuideArticles, guidePaths } from '../../src/lib/ratgeber/registry';
import { guideMetadata, guideSchema, serializeGuideSchema } from '../../src/lib/ratgeber/seo';
import plan from '../../src/lib/ratgeber/cluster-plan.json';
import type { GuideArticle } from '../../src/lib/ratgeber/types';
const visibleText = (article:GuideArticle) => [article.answer,...article.sections.flatMap(section=>[section.title,...section.paragraphs,...(section.bullets??[]),...(section.table?.rows.flat()??[])]),...article.faqs.flatMap(faq=>[faq.question,faq.answer])].join(' ');

test('all 119 planned cluster routes exist once and remain linked to their pillar',()=>{
  assert.equal(guidePillars.length,10);
  let total=0;
  for(const pillar of guidePillars){
    const articles=getGuideArticles(pillar.slug);
    const expected=plan[pillar.slug].map(item=>item.slug);
    assert.deepEqual(articles.map(article=>article.slug).sort(),expected.sort(),pillar.slug);
    assert.equal(new Set(articles.map(article=>article.slug)).size,articles.length);
    total+=articles.length;
  }
  assert.equal(total,119);
  assert.equal(new Set(guidePaths()).size,129);
});

test('every cluster answers a distinct question with useful sections, examples and FAQs',()=>{
  const titles=new Set<string>();
  const paragraphs=new Map<string,string>();
  for(const pillar of guidePillars){
    const articles=getGuideArticles(pillar.slug);
    for(const article of articles){
      const label=`${pillar.slug}/${article.slug}`;
      assert.match(article.slug,/^[a-z0-9-]+$/,label);
      assert.ok(article.title.length>12,label);
      assert.ok(!titles.has(article.title),`duplicate title: ${article.title}`);titles.add(article.title);
      assert.ok(article.description.length>=70&&article.description.length<=250,`description: ${label}`);
      assert.ok(article.answer.length>=100,`answer: ${label}`);
      assert.ok(visibleText(article).split(/\s+/u).length>=400,`article under400words: ${label}`);
      assert.ok(article.sections.length>=4,`sections: ${label}`);
      const ids=article.sections.map(section=>section.id);
      assert.equal(new Set(ids).size,ids.length,label);
      for(const section of article.sections){
        assert.match(section.id,/^[a-z0-9-]+$/);
        assert.ok(!['kurzantwort','fragen','quellen','ratgeber-inhalt'].includes(section.id),label);
        assert.ok(section.paragraphs.length>=1,label);
        for(const paragraph of section.paragraphs){
          assert.ok(!/[<>]/.test(paragraph),`unexpected HTML: ${label}`);
          if(paragraph.length>180){assert.ok(!paragraphs.has(paragraph),`repeated paragraph in ${label} and ${paragraphs.get(paragraph)}`);paragraphs.set(paragraph,label);}
        }
        if(section.table) for(const row of section.table.rows) assert.equal(row.length,section.table.headers.length,`table: ${label}`);
      }
      assert.ok(article.faqs.length>=2,`FAQ: ${label}`);
      for(const source of article.sources??[]) assert.equal(new URL(source.url).protocol,'https:');
      for(const related of article.related??[]) assert.ok(articles.some(item=>item.slug===related&&item.slug!==article.slug),`related link: ${label}/${related}`);
    }
  }
});

test('schema, canonical metadata and visible FAQs share the same article data',()=>{
  for(const pillar of guidePillars) for(const article of getGuideArticles(pillar.slug)){
    const path=`/ratgeber/${pillar.slug}/${article.slug}`;
    const metadata=guideMetadata(article.title,article.description,path,true);
    assert.deepEqual(metadata.title,{absolute:`${article.title} | Paulik & Reisch`});
    assert.equal(metadata.alternates?.canonical,path);
    const graph=guideSchema(pillar,article)['@graph'];
    const faq=graph.find(item=>item['@type']==='FAQPage') as {mainEntity:{name:string;acceptedAnswer:{text:string}}[]};
    assert.deepEqual(faq.mainEntity.map(item=>({question:item.name,answer:item.acceptedAnswer.text})),article.faqs);
    assert.equal(graph.filter(item=>item['@type']==='Article').length,1);
    const breadcrumb=graph.find(item=>item['@type']==='BreadcrumbList') as {itemListElement:unknown[]};
    assert.equal(breadcrumb.itemListElement.length,4);
  }
});

test('JSON-LD escapes script termination and round-trips Unicode safely',()=>{
  const value={text:'</script><script>alert(1)</script>\u2028\u2029'};
  const serialized=serializeGuideSchema(value);
  assert.ok(!serialized.includes('<'));
  assert.deepEqual(JSON.parse(serialized),value);
});

test('XML sitemap includes registry paths and old editorial scaffolding is removed',()=>{
  const sitemap=readFileSync('src/app/sitemap.xml/route.ts','utf8');
  assert.match(sitemap,/guidePaths\(\)/);
  assert.match(sitemap,/path: '\/leseprobe'/);
  for(const pillar of guidePillars){
    const page=readFileSync(`src/app/ratgeber/${pillar.slug}/page.tsx`,'utf8');
    assert.doesNotMatch(page,/CLUSTER-PLAN|PROMO-HOOKS|VERLINKUNGS-PFLICHTEN/);
    assert.match(page,/GuidePillarPage/);
    const route=readFileSync(`src/app/ratgeber/${pillar.slug}/[topic]/page.tsx`,'utf8');
    assert.match(route,/dynamicParams = false/);
    assert.match(route,/notFound\(\)/);
  }
});
