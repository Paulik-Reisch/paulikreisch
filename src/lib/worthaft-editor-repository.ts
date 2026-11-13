import 'server-only';
import {persistentDailyEnabled,assertDailyWordRecord} from './worthaft-persistent-daily';
import { FieldValue, type DocumentSnapshot, type Transaction } from 'firebase-admin/firestore';
import { getAdminDb } from './firebase-admin';
import { getSession } from './session';
import { getWorthaftDateString } from './worthaft-daily-word';
import { WORTHAFT_WORDS_COLLECTION, WORTHAFT_ANTI_WORDS_COLLECTION, WORTHAFT_WORD_LIST_DOCUMENT, parseWorthaftWordList } from './worthaft-word-list-shared';
import { planWorthaftListWrite } from './worthaft-editor-write-plan';
import { assertDocumentId, assertModerationKind, assertRevision, WorthaftEditorError, type ModerationKind, type ModerationPage, type WorthaftListSnapshot, type SaveListsRequest } from './worthaft-editor-service';

const PAGE_SIZE = 25;
function revision(snapshot: DocumentSnapshot): string {
  const time = snapshot.updateTime;
  if (!snapshot.exists || !time) throw new WorthaftEditorError('Eintrag nicht gefunden.');
  return `${time.seconds}:${time.nanoseconds}`;
}
function listSnapshot(words: DocumentSnapshot, antiWords: DocumentSnapshot): WorthaftListSnapshot {
  return {
    words: parseWorthaftWordList(words.data()?.words, 'words'),
    antiWords: parseWorthaftWordList(antiWords.data()?.words, 'anti-words'),
    revision: `${revision(words)}|${revision(antiWords)}`,
  };
}

async function requireSession() {
  const session = await getSession();
  if (!session) throw new WorthaftEditorError('Bitte erneut anmelden.');
  return session;
}

/** Every loader checks the session directly; do not rely on the admin layout. */
export async function loadWorthaftEditorLists(): Promise<WorthaftListSnapshot> {
  await requireSession();
  const db = getAdminDb();
  const [words, antiWords] = await db.getAll(
    db.collection(WORTHAFT_WORDS_COLLECTION).doc(WORTHAFT_WORD_LIST_DOCUMENT),
    db.collection(WORTHAFT_ANTI_WORDS_COLLECTION).doc(WORTHAFT_WORD_LIST_DOCUMENT),
  );
  return listSnapshot(words, antiWords);
}

export async function loadWorthaftModeration(kind: ModerationKind, cursor: string | null = null): Promise<ModerationPage> {
  await requireSession();
  assertModerationKind(kind);
  if (cursor !== null) assertDocumentId(cursor);
  const name = kind === 'feedback' ? 'worthaft-feedback' : 'worthaft-word-suggestions';
  let query = getAdminDb().collection(name).orderBy('__name__', 'asc').limit(PAGE_SIZE + 1);
  if (cursor) query = query.startAfter(cursor);
  const result = await query.get();
  const selected = result.docs.slice(0, PAGE_SIZE);
  const entries = selected.map(document => {
    const data = document.data();
    const word = typeof data.word === 'string' ? data.word.slice(0, 40) : 'Unbekannt';
    const date = typeof data.date === 'string' ? data.date.slice(0, 10) : '';
    const reasons = Array.isArray(data.reasons) ? data.reasons.filter((x): x is string => typeof x === 'string').slice(0, 9).map(x => x.slice(0, 180)).join(' · ') : '';
    const detail = kind === 'feedback'
      ? `${data.vote === 'down' ? 'Negatives Feedback' : data.vote === 'up' ? 'Historisches positives Feedback' : 'Feedback'}${reasons ? `: ${reasons}` : ''}`
      : data.shouldExist === true ? 'Sollte als Wort gelten' : data.shouldExist === false ? 'Sollte nicht als Wort gelten' : 'Vorschlag ohne eindeutige Angabe';
    return { id: document.id, word, date, detail, reviewed: data.adminReview?.status === 'reviewed', revision: revision(document) };
  });
  return { entries, nextCursor: result.size > PAGE_SIZE ? selected[selected.length - 1].id : null };
}

/** Called only after action-origin and session checks. The transaction rereads both documents. */
export async function commitWorthaftLists(request: SaveListsRequest, actor: string): Promise<WorthaftListSnapshot> {
  await requireSession();
  if(!persistentDailyEnabled())throw new WorthaftEditorError('Listenänderungen sind noch nicht aktiviert. Die dauerhafte Tageswort-Absicherung muss zuerst freigegeben werden.');
  const db = getAdminDb();
  const wordsRef = db.collection(WORTHAFT_WORDS_COLLECTION).doc(WORTHAFT_WORD_LIST_DOCUMENT);
  const blockedRef = db.collection(WORTHAFT_ANTI_WORDS_COLLECTION).doc(WORTHAFT_WORD_LIST_DOCUMENT);
  await db.runTransaction(async (transaction: Transaction) => {
    const date=getWorthaftDateString();
    const [words, blocked,daily] = await transaction.getAll(wordsRef, blockedRef,db.collection('worthaft_daily_words_v1').doc(date));
    if(!daily.exists)throw new WorthaftEditorError('Der heutige Spielstand muss vor Listenänderungen dauerhaft initialisiert sein. Bitte die Spielseite prüfen.');
    assertDailyWordRecord(daily.data(),date);
    const current = listSnapshot(words, blocked);
    const plan = planWorthaftListWrite(current, request, date, actor);
    // Update only the existing words field. Do not replace unrelated metadata or reorder entries.
    if (plan.words) transaction.update(wordsRef, { words: plan.words });
    if (plan.antiWords) transaction.update(blockedRef, { words: plan.antiWords });
    if (plan.audit) transaction.create(db.collection('logs').doc(), {
      ...plan.audit, timestamp: FieldValue.serverTimestamp(),
    });
  });
  return loadWorthaftEditorLists();
}

export async function markWorthaftEntryReviewed(kind: ModerationKind, id: string, expected: string, actor: string): Promise<void> {
  await requireSession();
  assertModerationKind(kind); assertDocumentId(id); assertRevision(expected);
  const db = getAdminDb();
  const ref = db.collection(kind === 'feedback' ? 'worthaft-feedback' : 'worthaft-word-suggestions').doc(id);
  await db.runTransaction(async transaction => {
    const entry = await transaction.get(ref);
    if (revision(entry) !== expected) throw new WorthaftEditorError('Der Eintrag wurde inzwischen geändert. Bitte neu laden.');
    if (entry.data()?.adminReview?.status === 'reviewed') return;
    // Preserve original word, vote, reasons, date and createdAt.
    transaction.update(ref, { adminReview: { status: 'reviewed', by: actor, at: FieldValue.serverTimestamp() } });
  });
}
