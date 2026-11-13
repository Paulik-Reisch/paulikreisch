/**
 * Campaign link builder helpers (stage 1 of the Smart UTM expansion).
 *
 * Fixed vocabularies keep campaign labels consistent across channels, and all
 * values are lowercase because UTM values are case-sensitive downstream.
 * Never put recipient IDs, email addresses, game scores or tokens into
 * campaign values: one identifier per campaign or placement, never per person.
 */

export const CAMPAIGN_SOURCES = ['instagram', 'newsletter', 'whatsapp', 'qr', 'facebook', 'tiktok'] as const;
export const CAMPAIGN_MEDIUMS = ['social', 'email', 'messenger', 'print', 'link'] as const;

export type CampaignSource = (typeof CAMPAIGN_SOURCES)[number];
export type CampaignMedium = (typeof CAMPAIGN_MEDIUMS)[number];

/** 1-100 chars, lowercase slug. Blocks '@' and spaces, so no emails or names slip in. */
const VALUE_PATTERN = /^[a-z0-9][a-z0-9_-]{0,99}$/;

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'] as const;

export type CampaignUrlInput = {
  baseUrl: string;
  source: string;
  medium: string;
  campaign: string;
  content?: string;
};

export type CampaignUrlResult = { ok: true; url: string } | { ok: false; error: string };

export function normalizeCampaignValue(raw: string): string {
  return raw.trim().toLowerCase();
}

function invalidValueError(field: string): CampaignUrlResult {
  return {
    ok: false,
    error: `${field}: nur Kleinbuchstaben, Zahlen, Bindestrich und Unterstrich (max. 100 Zeichen). Keine E-Mail-Adressen oder Personendaten.`,
  };
}

/**
 * Builds a campaign URL from validated parts. Existing query parameters are
 * preserved, but existing UTM tags are never overwritten silently: the caller
 * gets an error naming the conflicting keys instead.
 */
export function buildCampaignUrl(input: CampaignUrlInput): CampaignUrlResult {
  let url: URL;
  try {
    url = new URL(input.baseUrl.trim());
  } catch {
    return { ok: false, error: 'Die Ziel-URL ist ungültig.' };
  }
  if (url.protocol !== 'https:' && url.protocol !== 'http:') {
    return { ok: false, error: 'Nur HTTP(S)-Ziele sind erlaubt.' };
  }

  const source = normalizeCampaignValue(input.source);
  const medium = normalizeCampaignValue(input.medium);
  const campaign = normalizeCampaignValue(input.campaign);
  const content = normalizeCampaignValue(input.content ?? '');

  if (!(CAMPAIGN_SOURCES as readonly string[]).includes(source)) {
    return { ok: false, error: 'Unbekannte Quelle. Bitte die feste Auswahl verwenden.' };
  }
  if (!(CAMPAIGN_MEDIUMS as readonly string[]).includes(medium)) {
    return { ok: false, error: 'Unbekanntes Medium. Bitte die feste Auswahl verwenden.' };
  }
  if (!VALUE_PATTERN.test(campaign)) return invalidValueError('Kampagne');
  if (content && !VALUE_PATTERN.test(content)) return invalidValueError('Inhalt');

  const existing = UTM_KEYS.filter((key) => url.searchParams.has(key));
  if (existing.length > 0) {
    return {
      ok: false,
      error: `Die Ziel-URL enthält bereits ${existing.join(', ')}. Bestehende Kampagnenwerte werden nicht überschrieben.`,
    };
  }

  url.searchParams.set('utm_source', source);
  url.searchParams.set('utm_medium', medium);
  url.searchParams.set('utm_campaign', campaign);
  if (content) url.searchParams.set('utm_content', content);

  return { ok: true, url: url.toString() };
}
