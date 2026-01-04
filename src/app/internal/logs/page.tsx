'use server';

import { getLogs } from '@/lib/firestore';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

export default async function LogsPage() {
    const logs = await getLogs();

    const getActionVariant = (action: string) => {
        if (!action) return 'outline'; // Handle undefined or null action
        const lowerCaseAction = action.toLowerCase();
        if (lowerCaseAction.includes('delete') || lowerCaseAction.includes('löschen') || lowerCaseAction.includes('fehlgeschlagen')) return 'destructive';
        if (lowerCaseAction.includes('add') || lowerCaseAction.includes('erstellen') || lowerCaseAction.includes('login')) return 'default';
        if (lowerCaseAction.includes('update') || lowerCaseAction.includes('aktualisiert')) return 'secondary';
        return 'outline';
    }

    return (
        <div className="space-y-6">
            <header>
                <h1 className="text-2xl font-medium text-gray-900">Aktivitäts-Logs</h1>
                <p className="text-sm text-gray-500 mt-1">Eine Übersicht aller wichtigen Änderungen und Aktionen im System.</p>
            </header>
            <div className="border rounded-lg overflow-hidden bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[200px]">Zeitpunkt</TableHead>
                            <TableHead className="w-[150px]">Benutzer</TableHead>
                            <TableHead className="w-[250px]">Aktion</TableHead>
                            <TableHead>Details</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {logs.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center">
                                    Noch keine Log-Einträge vorhanden.
                                </TableCell>
                            </TableRow>
                        ) : (
                            logs.map(log => (
                                <TableRow key={log.id}>
                                    <TableCell>{format(new Date(log.timestamp), "dd.MM.yyyy, HH:mm:ss 'Uhr'", { locale: de })}</TableCell>
                                    <TableCell className="font-medium">{log.user}</TableCell>
                                    <TableCell>
                                        <Badge variant={getActionVariant(log.action)}>{log.action || 'Unbekannt'}</Badge>
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground font-mono">{log.details}</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
    