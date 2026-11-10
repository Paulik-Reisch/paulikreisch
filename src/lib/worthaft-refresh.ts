import { WORTHAFT_WORD_LISTS_CACHE_TAG } from './worthaft-cache-policy';

export type WorthaftRefreshDependencies = {
  /** Returns the admin session, or null when nobody is signed in as an admin. */
  getSession: () => Promise<unknown>;
  /** Expires the cache entries with the given tag immediately. */
  expireTag: (tag: string) => void;
};

export type WorthaftRefreshResult = 'refreshed' | 'unauthenticated';

/**
 * Expires the cached Worthaft word lists, but only for a signed-in admin.
 * Sessions are only issued after the admin credential check in the login action.
 */
export async function refreshWorthaftWordLists({
  getSession,
  expireTag,
}: WorthaftRefreshDependencies): Promise<WorthaftRefreshResult> {
  const session = await getSession();
  if (!session) {
    return 'unauthenticated';
  }

  expireTag(WORTHAFT_WORD_LISTS_CACHE_TAG);
  return 'refreshed';
}
