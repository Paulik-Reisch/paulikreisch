
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Database, AlertCircle, RefreshCw, ServerCrash } from 'lucide-react';
import { getCollectionDataAction } from '@/app/internal/database/actions';
import { CollectionView } from './collection-view';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const collections = [
    { id: 'newsletters', name: 'Newsletters' },
    { id: 'subscribers', name: 'Abonnenten' },
    { id: 'orders', name: 'Bestellungen' },
    { id: 'palabrotas', name: 'Palabrotas' },
    { id: 'chistes', name: 'Chistes (Witze)' },
    { id: 'excerpts', name: 'Exzerpte' },
    { id: 'legal', name: 'Rechtsseiten' },
    { id: 'campaigns', name: 'Kampagnen' },
    { id: 'settings', name: 'Einstellungen' },
    { id: 'logs', name: 'Logs' },
];

// Simplified schemas for dynamic form generation
const schemas: Record<string, Record<string, any>> = {
    palabrotas: {
        de: { type: 'string', label: 'Deutsch' },
        es: { type: 'string', label: 'Spanisch' },
        wortart: { type: 'string', label: 'Wortart' },
        anwendung: { type: 'textarea', label: 'Anwendung' },
        synonyme: { type: 'textarea', label: 'Synonyme' },
        beispiel: { type: 'textarea', label: 'Beispiel' },
        pfeiferFaktor: { type: 'number', label: 'Pfeifer-Faktor' },
    },
     logs: {
        user: { type: 'string', label: 'Benutzer', readonly: true },
        action: { type: 'string', label: 'Aktion', readonly: true },
        details: { type: 'string', label: 'Details', readonly: true },
        timestamp: { type: 'datetime', label: 'Zeitstempel', readonly: true },
    },
    // Add other schemas as needed...
}

export function DatabaseExplorer() {
    const [selectedCollection, setSelectedCollection] = useState<string | null>('newsletters');
    const [documents, setDocuments] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const fetchDocuments = useCallback(async (collectionId: string | null) => {
        if (!collectionId) return;
        setLoading(true);
        setError(null);
        try {
            const data = await getCollectionDataAction(collectionId);
            setDocuments(data);
        } catch (e: any) {
            setError(e.message);
            setDocuments([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDocuments(selectedCollection);
    }, [selectedCollection, fetchDocuments]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-6 h-full">
            <div className="border rounded-lg bg-white p-4 flex flex-col">
                <h2 className="text-sm font-semibold text-gray-500 mb-4 px-2">Collections</h2>
                <nav className="flex flex-col gap-1">
                    {collections.map(col => (
                        <Button
                            key={col.id}
                            variant="ghost"
                            onClick={() => setSelectedCollection(col.id)}
                            className={cn(
                                "gcp-button justify-start",
                                selectedCollection === col.id && "bg-accent text-accent-foreground font-semibold"
                            )}
                        >
                            <Database className="mr-2 h-4 w-4" />
                            {col.name}
                        </Button>
                    ))}
                </nav>
            </div>
            <div className="flex-grow">
                {selectedCollection && (
                    <header className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold capitalize">{selectedCollection}</h2>
                         <Button onClick={() => fetchDocuments(selectedCollection)} disabled={loading} variant="outline" className="gcp-button">
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                            Aktualisieren
                        </Button>
                    </header>
                )}
                {loading ? (
                     <div className="flex items-center justify-center h-64 border rounded-lg bg-white">
                        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                    </div>
                ) : error ? (
                    <Alert variant="destructive">
                        <ServerCrash className="h-4 w-4" />
                        <AlertTitle>Fehler beim Laden der Daten</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                ) : selectedCollection ? (
                    <CollectionView 
                        collectionId={selectedCollection} 
                        documents={documents}
                        schema={schemas[selectedCollection] || {}}
                        onRefresh={() => fetchDocuments(selectedCollection)}
                    />
                ) : (
                    <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-lg">
                        <p className="text-gray-500">Wählen Sie eine Collection aus, um die Dokumente anzuzeigen.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
