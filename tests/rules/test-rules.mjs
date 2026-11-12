import { readFileSync } from 'node:fs';
import {
  initializeTestEnvironment,
  assertFails,
  assertSucceeds,
} from '@firebase/rules-unit-testing';
import { doc, getDoc, setDoc, collection, getDocs, serverTimestamp } from 'firebase/firestore';

const rules = readFileSync('/tmp/ruleslab/firestore.rules', 'utf8');

const testEnv = await initializeTestEnvironment({
  projectId: 'demo-paulik',
  firestore: { rules, host: '127.0.0.1', port: 8085 },
});

const ADMIN = { email: 'maximilian.reisch@t-online.de', email_verified: true };
const ADMIN_UNVERIFIED = { email: 'maximilian.reisch@t-online.de', email_verified: false };
const OTHER_VERIFIED = { email: 'fremd@example.com', email_verified: true };

await testEnv.clearFirestore();

const anon = () => testEnv.unauthenticatedContext().firestore();
const asUser = (claims) => testEnv.authenticatedContext('uid1', claims).firestore();

const PUBLIC_READS = [
  ['authors', 'max'],
  ['excerpts', 'leseprobe-1'],
  ['legal', 'impressum'],
  ['landing_pages', 'lp-5'],
  ['palabrotas', 'p1'],
  ['chistes', 'c1'],
  ['seo_metadata', 'home'],
  ['worthaft-words', 'current'],
  ['worthaft-anti-words', 'current'],
];
const ADMIN_ONLY_READS = [
  ['settings', 'admin'],
  ['settings', 'countdown'],
  ['orders', 'o1'],
  ['logs', 'l1'],
  ['newsletters', 'n1'],
  ['campaigns', 'c1'],
  ['analytics_events', 'a1'],
  ['worthaft-feedback', 'f1'],
  ['worthaft-word-suggestions', 's1'],
  ['subscribers', 'sub1'],
];

let passed = 0, failed = 0;
async function t(name, fn) {
  try { await fn(); passed++; console.log('ok  -', name); }
  catch (e) { failed++; console.log('FEHLT -', name, '=>', String(e).split('\n')[0]); }
}

// 1) Anonym: oeffentliche Collections lesbar
for (const [col, id] of PUBLIC_READS) {
  await t(`anon liest ${col}/${id}`, async () => {
    await assertSucceeds(getDoc(doc(anon(), col, id)));
  });
}
// 1b) Anonym: Listenabfrage auf oeffentliche Collection
await t('anon listet authors', async () => {
  await assertSucceeds(getDocs(collection(anon(), 'authors')));
});

// 2) Anonym: Admin-Collections gesperrt (Dokument + Unterpfad + Liste)
for (const [col, id] of ADMIN_ONLY_READS) {
  await t(`anon liest ${col}/${id} NICHT`, async () => {
    await assertFails(getDoc(doc(anon(), col, id)));
  });
}
await t('anon liest Unterpfad settings/admin NICHT (direkt)', async () => {
  await assertFails(getDoc(doc(anon(), 'settings', 'admin')));
});
await t('anon listet orders NICHT', async () => {
  await assertFails(getDocs(collection(anon(), 'orders')));
});
await t('anon liest unbekannte Collection NICHT (Fangnetz)', async () => {
  await assertFails(getDoc(doc(anon(), 'neue-collection', 'x')));
});

// 3) Anonym: keine Writes irgendwo (ausser validierte Creates)
await t('anon schreibt authors NICHT', async () => {
  await assertFails(setDoc(doc(anon(), 'authors', 'x'), { name: 'x' }));
});
await t('anon schreibt settings NICHT', async () => {
  await assertFails(setDoc(doc(anon(), 'settings', 'x'), { a: 1 }));
});
await t('anon legt worthaft-feedback NICHT an (braucht Auth)', async () => {
  await assertFails(setDoc(doc(anon(), 'worthaft-feedback', 'f1'), {
    word: 'ABEND', vote: 'up', reasons: [], date: '2026-11-12', createdAt: new Date(),
  }));
});

