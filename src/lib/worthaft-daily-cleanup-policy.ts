import { mayDeleteDailyWord, worthaftOldestRetainedDate } from './worthaft-daily-retention';
export type DailyCleanupEntry<T> = { id: string; data: unknown; version: T };
export interface DailyCleanupStore<T> {
  scanBefore(cutoff: string, limit: number): Promise<DailyCleanupEntry<T>[]>;
  deleteUnchanged(entries: DailyCleanupEntry<T>[]): Promise<void>;
}
/** All destructive decisions are checked here; the adapter only executes them. */
export async function runDailyCleanup<T>(store: DailyCleanupStore<T>, date: string, dryRun: boolean, currentDate: () => string) {
  const cutoff = worthaftOldestRetainedDate(date);
  const rows = await store.scanBefore(cutoff, 32);
  const eligible = rows.slice(0, 32).filter(row => mayDeleteDailyWord(row.id, row.data, date));
  const result = { date, cutoff, scanned: rows.length, ids: eligible.map(row => row.id), dryRun };
  if (!dryRun && eligible.length) {
    if (currentDate() !== date) throw new Error('Daily cleanup date changed; retry next visit.');
    await store.deleteUnchanged(eligible);
  }
  return result;
}
