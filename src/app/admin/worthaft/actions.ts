"use server";

import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { refreshWorthaftWordLists } from "@/lib/worthaft-refresh";

/**
 * Drops the cached Worthaft word lists so the next game request reads them
 * again from Firestore. Needed after editing the lists in the Firebase console,
 * which cannot notify the app. Admin session required.
 */
export async function refreshWorthaftWordListsAction(): Promise<void> {
  const result = await refreshWorthaftWordLists({
    getSession,
    expireTag: (tag) => revalidateTag(tag, { expire: 0 }),
  });

  if (result === "unauthenticated") {
    redirect("/login");
  }

  redirect("/admin/worthaft?refreshed=1");
}
