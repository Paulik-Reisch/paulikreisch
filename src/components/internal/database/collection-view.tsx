
"use client";

import { useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Search, Loader2 } from "lucide-react";
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { DocumentEditor } from './document-editor';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useActionState } from 'react';
import { deleteDocumentAction, ActionResponse } from '@/app/internal/database/actions';
import { useToast } from '@/hooks/use-toast';

const MAX_PREVIEW_LENGTH = 50;

function formatValue(value: any): React.ReactNode {
    if (value === null || value === undefined) {
        return <i className="text-gray-400">null</i>;
    }
    if (typeof value === 'boolean') {
        return <Badge variant={value ? "default" : "secondary"}>{value ? 'Ja' : 'Nein'}</Badge>;
    }
    if (value instanceof Date) {
        return format(value, "dd.MM.yyyy HH:mm", { locale: de });
    }
    if (typeof value === 'object' && value.seconds !== undefined) { // Firestore Timestamp
        return format(new Date(value.seconds * 1000), "dd.MM.yyyy HH:mm", { locale: de });
    }
    if (typeof value === 'object') {
         const str = JSON.stringify(value);
         if (str.length > MAX_PREVIEW_LENGTH) {
            return <code className="text-xs">{str.substring(0, MAX_PREVIEW_LENGTH)}...</code>;
         }
         return <code className="text-xs">{str}</code>;
    }
    if (typeof value === 'string' && value.length > MAX_PREVIEW_LENGTH) {
        return `${value.substring(0, MAX_PREVIEW_LENGTH)}...`;
    }
    return String(value);
}

const initialDeleteState: ActionResponse = { success: false };

export function CollectionView({ collectionId, documents, schema, onRefresh }: { collectionId: string, documents: any[], schema: Record<string, any>, onRefresh: () => void }) {
    const [searchTerm, setSearchTerm] = useState('');
    const { toast } = useToast();

    const [deleteState, deleteFormAction, isDeleting] = useActionState(deleteDocumentAction, initialDeleteState);

    const headers = useMemo(() => {
        if (documents.length === 0) return ['ID'];
        const keys = new Set(['id']);
        // Add schema keys first
        Object.keys(schema).forEach(key => keys.add(key));
        // Then add other keys from documents
        documents.forEach(doc => {
            Object.keys(doc).forEach(key => {
                if(typeof doc[key] !== 'object' || Array.isArray(doc[key])) {
                    keys.add(key)
                }
            });
        });
        return Array.from(keys);
    }, [documents, schema]);
    
    const filteredDocuments = useMemo(() => {
        if (!searchTerm) return documents;
        return documents.filter(doc => {
            return Object.values(doc).some(value => 
                String(value).toLowerCase().includes(searchTerm.toLowerCase())
            );
        });
    }, [documents, searchTerm]);

    const handleDelete = (documentId: string) => {
        const formData = new FormData();
        formData.set('collectionId', collectionId);
        formData.set('documentId', documentId);
        deleteFormAction(formData);
    }
    
    React.useEffect(() => {
        if(deleteState.success) {
            toast({ title: "Erfolg", description: deleteState.message });
            onRefresh();
        }
        if (deleteState.error) {
            toast({ variant: "destructive", title: "Fehler", description: deleteState.error });
        }
    }, [deleteState, toast, onRefresh]);

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                        placeholder="Dokumente durchsuchen..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full md:w-80 pl-8 gcp-input"
                    />
                </div>
                <DocumentEditor collectionId={collectionId} schema={schema} onSave={onRefresh}>
                    <Button className="gcp-button-primary">Dokument hinzufügen</Button>
                </DocumentEditor>
            </div>
            <div className="border rounded-lg overflow-hidden bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {headers.map(header => (
                                <TableHead key={header}>{header}</TableHead>
                            ))}
                            <TableHead className="text-right">Aktionen</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredDocuments.length === 0 ? (
                             <TableRow>
                                <TableCell colSpan={headers.length + 1} className="h-24 text-center">
                                    Keine Dokumente gefunden.
                                </TableCell>
                            </TableRow>
                        ) : filteredDocuments.map(doc => (
                            <TableRow key={doc.id}>
                                {headers.map(header => (
                                    <TableCell key={header} className="max-w-xs truncate">
                                        {formatValue(doc[header])}
                                    </TableCell>
                                ))}
                                <TableCell className="text-right">
                                     <DocumentEditor collectionId={collectionId} document={doc} schema={schema} onSave={onRefresh}>
                                        <Button size="icon" variant="ghost" className="gcp-icon-button">
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                    </DocumentEditor>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button size="icon" variant="ghost" className="gcp-icon-button text-red-500 hover:text-red-700">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Sind Sie sicher?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Dokument mit der ID "{doc.id}" wird dauerhaft gelöscht. Diese Aktion kann nicht rückgängig gemacht werden.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleDelete(doc.id)} disabled={isDeleting}>
                                                   {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                    Ja, löschen
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
