import test from 'node:test';
import assert from 'node:assert/strict';
import { createDiagnosedWorthaftAuth } from '../../src/lib/worthaft-diagnosed-auth';
import { getWorthaftDiagnostic, WorthaftDiagnosticError } from '../../src/lib/worthaft-submission-diagnostics';

type User = { uid: string; anonymous: boolean };
type Auth = { currentUser: User | null };
const error = (code = 'auth/network-request-failed', message = 'TypeError: Failed to fetch') => ({code, customData:{message}});
function setup(overrides: Record<string, unknown> = {}) {
  const user = {uid:'cached',anonymous:true};
  const auth: Auth = {currentUser:user};
  const calls: string[] = [];
  const deps = {
    ready: async () => {calls.push('ready');},
    currentUser: (a: Auth) => a.currentUser,
    signIn: async (a: Auth) => {calls.push('signin'); const user={uid:'new',anonymous:true};a.currentUser=user;return user;},
    isAnonymous: (u:User) => u.anonymous,
    sameUser: (a:User,b:User) => a.uid===b.uid,
    refresh: async () => {calls.push('refresh');},
    signOut: async (a:Auth) => {calls.push('signout');a.currentUser=null;},
    ...overrides,
  };
  return {auth,calls,deps,ensure:createDiagnosedWorthaftAuth(deps)};
}
test('creating the diagnosed adapter does not sign in', () => {const s=setup();assert.deepEqual(s.calls,[]);});
test('valid cached anonymous user still gets exactly one forced refresh',async()=>{const s=setup();assert.equal(await s.ensure(s.auth),s.auth.currentUser);assert.deepEqual(s.calls,['ready','refresh']);});
test('non-anonymous user is unchanged and not refreshed',async()=>{const s=setup();s.auth.currentUser!.anonymous=false;await s.ensure(s.auth);assert.deepEqual(s.calls,['ready']);});
test('first-time visitor signs in once',async()=>{const s=setup();s.auth.currentUser=null;await s.ensure(s.auth);assert.deepEqual(s.calls,['ready','signin']);});
test('restoration error has its own phase and never signs in',async()=>{const s=setup({ready:async()=>{throw error();}});await assert.rejects(s.ensure(s.auth),(e:WorthaftDiagnosticError)=>e.diagnostics[0].phase==='restore');assert.deepEqual(s.calls,[]);});
test('refresh network failure retains existing successful recovery',async()=>{const s=setup({refresh:async()=>{throw error();}});assert.equal((await s.ensure(s.auth)).uid,'new');assert.deepEqual(s.calls,['ready','signout','signin']);});
test('both refresh and subsequent sign-in failures survive',async()=>{const s=setup({refresh:async()=>{throw error();},signIn:async()=>{throw error('auth/network-request-failed','Unexpected token < in JSON');}});await assert.rejects(s.ensure(s.auth),(e:WorthaftDiagnosticError)=>{assert.deepEqual(e.diagnostics.map(d=>[d.phase,d.cause]),[['refresh','fetch'],['signin','response']]);return true;});});
test('sign-out failure reports both phases and does not attempt sign-in',async()=>{const s=setup({refresh:async()=>{throw error();},signOut:async()=>{throw error('auth/internal-error','IndexedDB');}});await assert.rejects(s.ensure(s.auth),(e:WorthaftDiagnosticError)=>{assert.deepEqual(e.diagnostics.map(d=>d.phase),['refresh','signout']);return true;});assert(!s.calls.includes('signin'));});
test('unrecoverable refresh error does not sign out',async()=>{const s=setup({refresh:async()=>{throw error('auth/operation-not-allowed');}});await assert.rejects(s.ensure(s.auth),(e:WorthaftDiagnosticError)=>e.code==='auth/operation-not-allowed');assert.deepEqual(s.calls,['ready']);});
test('concurrent calls deduplicate the whole flow',async()=>{const s=setup();s.auth.currentUser=null;await Promise.all([s.ensure(s.auth),s.ensure(s.auth)]);assert.equal(s.calls.filter(c=>c==='signin').length,1);});
test('a later attempt does not inherit old recovery diagnostics',async()=>{let first=true;const s=setup({refresh:async()=>{if(first)throw error();},signIn:async()=>{throw error();}});await assert.rejects(s.ensure(s.auth));first=false;await assert.rejects(s.ensure(s.auth),(e:WorthaftDiagnosticError)=>e.diagnostics.length===1&&e.diagnostics[0].phase==='signin');});
test('bare SDK network error never fabricates a specific cause',()=>{assert.equal(getWorthaftDiagnostic({code:'auth/network-request-failed',message:'Firebase: Error (auth/network-request-failed).'},'signin').cause,'unknown');});
test('detail classification handles timeout, body parsing, storage and fetch',()=>{for(const [message,cause] of [['Timed out','timeout'],['SyntaxError in JSON','response'],['UnknownError: IndexedDB','storage'],['TypeError: Failed to fetch','fetch']])assert.equal(getWorthaftDiagnostic(error(undefined,message),'signin').cause,cause);});
test('unbounded or malformed error codes are never displayed',()=>{for(const code of ['https://example.test/?secret=abc','auth/'+ 'x'.repeat(100),'abc secret','auth/x\nPRIVATE','auth/<script>'])assert.equal(getWorthaftDiagnostic({code},'save').code,undefined);});
