
import { DatabaseExplorer } from "@/components/internal/database/database-explorer";

export default function DatabasePage() {
    return (
        <div className="h-full flex flex-col">
            <header className="mb-6">
                <h1 className="text-2xl font-medium text-gray-900">Firestore Database Explorer</h1>
                <p className="text-sm text-gray-500 mt-1">Verwalten Sie hier Ihre Datenbankinhalte.</p>
            </header>
            <main className="flex-grow min-h-0">
                <DatabaseExplorer />
            </main>
        </div>
    );
}
