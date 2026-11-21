import 'server-only';
import { FieldPath, type Firestore } from 'firebase-admin/firestore';
import { getWorthaftDateString } from './worthaft-daily-word';
import { runDailyCleanup } from './worthaft-daily-cleanup-policy';

const COLLECTION = 'worthaft_daily_words_v1';
let lastAttemptDate: string | undefined;
let pending: Promise<unknown> | undefined;

/** Bounded, fixed-collection cleanup. dryRun never writes. Caller supplies clock. */
export async function cleanupOldDailyWords(db: Firestore, date: string, dryRun = true) {
  return runDailyCleanup({
    async scanBefore(cutoff, limit) {
      const snapshot = await db.collection(COLLECTION).where(FieldPath.documentId(), '<', cutoff)
        .orderBy(FieldPath.documentId()).limit(limit).get();
      return snapshot.docs.map(doc => ({id:doc.id, data:doc.data(), version:doc}));
    },
    async deleteUnchanged(entries) {
      const batch = db.batch();
      for (const {version:doc} of entries) batch.delete(doc.ref, { lastUpdateTime: doc.updateTime });
      await batch.commit();
    },
  }, date, dryRun, getWorthaftDateString);
}

/** Per-process daily throttle. Cold starts may repeat the bounded check. */
export async function maybeCleanupOldDailyWords(db: Firestore, date: string) {
  if (process.env.WORTHAFT_DAILY_CLEANUP_RELEASE !== 'calendar-two-days-accepted') return;
  if (pending || lastAttemptDate === date) return;
  lastAttemptDate = date;
  pending = (async () => {
    const preview = await cleanupOldDailyWords(db, date, true);
    console.info('Worthaft daily cleanup dry-run', preview);
    if (!preview.ids.length) return;
    const result = await cleanupOldDailyWords(db, date, false);
    console.info('Worthaft daily cleanup completed', result);
  })();
  try { await pending; }
  catch (error) { console.error('Worthaft daily cleanup failed; game remains available.', error); }
  finally { pending = undefined; }
}
