import test from 'node:test';
import assert from 'node:assert/strict';
import { aggregateAnalytics, UNKNOWN_SOURCE, type AnalyticsEventInput } from '../../src/lib/analytics-aggregation';

const now = new Date(2026, 10, 10, 12, 0, 0); // 10 Nov 2026, local time

const view = (day: Date, userId: string, path: string, params: AnalyticsEventInput['params'] = {}): AnalyticsEventInput => ({
  type: 'page_view', timestamp: day, userId, path, params,
});

const events: AnalyticsEventInput[] = [
  view(new Date(2026, 10, 2, 9), 'u1', '/impressum?x=1', { userAgent: 'Mozilla Mobile Safari', utm_source: 'news' }),
  view(new Date(2026, 10, 2, 15), 'u1', '/shop', { userAgent: 'Mozilla Mobile Safari' }),
  view(new Date(2026, 10, 3, 9), 'u1', '/shop', { userAgent: 'Mozilla Mobile Safari' }),
  view(new Date(2026, 10, 5, 9), 'u2', '/shop', { userAgent: 'Mozilla Windows', source: 'mail' }),
  view(new Date(2026, 9, 31, 23, 59, 59, 999), 'u3', '/shop', {}),
  view(new Date(2026, 9, 1, 0, 0, 0, 0), 'u3', '/ueber', {}),
  view(new Date(2026, 8, 30, 23, 59), 'u4', '/ueber', { userAgent: 'Mozilla Windows' }),
  { type: 'newsletter_subscription', timestamp: new Date(2026, 10, 4), userId: 'u2' },
  { type: 'newsletter_subscription', timestamp: new Date(2026, 9, 20), userId: 'u3' },
  { type: 'newsletter_subscription', timestamp: new Date(2026, 9, 21), userId: 'u4' },
  { type: 'something_else', timestamp: new Date(2026, 10, 4), userId: 'u9' },
];

const result = aggregateAnalytics(events, now);

test('summary compares the current month with the previous month', () => {
  assert.deepEqual(result.summary.pageViews, { value: 4, change: 100, changeSamePeriod: 300 });
  assert.deepEqual(result.summary.visitors, { value: 2, change: 100, changeSamePeriod: 100 });
  assert.deepEqual(result.summary.newsletterSubscriptions, { value: 1, change: -50, changeSamePeriod: 100 });
  assert.equal(result.summary.conversionRate.value, 5.4);
});

test('same-period comparison only counts the equally long elapsed window of the previous month', () => {
  // 10 Nov 12:00 -> previous window is 1 Oct 00:00 through 10 Oct 12:00:
  // the 31 Oct view and the 20/21 Oct subscriptions stay out of it.
  const samePeriod = aggregateAnalytics(events, now);
  assert.equal(samePeriod.summary.pageViews.changeSamePeriod, 300); // 4 now vs 1 in window
  assert.equal(samePeriod.summary.newsletterSubscriptions.changeSamePeriod, 100); // 1 vs 0
});

test('same-period end is clamped when the current month is longer than the previous one', () => {
  const endOfOctober = new Date(2026, 9, 31, 12, 0, 0); // September has only 30 days
  const octoberEvents: AnalyticsEventInput[] = [
    view(new Date(2026, 9, 1, 8), 'o1', '/shop'),      // current month, never previous
    view(new Date(2026, 8, 30, 23, 59), 'o2', '/shop'), // last moment of September
  ];
  const clamped = aggregateAnalytics(octoberEvents, endOfOctober);
  // Same-period window may cover 1 Sep through 30 Sep 23:59:59.999 at most,
  // so the 1 Oct view must not leak into the previous period.
  assert.equal(clamped.summary.pageViews.value, 1);
  assert.equal(clamped.summary.pageViews.change, 0); // 1 vs 1 full month
  assert.equal(clamped.summary.pageViews.changeSamePeriod, 0); // 1 vs 1 clamped window
});

test('month boundaries are inclusive and the chart covers six months', () => {
  assert.equal(result.chart.length, 6);
  assert.deepEqual(result.chart.map(m => m.pageViews), [0, 0, 0, 1, 2, 4]);
  assert.equal(new Date(result.chart[5].monthStart).getMonth(), 10);
  assert.equal(new Date(result.chart[0].monthStart).getMonth(), 5);
});

test('top pages ignore the query string and sort by views', () => {
  assert.deepEqual(result.topPages, [
    { path: '/shop', views: 4 },
    { path: '/ueber', views: 2 },
    { path: '/impressum', views: 1 },
  ]);
  assert.equal(aggregateAnalytics(events, now, 1).topPages.length, 1);
});

test('top sources count distinct visitors per source and name missing origins unknown', () => {
  assert.equal(UNKNOWN_SOURCE, 'Unbekannt');
  assert.deepEqual(result.topSources, [
    { source: 'Unbekannt', visitors: 3 },
    { source: 'news', visitors: 1 },
    { source: 'mail', visitors: 1 },
  ]);
});

test('device breakdown counts one visitor per day and ignores unknown agents', () => {
  assert.deepEqual(result.deviceBreakdown, [
    { type: 'Desktop', count: 2 },
    { type: 'Mobile', count: 2 },
  ]);
});

test('an empty history gives zero values without errors', () => {
  const empty = aggregateAnalytics([], now);
  assert.equal(empty.summary.pageViews.value, 0);
  assert.equal(empty.summary.pageViews.change, 0);
  assert.equal(empty.summary.pageViews.changeSamePeriod, 0);
  assert.deepEqual(empty.topPages, []);
});

test('local visitor identifiers count distinct browsers, not Firebase accounts', () => {
 const local = aggregateAnalytics([
  view(new Date(2026,10,2), 'visitor:11111111-1111-1111-1111-111111111111', '/'),
  view(new Date(2026,10,3), 'visitor:11111111-1111-1111-1111-111111111111', '/shop'),
  view(new Date(2026,10,3), 'visitor:22222222-2222-2222-2222-222222222222', '/'),
 ], now);
 assert.equal(local.summary.visitors.value, 2);
 assert.equal(local.summary.pageViews.value, 3);
});
