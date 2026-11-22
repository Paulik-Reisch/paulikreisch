"use server";

import { revalidateTag } from 'next/cache';
import { getSession } from '@/lib/session';
import { assertAdminMutationOrigin } from '@/lib/admin-request';
import { WORTHAFT_WORD_LISTS_CACHE_TAG } from '@/lib/worthaft-cache-policy';
import { saveWorthaftLists, dismissWorthaftEntry, type SaveListsRequest, type ModerationKind } from '@/lib/worthaft-editor-service';
import { commitWorthaftLists, deleteWorthaftModerationEntry, loadWorthaftEditorLists, loadWorthaftModeration } from '@/lib/worthaft-editor-repository';

const dependencies = {
  authorize: async () => {
    await assertAdminMutationOrigin();
    return (await getSession())?.user ?? null;
  },
  commitLists: commitWorthaftLists,
  expireLists: () => revalidateTag(WORTHAFT_WORD_LISTS_CACHE_TAG, { expire: 0 }),
  deleteEntry: deleteWorthaftModerationEntry,
};

export async function saveListsAction(request: SaveListsRequest) {
  return saveWorthaftLists(request, dependencies);
}
export async function dismissEntryAction(kind: unknown, id: unknown, revision: unknown) {
  return dismissWorthaftEntry(kind, id, revision, dependencies);
}
export async function reloadListsAction() {
  await assertAdminMutationOrigin();
  return loadWorthaftEditorLists();
}
export async function loadModerationAction(kind: ModerationKind, cursor: string | null) {
  await assertAdminMutationOrigin();
  return loadWorthaftModeration(kind, cursor);
}
