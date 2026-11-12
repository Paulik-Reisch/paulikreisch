import { validateListSave, type SaveListsRequest, type WorthaftListSnapshot } from './worthaft-editor-service';

export type ListWritePlan = {
  words: string[] | null;
  antiWords: string[] | null;
  audit: { user: string; action: string; details: string } | null;
};

/** Pure transaction plan. The caller must read both versions within the write transaction. */
export function planWorthaftListWrite(current: WorthaftListSnapshot, request: SaveListsRequest, date: string, actor: string): ListWritePlan {
  const preview = validateListSave(current, request, date);
  return {
    words: preview.wordChanges.orderChanged ? preview.normalized.words : null,
    antiWords: preview.blockedChanges.orderChanged ? preview.normalized.antiWords : null,
    audit: preview.changed ? {
      user: actor,
      action: 'Worthaft-Listen aktualisiert',
      details: `Wörter: ${preview.wordChanges.beforeCount} → ${preview.wordChanges.afterCount}; gesperrt: ${preview.blockedChanges.beforeCount} → ${preview.blockedChanges.afterCount}`,
    } : null,
  };
}
