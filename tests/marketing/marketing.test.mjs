import test from 'node:test';
import assert from 'node:assert/strict';
import {validateDocument,https,image} from '../../src/marketing/model.mjs';
import {MarketingService,MemoryStorage} from '../../src/marketing/service.mjs';
import {renderPage,newsletterExport,adExport} from '../../src/marketing/render.mjs';
const lp=()=>({kind:'lp',slug:'buch',name:'Buch-Funnel',campaign:'',steps:[{slug:'start',title:'Fixture <Buch>',body:'Nur lokaler Test.\n\nZweiter Absatz.',bullets:['Ein Vorteil'],ctaLabel:'Weiter',next:'details'},{slug:'details',title:'Details',body:'Weiterführender Testinhalt.',bullets:[],ctaLabel:'Zum Shop',ctaUrl:'https://paulikreisch.de/shop'}]});
const nl=()=>({kind:'newsletter',slug:'brief',name:'Fixture-Brief',title:'Ein <Test>',body:'Testinhalt.\n\nZweiter Absatz.',target:'https://paulikreisch.de/shop',ctaLabel:'Ansehen',subject:'Testbetreff',preheader:'Nur Test'});
test('validates funnel flow and escapes all public text',()=>{const d=validateDocument(lp()),html=renderPage(d,{preview:true});assert.match(html,/Fixture &lt;Buch&gt;/);assert.doesNotMatch(html,/<Buch>/);assert.match(html,/https:\/\/lp.paulikreisch.de\/buch\/details/);assert.match(html,/noindex,nofollow/);assert.doesNotMatch(html,/<script|<form/);});
test('rejects missing targets, cycles and duplicate funnel steps',()=>{let d=lp();d.steps[0].next='missing';assert.throws(()=>validateDocument(d));d=lp();d.steps[1].ctaUrl='';d.steps[1].next='start';assert.throws(()=>validateDocument(d));d=lp();d.steps[1].slug='start';assert.throws(()=>validateDocument(d));});
test('rejects dangerous URLs and foreign image trackers',()=>{for(const u of ['javascript:alert(1)','https://user:pass@example.com','http://example.com','https://127.0.0.1','https://[::1]','https://example.com:444','https://example.com\n/'])assert.throws(()=>https(u));for(const u of ['https://tracker.example/pixel','https://static.paulikreisch.de/f/abc','https://static.paulikreisch.de/f/12345678-1234-1234-1234-123456789abc?x=1'])assert.throws(()=>image(u));assert.equal(image('https://static.paulikreisch.de/f/12345678-1234-1234-1234-123456789abc'),'https://static.paulikreisch.de/f/12345678-1234-1234-1234-123456789abc');});
test('drafts stay private and editing cannot silently change a live snapshot',async()=>{const service=new MarketingService(new MemoryStorage());let record=await service.create(lp(),'fixture');await assert.rejects(()=>service.public('buch','lp'),e=>e.status===404);record=await service.publish(record.id,1,'fixture');let changed=lp();changed.steps[0].title='Geändert';record=await service.update(record.id,changed,2,'fixture');assert.equal((await service.public('buch','lp')).steps[0].title,'Fixture <Buch>');assert.equal(record.revision,3);assert.equal((await service.list())[0].unpublishedChanges,true);await assert.rejects(()=>service.publish(record.id,1,'fixture'),e=>e.status===409);await service.publish(record.id,3,'fixture');assert.equal((await service.public('buch','lp')).steps[0].title,'Geändert');await service.unpublish(record.id,4,'fixture');await assert.rejects(()=>service.public('buch','lp'),e=>e.status===404);});
test('optimistic concurrency blocks stale writes and published deletion',async()=>{const service=new MarketingService(new MemoryStorage());const r=await service.create(lp(),'fixture');const results=await Promise.allSettled([service.update(r.id,lp(),1,'a'),service.update(r.id,lp(),1,'b')]);assert.equal(results.filter(r=>r.status==='fulfilled').length,1);await service.publish(r.id,2,'fixture');await assert.rejects(()=>service.remove(r.id,3,'fixture'),e=>e.status===409);});
test('one published owner per slug even with concurrent publication',async()=>{const service=new MarketingService(new MemoryStorage());const a=await service.create(lp(),'a'),b=await service.create(lp(),'b');const results=await Promise.allSettled([service.publish(a.id,1,'a'),service.publish(b.id,1,'b')]);assert.equal(results.filter(r=>r.status==='fulfilled').length,1);});
test('newsletter export is escaped, table-based and never falsely send-ready',()=>{const d=validateDocument(nl()),out=newsletterExport(d);assert.match(out.html,/role="presentation"/);assert.match(out.html,/Ein &lt;Test&gt;/);assert.match(out.html,/Abmeldelink/);assert.equal(out.sendReady,false);assert.doesNotMatch(out.html,/<script|<form|<iframe|fonts\.google|pixel/i);assert.match(out.text,/Zweiter Absatz/);});
test('Google creative enforces documented design limits, no live campaign',()=>{const d=validateDocument({kind:'google',name:'Test',slug:'anzeige',target:'https://paulikreisch.de',headlines:['Test eins','Test zwei','Test drei'],descriptions:['Testbeschreibung eins.','Testbeschreibung zwei.']});assert.equal(adExport(d).spendEnabled,false);assert.equal(adExport(d).connected,false);assert.throws(()=>validateDocument({...d,headlines:['x'.repeat(31),'Zwei','Drei']}));assert.throws(()=>validateDocument({...d,descriptions:['Nur eins']}));});
test('newsletter publication stays disabled without a delivery/unsubscribe integration',async()=>{const service=new MarketingService(new MemoryStorage()),r=await service.create(nl(),'fixture');await assert.rejects(()=>service.publish(r.id,1,'fixture'),e=>e.status===409);});
test('audit records actions and all returned values are defensive copies',async()=>{const service=new MarketingService(new MemoryStorage());const r=await service.create(lp(),'fixture');r.draft.name='mutated';assert.equal((await service.get(r.id)).draft.name,'Buch-Funnel');await service.remove(r.id,1,'fixture');await assert.rejects(()=>service.get(r.id),e=>e.status===404);});

