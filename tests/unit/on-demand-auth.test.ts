import test from 'node:test';
import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import { createOnDemandSignIn } from '../../src/lib/on-demand-auth';

type User = { uid: string };
type Auth = { currentUser: User | null };

test('creating the helper does not create an account', () => {
  let requests = 0;
  createOnDemandSignIn<Auth, User>(async () => {}, a => a.currentUser, async () => { requests++; return { uid: 'anon' }; });
  assert.equal(requests, 0);
});

test('reuses an existing signed-in user without signing up', async () => {
  const user = { uid: 'admin' };
  const auth = { currentUser: user };
  const ensure = createOnDemandSignIn<Auth, User>(async () => {}, a => a.currentUser, async () => { throw new Error('must not sign in'); });
  assert.equal(await ensure(auth), user);
});

test('waits for persisted Auth state before creating an anonymous account', async () => {
  const auth: Auth = { currentUser: null };
  const user = { uid: 'restored' };
  const ensure = createOnDemandSignIn<Auth, User>(async a => { a.currentUser = user; }, a => a.currentUser, async () => { throw new Error('must not sign in'); });
  assert.equal(await ensure(auth), user);
});

test('two concurrent submissions share one signup', async () => {
  const auth: Auth = { currentUser: null };
  let resolve!: (u: User) => void;
  const result = new Promise<User>(r => { resolve = r; });
  let requests = 0;
  const ensure = createOnDemandSignIn<Auth, User>(async () => {}, a => a.currentUser, () => { requests++; return result; });
  const first = ensure(auth);
  const second = ensure(auth);
  await Promise.resolve();
  assert.equal(requests, 1);
  const user = { uid: 'anon' };
  resolve(user);
  assert.deepEqual(await Promise.all([first, second]), [user, user]);
});

test('failed sign-in is propagated and can be retried', async () => {
  const auth: Auth = { currentUser: null };
  let requests = 0;
  const ensure = createOnDemandSignIn<Auth, User>(async () => {}, a => a.currentUser, async () => {
    if (++requests === 1) throw new Error('offline');
    return { uid: 'retry' };
  });
  await assert.rejects(ensure(auth), /offline/);
  assert.equal((await ensure(auth)).uid, 'retry');
  assert.equal(requests, 2);
});

test('different Auth instances never share credentials', async () => {
  let requests = 0;
  const ensure = createOnDemandSignIn<Auth, User>(async () => {}, a => a.currentUser, async () => ({ uid: String(++requests) }));
  const users = await Promise.all([ensure({ currentUser: null }), ensure({ currentUser: null })]);
  assert.notEqual(users[0].uid, users[1].uid);
});


test('global provider has no signup path, independent of preview mode', () => {
  const source = readFileSync(new URL('../../src/firebase/provider.tsx', import.meta.url), 'utf8');
  assert.doesNotMatch(source, /initiateAnonymousSignIn|signInAnonymously/);
  assert.match(source, /user: null, isUserLoading: false/);
});

test('an invalid cached anonymous user can be replaced only on explicit submission', async () => {
  const auth: Auth = { currentUser: { uid: 'deleted' } };
  let requests = 0;
  const ensure = createOnDemandSignIn<Auth, User>(async () => {}, a => a.currentUser,
    async () => { requests++; return { uid: 'replacement' }; }, async a => { a.currentUser = null; return null; });
  assert.equal(requests, 0);
  assert.equal((await ensure(auth)).uid, 'replacement');
  assert.equal(requests, 1);
});

test('network errors while validating a cached user do not create another account', async () => {
  const auth: Auth = { currentUser: { uid: 'existing' } };
  const ensure = createOnDemandSignIn<Auth, User>(async () => {}, a => a.currentUser,
    async () => { throw new Error('must not create an account'); }, async () => { throw new Error('offline'); });
  await assert.rejects(ensure(auth), /offline/);
});
