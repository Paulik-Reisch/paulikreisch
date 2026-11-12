import 'server-only';
import { unstable_cache } from 'next/cache';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { getAdminDb } from './firebase-admin';
import { getAnalyticsSession } from './analytics-session';
import { aggregateAnalytics } from './analytics-aggregation';
import { ANALYTICS_EVENT_LIMIT, analyticsWindowStart, berlinWallClock, assertAnalyticsReadSize } from './analytics-window';

/** One bounded timestamp query instead of unbounded all-time pageview history.
 * At most5001 document reads per cache refill, not per dashboard reload. Stop rather than present a partial aggregate.
 */
const cachedRead = unstable_cache(async () => {
  const now = new Date(); const since = analyticsWindowStart(now);
  const result = await getAdminDb().collection('analytics_events')
    .where('timestamp','>=',since).where('timestamp','<=',now)
    .orderBy('timestamp','desc').limit(ANALYTICS_EVENT_LIMIT+1).get();
  assertAnalyticsReadSize(result.size);
  const events = result.docs.flatMap(document => {
    const data = document.data();
    if (!['page_view','newsletter_subscription'].includes(data.type) || typeof data.timestamp?.toDate !== 'function') return [];
    const timestamp = data.timestamp.toDate() as Date;
    const path = typeof data.path === 'string' ? data.path.split(/[?#]/)[0].slice(0,200) : '/';
    const params = data.params && typeof data.params === 'object' ? data.params : {};
    return [{ id:document.id,type:data.type as string,timestamp,path,userId:typeof data.userId==='string'?data.userId:undefined,params:{
      userAgent:typeof params.userAgent==='string'?params.userAgent.slice(0,300):'',
      source:typeof params.source==='string'?params.source.slice(0,100):undefined,
      utm_source:typeof params.utm_source==='string'?params.utm_source.slice(0,100):undefined,
    }}];
  });
  const aggregate = aggregateAnalytics(events.map(event=>({...event,timestamp:berlinWallClock(event.timestamp)})),berlinWallClock(now));
  return {
    summary:aggregate.summary,
    chartData:aggregate.chart.map(({monthStart,pageViews})=>({month:format(new Date(monthStart),'MMMM',{locale:de}),pageViews})),
    topPages:aggregate.topPages,topSources:aggregate.topSources,deviceBreakdown:aggregate.deviceBreakdown,
    recentEvents:events.filter(event=>event.type==='page_view').slice(0,5).map(event=>({id:event.id,type:event.type,path:event.path,params:event.params,timestamp:event.timestamp.toISOString()})),
    fetchedAt:now.toISOString(),since:since.toISOString(),readCount:result.size,
  };
},['private-analytics-window-v1'],{revalidate:300});

export async function loadPrivateAnalytics() {
  if (!await getAnalyticsSession()) throw new Error('Nicht angemeldet.');
  return cachedRead();
}