test('hosted advertising views can be published without activating any network campaign',async()=>{const service=new MarketingService(new MemoryStorage());const d={kind:'meta',name:'Local fixture',slug:'creative',title:'Fixture title',body:'Fixture body',target:'https://paulikreisch.de',ctaLabel:'Open'};const r=await service.create(d,'fixture');await service.publish(r.id,1,'fixture');assert.equal((await service.public('creative','ads')).kind,'meta');const s=await service.create({...d,kind:'other'},'fixture');await assert.rejects(()=>service.publish(s.id,1,'fixture'),e=>e.status===409);});

test('HTML boundaries reject unsafe URLs even when callers bypass document validation',()=>{
  const unsafe=['javascript:alert(1)','data:text/html,<script>alert(1)</script>','http://example.com','https://user:pass@example.com'];
  for(const target of unsafe){
    const funnel=validateDocument(lp());funnel.steps[1].ctaUrl=target;
    assert.throws(()=>renderPage(funnel,{stepSlug:'details'}));
    const newsletter=validateDocument(nl());newsletter.target=target;
    assert.throws(()=>renderPage(newsletter));
    assert.throws(()=>newsletterExport(newsletter));
  }
  for(const render of [renderPage,newsletterExport]){
    const newsletter=validateDocument(nl());newsletter.image='https://tracker.example/pixel';
    assert.throws(()=>render(newsletter));
  }
});

test('HTML boundary validation preserves escaped text and valid URL attributes',()=>{
  const raw=nl();raw.title='"<Title> & test';raw.body='First <script>x</script>\n\nSecond';
  raw.target='https://paulikreisch.de/shop?a=1&b=2';raw.image='https://static.paulikreisch.de/f/12345678-1234-1234-1234-123456789abc';raw.imageAlt='" onerror="alert(1)';
  const doc=validateDocument(raw);
  for(const html of [renderPage(doc),newsletterExport(doc).html]){
    assert.match(html,/href="https:\/\/paulikreisch.de\/shop\?a=1&amp;b=2"/);
    assert.match(html,/alt="&quot; onerror=&quot;alert\(1\)"/);
    assert.match(html,/&lt;Title&gt; &amp; test/);
    assert.doesNotMatch(html,/<script>|alt="" onerror=/);
  }
});
