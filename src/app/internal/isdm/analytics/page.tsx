
import { AnalyticsDashboard } from "@/components/internal/analytics/dashboard";

export default function AnalyticsPage() {
    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-2xl font-medium text-gray-900">Analytics</h1>
                <p className="text-sm text-gray-500 mt-1">Detaillierte Analyse der Webseiten-Nutzung.</p>
            </header>
            <AnalyticsDashboard />
        </div>
    );
}
