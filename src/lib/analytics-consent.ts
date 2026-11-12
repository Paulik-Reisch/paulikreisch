export const CONSENT_KEY = 'hallowelt_cookie_consent';
export const ANALYTICS_ID_KEY = 'pr_analytics_visitor_v1';
export const CONSENT_CHANGED = 'pr:consent-changed';
export const OPEN_CONSENT = 'pr:open-consent';
const MAX_AGE = 90 * 24 * 60 * 60 * 1000;
export function analyticsAllowed(storage: Pick<Storage, 'getItem'>): boolean {
  try { const consent = JSON.parse(storage.getItem(CONSENT_KEY) ?? 'null'); return consent?.analytics === true && consent?.version === 2; } catch { return false; }
}
/** A pseudonymous browser ID, not an account or a claim of anonymity. */
export function getAnalyticsId(storage: Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>, makeId: () => string, now = Date.now()): string | null {
  try {
    if (!analyticsAllowed(storage)) { storage.removeItem(ANALYTICS_ID_KEY); return null; }
    const saved = JSON.parse(storage.getItem(ANALYTICS_ID_KEY) ?? 'null');
    if (typeof saved?.id === 'string' && /^visitor:[0-9a-f-]{36}$/.test(saved.id) && Number.isFinite(saved.expiresAt) && saved.expiresAt > now && saved.expiresAt <= now + MAX_AGE) return saved.id;
    const id = `visitor:${makeId()}`;
    storage.setItem(ANALYTICS_ID_KEY, JSON.stringify({ id, expiresAt: now + MAX_AGE }));
    return id;
  } catch { return null; }
}

/** Fail closed even when the browser blocks access to localStorage itself. */
export function getBrowserAnalyticsId(): string | null {
  try { return getAnalyticsId(window.localStorage, () => crypto.randomUUID()); } catch { return null; }
}
