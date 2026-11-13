/**
 * Pure aggregation for the admin analytics page.
 *
 * The page used to run one Firestore query per statistic, and most of them read
 * the whole page view history. These helpers compute every statistic from one
 * list of events, so the dashboard needs a single read of that history. The
 * results are the same as before: all-time top pages, sources and devices, the
 * current and previous month summary, and the last six months chart.
 *
 * Each summary metric carries two comparisons: the full previous month and the
 * equally long elapsed period of the previous month. A young month compared
 * only with a complete one always looks bad, so both numbers are shown with
 * clear labels instead.
 */

export interface AnalyticsEventInput {
  type: string;
  timestamp: Date;
  path?: string;
  userId?: string;
  params?: { [key: string]: any };
}

export interface MonthlyPageViews {
  monthStart: number;
  pageViews: number;
}

export interface AnalyticsMetric {
  /** Current month to date. */
  value: number;
  /** Percent change vs. the full previous month. */
  change: number;
  /** Percent change vs. the equally long elapsed period of the previous month. */
  changeSamePeriod: number;
}

export interface AnalyticsAggregates {
  summary: {
    visitors: AnalyticsMetric;
    pageViews: AnalyticsMetric;
    newsletterSubscriptions: AnalyticsMetric;
    conversionRate: AnalyticsMetric;
  };
  chart: MonthlyPageViews[];
  topPages: { path: string; views: number }[];
  topSources: { source: string; visitors: number }[];
  deviceBreakdown: { type: string; count: number }[];
}

/**
 * Events without campaign data land here. A missing origin is unknown, not
 * proof that someone typed the address directly, so the bucket is named
 * accordingly. Historical events keep their stored data; only the grouping
 * label changed.
 */
export const UNKNOWN_SOURCE = 'Unbekannt';

export const CHART_MONTHS = 6;

const monthStartOf = (now: Date, monthsBack: number) => new Date(now.getFullYear(), now.getMonth() - monthsBack, 1);
const monthEndOf = (now: Date, monthsBack: number) => new Date(now.getFullYear(), now.getMonth() - monthsBack + 1, 0, 23, 59, 59, 999);

const percentChange = (current: number, previous: number) => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
};

const metric = (current: number, previousFull: number, previousSamePeriod: number): AnalyticsMetric => ({
  value: current,
  change: percentChange(current, previousFull),
  changeSamePeriod: percentChange(current, previousSamePeriod),
});

function summaryForPeriod(events: AnalyticsEventInput[], start: Date, end: Date) {
  const inPeriod = events.filter(e => e.timestamp >= start && e.timestamp <= end);
  const views = inPeriod.filter(e => e.type === 'page_view');
  return {
    pageViews: views.length,
    visitors: new Set(views.map(e => e.userId)).size,
    newsletterSubscriptions: inPeriod.filter(e => e.type === 'newsletter_subscription').length,
  };
}

/**
 * `events` must contain every page view and every newsletter subscription
 * since the start of the previous month. Other event types are ignored.
 */
export function aggregateAnalytics(events: AnalyticsEventInput[], now: Date, topLimit = 7): AnalyticsAggregates {
  const pageViews = events.filter(e => e.type === 'page_view');

  const currentStart = monthStartOf(now, 0);
  const previousStart = monthStartOf(now, 1);
  const previousEnd = monthEndOf(now, 1);

  const current = summaryForPeriod(events, currentStart, now);
  const previous = summaryForPeriod(events, previousStart, previousEnd);

  // Same elapsed duration one month earlier, clamped so a longer current
  // month never reaches into its own days.
  const samePeriodEnd = new Date(Math.min(previousStart.getTime() + (now.getTime() - currentStart.getTime()), previousEnd.getTime()));
  const previousSamePeriod = summaryForPeriod(events, previousStart, samePeriodEnd);

  const chart: MonthlyPageViews[] = [];
  for (let i = CHART_MONTHS - 1; i >= 0; i--) {
    const start = monthStartOf(now, i);
    const end = monthEndOf(now, i);
    chart.push({
      monthStart: start.getTime(),
      pageViews: pageViews.filter(e => e.timestamp >= start && e.timestamp <= end).length,
    });
  }

  const pageCounts: { [path: string]: number } = {};
  const sourceUsers: { [source: string]: Set<string | undefined> } = {};
  const seenUserDays = new Set<string>();
  const devices = { Desktop: 0, Mobile: 0 };

  for (const event of pageViews) {
    const basePath = (event.path ?? '').split('?')[0];
    pageCounts[basePath] = (pageCounts[basePath] || 0) + 1;

    const source = event.params?.utm_source || event.params?.source || UNKNOWN_SOURCE;
    (sourceUsers[source] ||= new Set()).add(event.userId);

    const userDay = `${event.userId}-${event.timestamp.toDateString()}`;
    if (!seenUserDays.has(userDay)) {
      seenUserDays.add(userDay);
      const userAgent: string = event.params?.userAgent || '';
      if (userAgent.toLowerCase().includes('mobi')) devices.Mobile++;
      else if (userAgent) devices.Desktop++;
    }
  }

  return {
    summary: {
      visitors: metric(current.visitors, previous.visitors, previousSamePeriod.visitors),
      pageViews: metric(current.pageViews, previous.pageViews, previousSamePeriod.pageViews),
      newsletterSubscriptions: metric(
        current.newsletterSubscriptions,
        previous.newsletterSubscriptions,
        previousSamePeriod.newsletterSubscriptions,
      ),
      // Conversion rate is still a placeholder, as before.
      conversionRate: { value: 5.4, change: 0, changeSamePeriod: 0 },
    },
    chart,
    topPages: Object.entries(pageCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, topLimit)
      .map(([path, views]) => ({ path, views })),
    topSources: Object.entries(sourceUsers)
      .sort(([, a], [, b]) => b.size - a.size)
      .slice(0, topLimit)
      .map(([source, users]) => ({ source, visitors: users.size })),
    deviceBreakdown: [
      { type: 'Desktop', count: devices.Desktop },
      { type: 'Mobile', count: devices.Mobile },
    ],
  };
}
