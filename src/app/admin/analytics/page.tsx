import { Suspense } from "react";
import { AnalyticsClient } from "./analytics-client";
import { 
    getAnalyticsSummary, 
    getMonthlyPageViewsChartData,
    getTopPages,
    getTopSources,
    getDeviceBreakdown,
    getRecentEvents
} from "@/lib/firestore";

export default async function AnalyticsPage() {
  const [
    summary, 
    chartData, 
    topPages, 
    topSources, 
    deviceBreakdown, 
    recentEvents
  ] = await Promise.all([
    getAnalyticsSummary(),
    getMonthlyPageViewsChartData(),
    getTopPages(7),
    getTopSources(7),
    getDeviceBreakdown(),
    getRecentEvents(5)
  ]);

  return (
    <div className="space-y-6">
      <header>
          <h1 className="text-3xl font-bold font-headline">Analytics &amp; Tracking</h1>
          <p className="text-muted-foreground">Übersicht über die wichtigsten Kennzahlen und Tracking-Tools.</p>
      </header>
       <Suspense fallback={<div>Loading Analytics...</div>}>
        <AnalyticsClient 
            summary={summary} 
            chartData={chartData}
            topPages={topPages}
            topSources={topSources}
            deviceBreakdown={deviceBreakdown}
            recentEvents={recentEvents}
        />
      </Suspense>
    </div>
  );
}