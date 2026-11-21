/** Pure retention planning. No storage, network or clock access. */
export function worthaftOldestRetainedDate(berlinDate: string): string {
  if (!isCalendarDate(berlinDate)) throw new Error('Invalid Berlin date');
  const date = new Date(`${berlinDate}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() - 1);
  return date.toISOString().slice(0, 10);
}
export function isCalendarDate(value: unknown): value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T12:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}
export function mayDeleteDailyWord(id: string, data: unknown, berlinDate: string): boolean {
  const cutoff = worthaftOldestRetainedDate(berlinDate);
  if (!isCalendarDate(id) || id >= cutoff || !data || typeof data !== 'object') return false;
  const record = data as Record<string, unknown>;
  return record.date === id && typeof record.word === 'string' && /^[A-ZÄÖÜẞ]{5}$/.test(record.word) &&
    typeof record.sourceRevision === 'string' && record.sourceRevision.length > 0;
}