// 4) Fremdes verifiziertes Konto: wie anonym + darf Feedback anlegen
await t('fremdes Konto liest orders NICHT', async () => {
  await assertFails(getDoc(doc(asUser(OTHER_VERIFIED), 'orders', 'o1')));
});
await t('fremdes Konto liest settings/admin NICHT', async () => {
  await assertFails(getDoc(doc(asUser(OTHER_VERIFIED), 'settings', 'admin')));
});
await t('fremdes Konto legt valides worthaft-feedback an', async () => {
  await assertSucceeds(setDoc(doc(asUser(OTHER_VERIFIED), 'worthaft-feedback', 'f1'), {
    word: 'ABEND', vote: 'down', reasons: ['ist zu leicht.'],
    date: '2026-11-12', createdAt: serverTimestamp(),
  }));
});
await t('fremdes Konto: feedback mit Client-Zeit statt serverTimestamp abgelehnt', async () => {
  await assertFails(setDoc(doc(asUser(OTHER_VERIFIED), 'worthaft-feedback', 'f9'), {
    word: 'ABEND', vote: 'up', reasons: [],
    date: '2026-11-12', createdAt: new Date(),
  }));
});
await t('fremdes Konto: feedback mit falschem Grund abgelehnt', async () => {
  await assertFails(setDoc(doc(asUser(OTHER_VERIFIED), 'worthaft-feedback', 'f2'), {
    word: 'ABEND', vote: 'down', reasons: ['erfundener grund'],
    date: '2026-11-12', createdAt: new Date(),
  }));
});
await t('fremdes Konto: feedback mit Extra-Feld abgelehnt', async () => {
  await assertFails(setDoc(doc(asUser(OTHER_VERIFIED), 'worthaft-feedback', 'f3'), {
    word: 'ABEND', vote: 'up', reasons: [], date: '2026-11-12',
    createdAt: new Date(), admin: true,
  }));
});

// 5) Allowlist-Admin UNVERIFIZIERT: kein Zugriff
await t('Admin unverifiziert liest orders NICHT', async () => {
  await assertFails(getDoc(doc(asUser(ADMIN_UNVERIFIED), 'orders', 'o1')));
});
await t('Admin unverifiziert schreibt authors NICHT', async () => {
  await assertFails(setDoc(doc(asUser(ADMIN_UNVERIFIED), 'authors', 'x'), { name: 'x' }));
});

// 6) Allowlist-Admin verifiziert: voller Zugriff
await t('Admin liest settings/admin', async () => {
  await assertSucceeds(getDoc(doc(asUser(ADMIN), 'settings', 'admin')));
});
await t('Admin liest worthaft-feedback', async () => {
  await assertSucceeds(getDoc(doc(asUser(ADMIN), 'worthaft-feedback', 'f1')));
});
await t('Admin schreibt authors', async () => {
  await assertSucceeds(setDoc(doc(asUser(ADMIN), 'authors', 'x'), { name: 'x' }));
});
await t('Admin schreibt beliebige neue Collection', async () => {
  await assertSucceeds(setDoc(doc(asUser(ADMIN), 'neue-collection', 'x'), { a: 1 }));
});

// 7) subscribers: anonymes Anlegen mit Validierung (Newsletter-Server-Action)
await t('anon legt valide subscriber-Anmeldung an', async () => {
  await assertSucceeds(setDoc(doc(anon(), 'subscribers', 'sub1'), {
    email: 'neu@example.com', source: 'shop-footer', createdAt: new Date(),
  }));
});
await t('anon subscriber-Anmeldung ohne email abgelehnt', async () => {
  await assertFails(setDoc(doc(anon(), 'subscribers', 'sub2'), {
    source: 'shop-footer',
  }));
});
await t('anon subscriber-Anmeldung mit Extra-Feld abgelehnt', async () => {
  await assertFails(setDoc(doc(anon(), 'subscribers', 'sub3'), {
    email: 'neu@example.com', source: 'shop-footer', role: 'admin',
  }));
});
await t('anon subscriber-Anmeldung mit ungueltiger Mail abgelehnt', async () => {
  await assertFails(setDoc(doc(anon(), 'subscribers', 'sub4'), {
    email: 'keine-mail', source: 'shop-footer',
  }));
});
await t('anon aktualisiert subscriber NICHT', async () => {
  await assertFails(setDoc(doc(anon(), 'subscribers', 'sub1'), {
    email: 'neu@example.com', source: 'shop-footer',
  }));
});

console.log(`\n${passed} bestanden, ${failed} fehlgeschlagen`);
await testEnv.cleanup();
process.exit(failed ? 1 : 0);
