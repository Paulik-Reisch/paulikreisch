import test from 'node:test';
import assert from 'node:assert/strict';
import { NextRequest } from 'next/server';
import { middleware } from '../../src/middleware';
import { encodeAnalyticsSession, decodeAnalyticsSession } from '../../src/lib/analytics-session-token';
import { encodeAdminSession, decodeAdminSession } from '../../src/lib/admin-session-token';
import { analyticsWindowStart, assertAnalyticsReadSize } from '../../src/lib/analytics-window';
const host = 'analytics.paulikreisch.de';
function request(path:string,authority=host,method='GET',origin?:string) {
 return new NextRequest(`https://${authority}${path}`,{method,headers:{host:authority,...(origin?{origin}:{})}});
}
test('analytics root/login rewrite only into private implementation with no-store/noindex',()=>{
 for (const [path,target] of [['/','/analytics-private'],['/login','/analytics-private/login']]) {
  const result=middleware(request(path));
  assert.equal(result.headers.get('x-middleware-rewrite'),`https://${host}${target}`);
  assert.match(result.headers.get('cache-control')??'',/no-store/);
  assert.match(result.headers.get('x-robots-tag')??'',/noindex/);
 }
});
test('analytics POST requires exact own Origin, never gets admin mutation route',()=>{
 assert.equal(middleware(request('/',host,'POST')).status,403);
 assert.equal(middleware(request('/',host,'POST','https://admin.paulikreisch.de')).status,403);
 assert.equal(middleware(request('/',host,'POST',`https://${host}`)).headers.get('x-middleware-rewrite'),`https://${host}/analytics-private`);
 assert.equal(middleware(request('/admin/authors',host,'POST',`https://${host}`)).status,404);
});
test('hidden paths cannot be requested on any host and admin dashboard bookmark only redirects safe methods',()=>{
 for(const authority of ['paulikreisch.de','admin.paulikreisch.de',host,'studio.example.run.app']) {
  assert.equal(middleware(request('/analytics-private',authority)).status,404);
 }
 assert.equal(middleware(request('/admin/analytics','admin.paulikreisch.de')).headers.get('location'),`https://${host}/`);
 assert.equal(middleware(request('/admin/analytics','admin.paulikreisch.de','POST','https://admin.paulikreisch.de')).status,403);
});
test('public game unchanged and scripts cannot bypass protected analytics authority',()=>{
 assert.equal(middleware(request('/worthaft','paulikreisch.de')).headers.get('x-middleware-next'),'1');
 assert.equal(middleware(request('/admin/export.js')).status,404);
 assert.equal(middleware(request('/_next/static/x.js')).headers.get('x-middleware-next'),'1');
 assert.equal(middleware(request('/_next/static/x.js',host,'POST',`https://${host}`)).status,404);
});
test('analytics and admin session tokens cannot be exchanged and expire',async()=>{
 const key=new TextEncoder().encode('test-only-not-a-real-persistent-secret-12345');
 const now=new Date('2026-11-12T12:00:00Z');
 const analytics=await encodeAnalyticsSession('test@example.invalid',key,now);
 const admin=await encodeAdminSession({user:{id:'test@example.invalid'},expires:new Date(now.getTime()+86400000).toISOString()},key,now);
 assert.deepEqual(await decodeAnalyticsSession(analytics,key,now),{email:'test@example.invalid'});
 assert.equal(await decodeAnalyticsSession(admin,key,now),null);
 assert.equal(await decodeAdminSession(analytics,key,now),null);
 assert.equal(await decodeAnalyticsSession(analytics,key,new Date('2026-11-14T12:00:00Z')),null);
 assert.equal(await decodeAnalyticsSession('malformed',key,now),null);
});
test('query boundary is first day of six-calendar-month Berlin window across DST and year rollover',()=>{
 assert.equal(analyticsWindowStart(new Date('2026-11-12T16:00:00Z')).toISOString(),'2026-05-31T22:00:00.000Z');
 assert.equal(analyticsWindowStart(new Date('2026-04-01T00:00:00Z')).toISOString(),'2025-10-31T23:00:00.000Z');
 assert.equal(analyticsWindowStart(new Date('2026-01-31T23:30:00Z')).toISOString(),'2025-08-31T22:00:00.000Z');
});
test('overflow fails instead of claiming incomplete event counts are complete',()=>{
 assert.doesNotThrow(()=>assertAnalyticsReadSize(5000));
 assert.throws(()=>assertAnalyticsReadSize(5001),/nicht als vollständig/);
});
