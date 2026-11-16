import test from 'node:test';
import assert from 'node:assert/strict';
import {validateDocument} from '../../src/marketing/model.mjs';
import {renderPage,newsletterExport} from '../../src/marketing/render.mjs';
const base=()=>({kind:'newsletter',mode:'custom',slug:'sommer',name:'Sommer',subject:'Schule aus.',preheader:'Vorschau',code:{html:'<table><tr><td><a href="https://paulikreisch.de/shop">Shop</a> Mozartstraße 1, 53819 Neunkirchen <a href="{{abmeldelink}}">Abmelden</a></td></tr></table>',css:'Text {{abmeldelink}}',js:''}});
test('custom newsletter validates and exports not send-ready',()=>{
  const d=validateDocument(base());
  assert.equal(d.code.text,'Text {{abmeldelink}}');
  const x=newsletterExport(d);
  assert.equal(x.sendReady,false); assert.deepEqual(x.warnings,[]);
});
test('preview has no scripts and unresolved unsubscribe',()=>{
  const html=renderPage(validateDocument(base()),{preview:true});
  assert.match(html,/sandbox=""/); assert.doesNotMatch(html,/allow-scripts/); assert.match(html,/Abmeldelink: wird vom/);
});
test('rejects scripts, js code, handlers, http, relative links',()=>{
  const bad=h=>{const d=base();d.code.html=h;return ()=>validateDocument(d)};
  for(const h of ['<script>1</script>','<a href="https://x.de" onclick="x()">a</a>','<a href="http://x.de/">a</a>','<a href="/x">a</a>','<a href="javascript:1">a</a>','<img src="https://evil.example/a.png">x','<div style="background:url(https://evil.example/x)">'.replace('https://evil.example/x','https://evil.example/x')])assert.throws(bad(h),undefined,h);
  const d=base();d.code.js='alert(1)';assert.throws(()=>validateDocument(d));
});
test('warns on missing token and data images',()=>{
  const d=base();d.code.html='<img src="data:image/png;base64,AAAA"><p>x</p>';d.code.css='t';
  const w=newsletterExport(validateDocument(d)).warnings.join('|');
  assert.match(w,/Abmeldeplatzhalter/);assert.match(w,/data:/);assert.match(w,/Postadresse/);
});
const withCid=(preview)=>{const d=base();d.code.html='<p>Mozartstraße 1, 53819 Neunkirchen <a href="{{abmeldelink}}">x</a></p><img src="cid:hero" alt="a"'+(preview?' data-preview-src="data:image/png;base64,AAAA"':'')+'>';d.code.css='t {{abmeldelink}}';return validateDocument(d);};
test('preview image and export asset are separate and honest',()=>{
  const ok=withCid(true), bare=withCid(false);
  assert.match(renderPage(ok,{preview:true}),/data:image\/png;base64,AAAA/);
  assert.doesNotMatch(renderPage(ok,{preview:true}),/src=&quot;cid:hero/);
  assert.match(renderPage(bare,{preview:true}),/ohne Vorschaubild/);
  const x=newsletterExport(ok);
  assert.doesNotMatch(x.html,/data-preview-src|data:image/); assert.match(x.html,/cid:hero/);
  assert.deepEqual(x.cidImages,['hero']); assert.match(x.warnings.join('|'),/cid-Bilder \(hero\)/);
  assert.doesNotMatch(x.warnings.join('|'),/data:-URI/);
});
test('preview-src must be a small data image',()=>{
  const d=base();d.code.html='<img src="cid:a" data-preview-src="https://evil.example/x.png">';assert.throws(()=>validateDocument(d));
});

import {MarketingService,MemoryStorage} from '../../src/marketing/service.mjs';
import {renderNewsletterWeb} from '../../src/marketing/render.mjs';
test('custom newsletter can be published as a browser view; public render has no tokens, scripts or personal links',async()=>{
  const d=base();d.code.html=d.code.html.replace('</td>','<a href="{{webansicht}}">Im Browser ansehen</a></td>');
  const doc=validateDocument(d),service=new MarketingService(new MemoryStorage()),r=await service.create(d,'fixture');
  const pub=await service.publish(r.id,1,'fixture');
  assert.ok(pub.published);
  const snap=await service.public('sommer','newsletter');
  const html=renderNewsletterWeb(snap);
  assert.match(html,/href="https:\/\/paulikreisch\.de\/nl\/view\/sommer"/);
  assert.match(html,/https:\/\/paulikreisch\.de\/nl\/unsubscribe"/);
  assert.doesNotMatch(html,/\{\{|<script|abmeldelink-fehlt|[?&]t=/);
  assert.match(html,/Content-Security-Policy/);
  await assert.rejects(()=>service.public('sommer','ads'),e=>e.status===404);
  assert.ok(doc);
});
test('newsletter with a cid image without stand-in cannot be published',async()=>{
  const d=base();d.code.html+='<img src="cid:hero" alt="x" width="10" height="10">';
  const service=new MarketingService(new MemoryStorage()),r=await service.create(d,'fixture');
  await assert.rejects(()=>service.publish(r.id,1,'fixture'),e=>e.status===409&&/cid/.test(e.message));
});
test('public view keeps a full mail document and puts the CSP guard in its head',()=>{
  const d=base();d.code.html='<!doctype html><html lang="de"><head><meta charset="utf-8"><style>.a{color:red}</style></head><body><a href="{{abmeldelink}}">x</a></body></html>';
  const html=renderNewsletterWeb(validateDocument(d));
  assert.equal((html.match(/<html/g)||[]).length,1);assert.match(html,/<head><meta name="robots"[^>]*><meta http-equiv="Content-Security-Policy"/);
});
