export type AnalyticsInput = { type: string; path: string; userId: string; params: Record<string, string | number> };
const TYPES = new Set(['page_view','newsletter_subscription','view_shop','funnel_book_click','newsletter_pause','unsubscribe_survey','unsubscribe_save_accept','newsletter_unsubscribe_confirm','unsubscribe_view','unsubscribe_start','unsubscribe_complete']);
const SAFE_PARAMS = new Set(['userAgent','language','screen_width','screen_height','source','from','reason','days','frequency']);
/** Public analytics endpoints accept pseudonymous IDs and bounded fields only. */
export function analyticsInput(type: string, userId: string, path: string, params: object): AnalyticsInput | null {
  if (!TYPES.has(type) || !/^visitor:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId)) return null;
  if (typeof path !== 'string' || !path.startsWith('/') || path.length > 200) return null;
  const clean: Record<string,string|number> = {};
  for (const [key,value] of Object.entries(params ?? {})) {
    if (!SAFE_PARAMS.has(key)) continue;
    if (typeof value === 'string' && value.length <= 300 && !value.includes('@')) clean[key]=value;
    if (typeof value === 'number' && Number.isFinite(value)) clean[key]=value;
  }
  return {type,userId,path:path.split(/[?#]/)[0],params:clean};
}
