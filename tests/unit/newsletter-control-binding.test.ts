import test from 'node:test';
import assert from 'node:assert/strict';
import ts from 'typescript';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
// control-binding.ts imports 'server-only', which only resolves inside Next. Same loading approach as newsletter-route-runtime.test.ts.
const mod={exports:{} as Record<string,any>};
runInNewContext(ts.transpileModule(readFileSync('src/newsletter/control-binding.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,{module:mod,exports:mod.exports,Buffer,JSON,Number,String,Promise,require:(n:string)=>{if(n==='server-only')return {};throw Error('Unexpected dependency: '+n);}});
const createBucketControl=mod.exports.createBucketControl as (b:any)=>any;
import {createNewsletterSender} from '../../src/newsletter/studio-api.mjs';

/** Minimal GCS-like bucket: generation preconditions with real 412/404 semantics. */
function fakeBucket() {
  const objects = new Map<string, {body: string; generation: number}>(); let gen = 0; const saves: Array<{path: string; opts: any}> = [];
  const err = (code: number) => Object.assign(new Error('gcs ' + code), {code});
  const file = (path: string, opts?: {generation?: string | number}) => ({
    async getMetadata() { const o = objects.get(path); if (!o) throw err(404); return [{generation: String(o.generation)}]; },
    async download() { const o = objects.get(path); if (!o || (opts?.generation !== undefined && String(opts.generation) !== String(o.generation))) throw err(404); return [Buffer.from(o.body)]; },
    async save(body: string, o: any) {
      saves.push({path, opts: o});
      const cur = objects.get(path), want = o?.preconditionOpts?.ifGenerationMatch;
      if (want === 0 && cur) throw err(412);
      if (want !== undefined && want !== 0 && (!cur || cur.generation !== Number(want))) throw err(want !== 0 && !cur ? 404 : 412);
      objects.set(path, {body, generation: ++gen});
    },
  });
  return {bucket: {file} as any, objects, saves};
}
test('bucket control: create is atomic and create-only, update needs the generation that was read', async () => {
  const b = fakeBucket(), c = createBucketControl(b.bucket);
  assert.equal(await c.read('send-x-r1'), null);
  const results = await Promise.all([c.create('send-x-r1', {state: 'claimed', n: 1}), c.create('send-x-r1', {state: 'claimed', n: 2})]);
  assert.deepEqual(results.sort(), [false, true], 'exactly one concurrent claim wins');
  const rec = await c.read('send-x-r1'); assert.equal(rec.state, 'claimed');
  assert.equal(await c.update('send-x-r1', {state: 'finished'}, '999'), false, 'stale generation refused');
  assert.equal(await c.update('send-x-r1', {state: 'finished'}, rec.generation), true);
  assert.equal(await c.update('send-x-r1', {state: 'again'}, rec.generation), false, 'old generation cannot overwrite');
  assert.equal(await c.update('missing', {}, '1'), false);
  assert.ok(b.saves.every(s => s.opts.predefinedAcl === 'private' && s.opts.preconditionOpts && /^managed-private-v1\/newsletter-control\//.test(s.path)), 'private namespace, always with a precondition');
});
test('sender over the bucket adapter: two concurrent sends of one revision reach the provider once', async () => {
  const b = fakeBucket(), sent: unknown[] = [];
  const sender = createNewsletterSender({control: createBucketControl(b.bucket), enabled: true, from: 'N <n@news.example.invalid>', baseUrl: 'https://example.invalid', dailyLimit: 5,
    getStatus: () => ({webhookConfigured: true}), getReadModel: () => ({snapshot: async () => ({counts: {}, recipients: [{id: 'a'}]})}),
    getSubscribers: () => ({mailable: async () => [{id: 'a', email: 'a@example.invalid', unsubscribeToken: 't.a'}]}),
    getResend: () => ({send: async (m: unknown) => { sent.push(m); await new Promise(r => setTimeout(r, 5)); return {id: 'p'}; }})});
  const rec = {id: 'doc1', revision: 2, published: null, draft: {kind: 'newsletter', slug: 's', mode: 'custom', subject: 'S', code: {html: '{{abmeldelink}}', text: '{{abmeldelink}}'}}};
  const p = await sender.preview(rec); await sender.approve(rec, {digest: p.digest, phrase: p.approvalPhrase, actor: 't'});
  const settled = await Promise.allSettled([sender.send(rec, {digest: p.digest, phrase: p.phrase}), sender.send(rec, {digest: p.digest, phrase: p.phrase})]);
  assert.equal(sent.length, 1); assert.equal(settled.filter(s => s.status === 'fulfilled').length, 1);
});
