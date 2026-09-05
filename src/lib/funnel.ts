'use client';

export const FUNNEL = {
  storageKeys: {
    wallUnlocked: 'pr_funnel_unlocked',
    wallDismissed: 'pr_funnel_dismissed',
    exitPopupDismissed: 'pr_exit_popup_dismissed',
    checklistDownloaded: 'pr_checklist_downloaded',
  },
  // 7 days snooze for dismissals
  snoozeDays: 7,
  // LeadWall shows after 60% scroll OR 45s
  scrollTriggerPercent: 60,
  timeTriggerMs: 45000,
  // Analytics event names
  events: {
    wallView: 'funnel_wall_view',
    wallConvert: 'funnel_wall_convert',
    wallDismiss: 'funnel_wall_dismiss',
    bookClick: 'funnel_book_click',
    checklistDownload: 'funnel_checklist_download',
    exitPopupView: 'funnel_exit_popup_view',
    exitPopupConvert: 'funnel_exit_popup_convert',
    exitPopupDismiss: 'funnel_exit_popup_dismiss',
  },
} as const;

export function isSnoozed(key: string, days = FUNNEL.snoozeDays): boolean {
  if (typeof window === 'undefined') return false;
  const raw = localStorage.getItem(key);
  if (!raw) return false;
  const ts = Number(raw);
  if (Number.isNaN(ts)) return false;
  const ms = days * 24 * 60 * 60 * 1000;
  return Date.now() - ts < ms;
}

export function setSnoozed(key: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, String(Date.now()));
}

export function isUnlocked(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(FUNNEL.storageKeys.wallUnlocked) === '1';
}

export function setUnlocked() {
  if (typeof window === 'undefined') return;
  localStorage.setItem(FUNNEL.storageKeys.wallUnlocked, '1');
  // also mark as converted
  setSnoozed(FUNNEL.storageKeys.wallDismissed);
}
