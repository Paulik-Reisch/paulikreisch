import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync,existsSync} from 'node:fs';
test('removed checklist has no live page, PDF, generator or mail promise',()=>{
 for(const path of ['src/app/checkliste/page.tsx','public/checkliste-lernvollzugsanstalt.pdf','scripts/build-checklist-pdf.mjs'])assert.equal(existsSync(path),false,path);
 for(const path of ['public/llms.txt','src/newsletter/funnel-day0.ts','src/lib/funnel-emails.ts'])assert.doesNotMatch(readFileSync(path,'utf8'),/checkliste-lernvollzugsanstalt|checklistUrl|Deine Checkliste/);
 assert.doesNotMatch(readFileSync('src/newsletter/funnel-day0.ts','utf8'),/\.send\(/);
});
