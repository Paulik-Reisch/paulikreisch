
export default function GenkitPage() {
    return (
        <div className="h-full flex flex-col">
            <header className="mb-6">
                <h1 className="text-2xl font-medium text-gray-900">KI-Flow &amp; API-Monitoring (Genkit)</h1>
                <p className="text-sm text-gray-500 mt-1">Überwachen und testen Sie Ihre Genkit AI-Flows.</p>
            </header>
            <main className="flex-grow min-h-0 relative">
                <div className="absolute inset-0">
                    {/* <GenkitExplorer /> */}
                     <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg">
                        <p className="text-gray-500">Genkit Explorer Komponente wird hier geladen.</p>
                    </div>
                </div>
            </main>
        </div>
    );
}
