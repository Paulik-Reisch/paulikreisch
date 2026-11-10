import 'server-only';

import { unstable_cache } from 'next/cache';
import { format, startOfMonth, subMonths } from 'date-fns';
import { de } from 'date-fns/locale';
import { loadAnalyticsEvents } from './firestore';
import { aggregateAnalytics } from './analytics-aggregation';

const TOP_LIST_LENGTH = 7;

/** The dashboard numbers are reused for this long, so reloads cost no reads. */
const ANALYTICS_REVALIDATE_SECONDS = 5 * 60;

async function computeAnalyticsDashboard() {
  const now = new Date();
  const events = await loadAnalyticsEvents(startOfMonth(subMonths(now, 1)));
  const result = aggregateAnalytics(events, now, TOP_LIST_LENGTH);

  return {
    summary: result.summary,
    chartData: result.chart.map(({ monthStart, pageViews }) => ({
      month: format(new Date(monthStart), 'MMMM', { locale: de }),
      pageViews,
    })),
    topPages: result.topPages,
    topSources: result.topSources,
    deviceBreakdown: result.deviceBreakdown,
  };
}

/**
 * All statistics of the admin analytics page from a single read of the event
 * history, cached for a few minutes.
 */
export const getAnalyticsDashboard = unstable_cache(computeAnalyticsDashboard, ['analytics-dashboard-v1'], {
  revalidate: ANALYTICS_REVALIDATE_SECONDS,
});
