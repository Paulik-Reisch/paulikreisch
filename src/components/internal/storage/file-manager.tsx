"use client";

import React, { useState, useEffect, useCallback, useTransition } from 'react';
import { useDropzone } from 'react-dropzone';
import { listFiles } from '@/lib/firestore';
import type { StorageFile } from '@/lib/firestore';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { UploadCloud, File, Trash2, Copy, RefreshCw, HardDrive, Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { deleteFileAction, getUploadUrlAction, getDownloadUrlAction } from '@/app/internal/storage/actions';
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

function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}


export function FileManager() {
    const [files, setFiles] = useState<StorageFile[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploadingFiles, setUploadingFiles] = useState<any[]>([]);
    const [isDeleting, startDeleteTransition] = useTransition();

    const { toast } = useToast();

    const fetchFiles = useCallback(async () => {
        setLoading(true);
        try {
            const fileList = await listFiles('/');
            setFiles(fileList);
        } catch (error) {
            console.error("Error fetching files:", error);
            toast({ variant: "destructive", title: "Fehler", description: "Dateien konnten nicht geladen werden." });
        } finally {
            setLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        fetchFiles();
    }, [fetchFiles]);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const newUploads = acceptedFiles.map(file => ({
            file,
            id: `${file.name}-${Date.now()}`,
            progress: 0,
            status: 'uploading',
        }));
        
        setUploadingFiles(prev => [...prev, ...newUploads]);

        for (const upload of newUploads) {
            try {
                const { url, error } = await getUploadUrlAction(upload.file.name, upload.file.type);

                if (error || !url) {
                    throw new Error(error || 'Keine Upload-URL erhalten.');
                }
                
                const xhr = new XMLHttpRequest();
                xhr.open('PUT', url, true);
                xhr.setRequestHeader('Content-Type', upload.file.type);

                xhr.upload.onprogress = (event) => {
                    if (event.lengthComputable) {
                        const progress = (event.loaded / event.total) * 100;
                        setUploadingFiles(prev => prev.map(u => u.id === upload.id ? { ...u, progress } : u));
                    }
                };

                xhr.onload = () => {
                    if (xhr.status === 200) {
                         setUploadingFiles(prev => prev.map(u => u.id === upload.id ? { ...u, status: 'completed', progress: 100 } : u));
                         setTimeout(() => {
                            setUploadingFiles(prev => prev.filter(u => u.id !== upload.id));
                            fetchFiles();
                         }, 1000);
                         toast({ title: 'Upload erfolgreich', description: `Datei "${upload.file.name}" wurde hochgeladen.` });
                    } else {
                        throw new Error(`Upload fehlgeschlagen mit Status ${xhr.status}`);
                    }
                };

                 xhr.onerror = () => {
                    throw new Error('Netzwerkfehler beim Upload.');
                };

                xhr.send(upload.file);
            } catch (e: any) {
                console.error('Upload Error:', e);
                setUploadingFiles(prev => prev.map(u => u.id === upload.id ? { ...u, status: 'error' } : u));
                toast({ variant: 'destructive', title: `Upload fehlgeschlagen`, description: e.message });
            }
        }
    }, [fetchFiles, toast]);
    
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    const handleDeleteFile = (filePath: string, fileName: string) => {
        startDeleteTransition(async () => {
            const { success, error } = await deleteFileAction(filePath);
            if (success) {
                toast({ title: 'Gelöscht', description: `Datei "${fileName}" wurde gelöscht.` });
                fetchFiles();
            } else {
                toast({ variant: 'destructive', title: 'Fehler beim Löschen', description: error });
            }
        });
    };

    const handleCopyUrl = async (fullPath: string) => {
        const { url, error } = await getDownloadUrlAction(fullPath);
        if (url) {
            navigator.clipboard.writeText(url);
            toast({ title: "Kopiert!", description: "Download-URL wurde in die Zwischenablage kopiert." });
        } else {
             toast({ variant: "destructive", title: "Fehler", description: error });
        }
    };


    return (
        <div className="space-y-8">
            <div {...getRootProps()} className={`p-10 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${isDragActive ? 'border-primary bg-primary/10' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}`}>
                <input {...getInputProps()} />
                <div className="flex flex-col items-center gap-2 text-gray-500">
                    <UploadCloud className="h-10 w-10"/>
                    {isDragActive ? <p className="font-semibold">Dateien hier fallen lassen...</p> : <p className="font-semibold">Dateien per Drag & Drop hierher ziehen oder klicken, um sie auszuwählen</p>}
                    <p className="text-xs">Maximale Dateigröße 50MB</p>
                </div>
            </div>
            
            {uploadingFiles.length > 0 && (
                <div className="space-y-4">
                     <h3 className="text-lg font-medium">Aktuelle Uploads</h3>
                     {uploadingFiles.map(u => (
                        <div key={u.id} className="p-4 border rounded-lg bg-white flex items-center gap-4">
                            <File className="h-6 w-6 text-gray-500"/>
                            <div className="flex-grow">
                                <p className="font-medium truncate">{u.file.name}</p>
                                <Progress value={u.progress} className="h-2 mt-1" />
                            </div>
                            {u.status === 'completed' ? <Badge variant="default">Fertig</Badge> : u.status === 'error' ? <Badge variant="destructive">Fehler</Badge> : <span className="text-sm font-mono text-gray-500">{Math.round(u.progress)}%</span>}
                        </div>
                     ))}
                </div>
            )}

            <div className="border rounded-lg overflow-hidden bg-white">
                 <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50%]">Name</TableHead>
                            <TableHead>Größe</TableHead>
                            <TableHead>Typ</TableHead>
                            <TableHead>Zuletzt geändert</TableHead>
                            <TableHead className="text-right">Aktionen</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                             <TableRow>
                                <TableCell colSpan={5} className="h-32 text-center">
                                    <Loader2 className="mx-auto h-8 w-8 animate-spin text-gray-400" />
                                </TableCell>
                            </TableRow>
                        ) : files.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-32 text-center text-gray-500">
                                    <HardDrive className="mx-auto h-8 w-8 mb-2"/>
                                    Keine Dateien gefunden.
                                </TableCell>
                            </TableRow>
                        ) : (
                            files.map(file => (
                                <TableRow key={file.fullPath}>
                                    <TableCell className="font-medium truncate max-w-sm">
                                        <a href={file.downloadUrl} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-2">
                                            <File className="h-4 w-4 shrink-0 text-gray-500"/>
                                            {file.name}
                                        </a>
                                    </TableCell>
                                    <TableCell>{formatBytes(file.size)}</TableCell>
                                    <TableCell><Badge variant="outline">{file.contentType}</Badge></TableCell>
                                    <TableCell>{format(new Date(file.updated), "dd.MM.yyyy HH:mm", { locale: de })}</TableCell>
                                    <TableCell className="text-right">
                                        <Button size="icon" variant="ghost" className="gcp-icon-button" onClick={() => handleCopyUrl(file.fullPath)} title="Download-URL kopieren">
                                            <Copy className="h-4 w-4"/>
                                        </Button>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button size="icon" variant="ghost" className="gcp-icon-button text-red-500 hover:text-red-700" title="Datei löschen">
                                                    <Trash2 className="h-4 w-4"/>
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Sind Sie sicher?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Die Datei "{file.name}" wird dauerhaft gelöscht. Diese Aktion kann nicht rückgängig gemacht werden.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDeleteFile(file.fullPath, file.name)} disabled={isDeleting}>
                                                        {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
                                                        Ja, löschen
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
