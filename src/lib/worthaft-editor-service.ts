import type { WorthaftWordLists } from './worthaft-word-list-shared';
import { previewWorthaftListEdit } from './worthaft-editor-model';

export type WorthaftListSnapshot = WorthaftWordLists & { revision: string };
export type ModerationKind = 'feedback' | 'suggestions';
export type ModerationEntry = {
  id: string;
  word: string;
  date: string;
  detail: string;
  reviewed: boolean;
  revision: string;
};
export type ModerationPage = { entries: ModerationEntry[]; nextCursor: string | null };
export type EditorResult = { success: boolean; message: string; snapshot?: WorthaftListSnapshot };
export type SaveListsRequest = { words: unknown; antiWords: unknown; revision: unknown; acknowledgeSchedule: unknown };

export class WorthaftEditorError extends Error {}

export function assertModerationKind(value: unknown): asserts value is ModerationKind {
  if (value !== 'feedback' && value !== 'suggestions') throw new WorthaftEditorError('Ungültiger Bereich.');
}

export function assertDocumentId(value: unknown): asserts value is string {
  if (typeof value !== 'string' || !/^[A-Za-z0-9_-]{1,150}$/.test(value)) {
    throw new WorthaftEditorError('Ungültige Eintragskennung.');
  }
}

export function assertRevision(value: unknown): asserts value is string {
  if (typeof value !== 'string' || !/^\d+:\d+(\|\d+:\d+)?$/.test(value) || value.length > 90) {
    throw new WorthaftEditorError('Stand fehlt. Bitte neu laden.');
  }
}

export function validateListSave(current: WorthaftListSnapshot, request: SaveListsRequest, date: string) {
  assertRevision(request.revision);
  if (request.revision !== current.revision) {
    throw new WorthaftEditorError('Die Listen wurden inzwischen geändert. Bitte den aktuellen Stand neu laden.');
  }
  if (!Array.isArray(request.words) || !Array.isArray(request.antiWords)
    || request.words.length > 10000 || request.antiWords.length > 10000) {
    throw new WorthaftEditorError('Je Liste sind höchstens 10.000 Einträge möglich.');
  }
  let preview: ReturnType<typeof previewWorthaftListEdit>;
  try {
    preview = previewWorthaftListEdit(current, request, date);
  } catch {
    throw new WorthaftEditorError('Jede Liste braucht mindestens ein Wort. Erlaubt sind deutsche Wörter mit genau fünf Buchstaben.');
  }
  if (preview.scheduleMayChange && request.acknowledgeSchedule !== true) {
    throw new WorthaftEditorError('Bitte die mögliche Änderung der Tageswortfolge bestätigen.');
  }
  return preview;
}

export type EditorDependencies = {
  authorize: () => Promise<{ id: string } | null>;
  commitLists: (request: SaveListsRequest, actor: string) => Promise<WorthaftListSnapshot>;
  expireLists: () => void;
  deleteEntry: (kind: ModerationKind, id: string, revision: string, actor: string) => Promise<void>;
};

/** Authorize before any repository access, including malformed requests. */
export async function saveWorthaftLists(request: SaveListsRequest, dependencies: EditorDependencies): Promise<EditorResult> {
  const actor = await dependencies.authorize();
  if (!actor) return { success: false, message: 'Bitte erneut anmelden.' };
  try {
    const snapshot = await dependencies.commitLists(request, actor.id);
    try {
      dependencies.expireLists();
    } catch {
      return { success: true, snapshot, message: 'Gespeichert. Der Spielcache konnte nicht geleert werden. Bitte „Wortlisten neu laden“ ausführen. Die Tageswort-Warnung gilt weiter.' };
    }
    return { success: true, snapshot, message: 'Listen gespeichert und Cache geleert. Bereits geöffnete Spiele bleiben unverändert. Ein Serverneustart kann die heutige Lösung neu bestimmen.' };
  } catch (error) {
    return { success: false, message: error instanceof WorthaftEditorError ? error.message : 'Speichern fehlgeschlagen. Der aktuelle Stand wurde nicht bestätigt. Bitte neu laden, bevor du es erneut versuchst.' };
  }
}

export async function dismissWorthaftEntry(kind: unknown, id: unknown, revision: unknown, dependencies: EditorDependencies): Promise<EditorResult> {
  const actor = await dependencies.authorize();
  if (!actor) return { success: false, message: 'Bitte erneut anmelden.' };
  try {
    assertModerationKind(kind);
    assertDocumentId(id);
    assertRevision(revision);
    await dependencies.deleteEntry(kind, id, revision, actor.id);
    return { success: true, message: 'Eintrag gelöscht. Die Wortlisten wurden nicht geändert.' };
  } catch (error) {
    return { success: false, message: error instanceof WorthaftEditorError ? error.message : 'Löschen fehlgeschlagen. Bitte den aktuellen Stand neu laden.' };
  }
}
