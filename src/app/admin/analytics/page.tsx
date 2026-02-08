
import { AnalyticsClient } from "./analytics-client";

export default function AnalyticsPage() {
  // Here you could fetch initial data if needed, e.g. from your DB
  // const initialLinkData = await getTrackedLinks();

  return (
    <div className="space-y-6">
      <header>
          <h1 className="text-3xl font-bold font-headline">Analytics & Tracking</h1>
          <p className="text-muted-foreground">Übersicht über die wichtigsten Kennzahlen und Tracking-Tools.</p>
      </header>
      <AnalyticsClient />
    </div>
  );
}
