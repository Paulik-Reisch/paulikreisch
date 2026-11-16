import assert from 'node:assert/strict';
import test from 'node:test';
import { NextRequest } from 'next/server';
import { middleware } from '../../src/middleware';
import {requestHost} from '../../src/lib/admin-host-policy';
const hosts=['m.paulikreisch.de','lp.paulikreisch.de','ads.paulikreisch.de'];
const req=(host:string,path='/',method='GET',origin?:string)=>new NextRequest(`https://${host}${path}`,{method,headers:{host,...(origin?{origin}:{})}});
for (const host of hosts) {
 test(`${host} rewrites root and API only to marketing implementation`,()=>{
  assert.equal(middleware(req(host)).headers.get('x-middleware-rewrite'),`https://${host}/marketing-private`);
  assert.equal(middleware(req(host,'/api/marketing/documents?x=1')).headers.get('x-middleware-rewrite'),`https://${host}/marketing-private/api/marketing/documents?x=1`);
 });
 test(`${host} refuses cross-host and missing-origin mutations`,()=>{
  assert.equal(middleware(req(host,'/api/marketing/documents','POST')).status,403);
  assert.equal(middleware(req(host,'/api/marketing/documents','POST','https://admin.paulikreisch.de')).status,403);
  assert.match(middleware(req(host,'/api/marketing/documents','POST',`https://${host}`)).headers.get('x-middleware-rewrite')!,/marketing-private/);
 });
 test(`${host} is recognized behind the existing Firebase external-host policy`,()=>{
  assert.equal(requestHost(new Headers({host:'backend.run.app','x-forwarded-host':host})),host);
  assert.equal(requestHost(new Headers({host:'paulikreisch.de','x-forwarded-host':host})),null);
 });
}
for(const host of ['paulikreisch.de','admin.paulikreisch.de','backend.run.app','unknown.paulikreisch.de']){
 test(`${host} cannot expose marketing implementation paths`,()=>{
  for(const path of ['/marketing-private','/marketing-private/api/marketing/documents'])assert.equal(middleware(req(host,path)).status,404);
 });
}
