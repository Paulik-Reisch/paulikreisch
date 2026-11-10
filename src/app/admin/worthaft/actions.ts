"use server";

import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { WORTHAFT_WORD_LISTS_CACHE_TAG } from "@/lib/worthaft-cache-policy";

/**
 * Drops the cached Worthaft word lists so the next game request reads them
 * again from Firestore. Needed after editing the lists in the Firebase console,
 * which cannot notify the app. Admin session required.
 */
export async function refreshWorthaftWordListsAction(): Promise<void> {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  revalidateTag(WORTHAFT_WORD_LISTS_CACHE_TAG, { expire: 0 });
  redirect("/admin/worthaft?refreshed=1");
}
