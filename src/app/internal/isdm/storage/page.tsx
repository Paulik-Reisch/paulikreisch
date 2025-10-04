import { FileManager } from "@/components/internal/storage/file-manager";

export default function StoragePage() {
    return (
        <div className="space-y-6">
            <header>
                 <h1 className="text-2xl font-medium text-gray-900">Cloud Storage</h1>
                <p className="text-sm text-gray-500 mt-1">Verwalten Sie hier Ihre Dateien.</p>
            </header>
            <FileManager />
        </div>
    );
}
