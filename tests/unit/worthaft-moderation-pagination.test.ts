import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import * as service from '../../src/lib/worthaft-editor-service';
function loader(authorized=true){
 const calls:unknown[][]=[];
 const all=Array.from({length:52},(_,n)=>({id:String(n).padStart(3,'0'),exists:true,updateTime:{seconds:100,nanoseconds:n},data:()=>({word:'birne',vote:'down',date:'2026-11-12'})}));
 const db={collection:(name:string)=>{calls.push(['collection',name]);let cursor='';let bound=0;const query={orderBy:(field:string,direction:string)=>{calls.push(['orderBy',field,direction]);assert.equal(field,'__name__');assert.equal(direction,'asc');return query},limit:(n:number)=>{calls.push(['limit',n]);bound=n;return query},startAfter:(id:string)=>{calls.push(['startAfter',id]);cursor=id;return query},get:async()=>{const docs=all.filter(x=>x.id>cursor).slice(0,bound);return {docs,size:docs.length}}};return query}};
 const module={exports:{} as Record<string,unknown>};
 const compiled=ts.transpileModule(readFileSync('src/lib/worthaft-editor-repository.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
 vm.runInNewContext(compiled,{module,exports:module.exports,require:(name:string)=>name==='./session'?{getSession:async()=>authorized?{user:'admin'}:null}:name==='./firebase-admin'?{getAdminDb:()=>db}:name==='./worthaft-editor-service'?service:{}});
 return {load:module.exports.loadWorthaftModeration as (kind:'feedback'|'suggestions',cursor?:string|null)=>Promise<{entries:{id:string}[];nextCursor:string|null}>,calls};
}
test('moderation uses ascending document IDs, bounded26 reads,25 entries and stable exclusive cursors for both collections',async()=>{
 for(const kind of ['feedback','suggestions']as const){const f=loader();const first=await f.load(kind);const second=await f.load(kind,first.nextCursor);const third=await f.load(kind,second.nextCursor);assert.equal(first.entries.length,25);assert.equal(second.entries.length,25);assert.equal(third.entries.length,2);assert.equal(first.nextCursor,'024');assert.equal(second.nextCursor,'049');assert.equal(third.nextCursor,null);assert.equal(new Set([...first.entries,...second.entries,...third.entries].map(x=>x.id)).size,52);assert.ok(f.calls.every(x=>x[0]!=='limit'||x[1]===26));assert.deepEqual(f.calls[0],['collection',kind==='feedback'?'worthaft-feedback':'worthaft-word-suggestions']);}
});
test('moderation still requires a direct session and rejects invalid kind or cursor before reading',async()=>{const anon=loader(false);await assert.rejects(()=>anon.load('feedback'),/anmelden/);assert.equal(anon.calls.length,0);const f=loader();await assert.rejects(()=>f.load('feedback','a/b'));await assert.rejects(()=>f.load('other' as 'feedback'));assert.equal(f.calls.length,0)});
