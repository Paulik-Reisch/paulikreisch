
import { AnalyticsClient } from "./analytics-client";
import { getAnalyticsSummary, getMonthlyPageViewsChartData } from "@/lib/firestore";

export default async function AnalyticsPage() {
  const [summary, chartData] = await Promise.all([
    getAnalyticsSummary(),
    getMonthlyPageViewsChartData()
  ]);

  return (
    <div className="space-y-6">
      <header>
          <h1 className="text-3xl font-bold font-headline">Analytics & Tracking</h1>
          <p className="text-muted-foreground">Übersicht über die wichtigsten Kennzahlen und Tracking-Tools.</p>
      </header>
      <AnalyticsClient summary={summary} chartData={chartData} />
    </div>
  );
}
