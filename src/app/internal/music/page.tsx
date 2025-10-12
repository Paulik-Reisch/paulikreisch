
"use client";

import React, { useState, useEffect, useCallback, useTransition } from 'react';
import { useDropzone } from 'react-dropzone';
import { getStorage, ref, uploadBytesResumable, getDownloadURL, listAll, getMetadata, deleteObject, type StorageReference } from "firebase/storage";
import { app } from "@/app/firebase";
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { UploadCloud, File, Trash2, Copy, RefreshCw, Music, Loader2, PlayCircle, PauseCircle, Music4 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";

const storage = getStorage(app);
const musicFolderRef = ref(storage, 'music');

interface MusicFile {
  name: string;
  url: string;
  path: string;
  size: number;
  updated: string;
}

function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

function UploadDialog({ onUploadComplete }: { onUploadComplete: () => void }) {
  const [filesToUpload, setFilesToUpload] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [isUploading, setIsUploading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFilesToUpload(prev => [...prev, ...acceptedFiles.filter(f => f.type === 'audio/mpeg')]);
    if (acceptedFiles.some(f => f.type !== 'audio/mpeg')) {
        toast({ variant: 'destructive', title: "Falscher Dateityp", description: "Es können nur MP3-Dateien hochgeladen werden."})
    }
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'audio/mpeg': ['.mp3'] }
  });
  
  const handleUpload = async () => {
    if (filesToUpload.length === 0) {
        toast({ variant: 'destructive', title: "Keine Dateien ausgewählt."});
        return;
    }
    
    setIsUploading(true);
    setUploadProgress({});

    const uploadPromises = filesToUpload.map(file => {
      const filePath = `music/${file.name}`;
      const storageRef = ref(storage, filePath);
      const uploadTask = uploadBytesResumable(storageRef, file);

      return new Promise<void>((resolve, reject) => {
        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setUploadProgress(prev => ({...prev, [file.name]: progress}));
            },
            (error) => {
                console.error("Upload Error:", error);
                toast({ variant: "destructive", title: `Fehler beim Upload von ${file.name}`, description: error.message });
                reject(error);
            },
            async () => {
                toast({ title: "Upload erfolgreich", description: `${file.name} wurde hochgeladen.`});
                resolve();
            }
        );
      });
    });

    try {
        await Promise.all(uploadPromises);
    } catch(e) {
        console.error("Ein oder mehrere Uploads sind fehlgeschlagen.");
    } finally {
        setIsUploading(false);
        onUploadComplete();
        setFilesToUpload([]);
        setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if(!isUploading) setIsOpen(open); }}>
      <DialogTrigger asChild>
        <Button className="gcp-button-primary">
          <UploadCloud className="mr-2 h-4 w-4" /> Song hochladen
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Neue Musik hochladen</DialogTitle>
          <DialogDescription>
            Laden Sie eine oder mehrere MP3-Dateien hoch.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
            <div {...getRootProps()} className={`p-10 border-2 border-dashed rounded-md text-center cursor-pointer transition-colors ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}`}>
                <input {...getInputProps()} />
                 <div className="flex flex-col items-center gap-2 text-gray-500">
                    <UploadCloud className="h-10 w-10"/>
                    <p className="font-semibold">MP3-Dateien hierher ziehen oder klicken</p>
                </div>
            </div>
            
            {filesToUpload.length > 0 && (
                <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Ausgewählte Dateien:</h4>
                    <div className="space-y-3 max-h-40 overflow-y-auto pr-2">
                        {filesToUpload.map((file, i) => (
                            <div key={i} className="flex items-center gap-3 p-2 bg-gray-100 rounded-md">
                                <Music className="h-5 w-5 text-gray-500" />
                                <div className="flex-grow">
                                    <p className="text-sm font-medium truncate">{file.name}</p>
                                    {uploadProgress[file.name] !== undefined && <Progress value={uploadProgress[file.name]} className="h-1 mt-1" />}
                                </div>
                                <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-red-500" onClick={() => setFilesToUpload(files => files.filter(f => f.name !== file.name))}>
                                    <Trash2 className="h-4 w-4"/>
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
        <Button onClick={handleUpload} disabled={isUploading} className="w-full gcp-button-primary">
            {isUploading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Lade hoch...</> : "Hochladen"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}

function MusicPlayer({ file, onEnded }: { file: MusicFile | null; onEnded: () => void }) {
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (file && audioRef.current) {
      audioRef.current.src = file.url;
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      audioRef.current?.pause();
      setIsPlaying(false);
    }
  }, [file]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const timeUpdate = () => {
      setProgress((audio.currentTime / audio.duration) * 100);
    };
    const ended = () => {
      setIsPlaying(false);
      onEnded();
    };

    audio.addEventListener('timeupdate', timeUpdate);
    audio.addEventListener('ended', ended);

    return () => {
      audio.removeEventListener('timeupdate', timeUpdate);
      audio.removeEventListener('ended', ended);
    };
  }, [onEnded]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  if (!file) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-sm border-t animate-in slide-in-from-bottom-5">
      <div className="container mx-auto flex items-center gap-4">
        <Button size="icon" onClick={togglePlay}>
          {isPlaying ? <PauseCircle /> : <PlayCircle />}
        </Button>
        <div className="flex-grow">
          <p className="font-semibold truncate">{file.name}</p>
          <Progress value={progress} className="h-2" />
        </div>
      </div>
      <audio ref={audioRef} />
    </div>
  );
}


export default function MusicPage() {
    const [musicFiles, setMusicFiles] = useState<MusicFile[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDeleting, startDeleteTransition] = useTransition();
    const [currentlyPlaying, setCurrentlyPlaying] = useState<MusicFile | null>(null);
    const { toast } = useToast();

    const fetchMusic = useCallback(async () => {
        setLoading(true);
        try {
            const listResult = await listAll(musicFolderRef);
            const filesData = await Promise.all(
                listResult.items.map(async (itemRef) => {
                    const metadata = await getMetadata(itemRef);
                    const url = await getDownloadURL(itemRef);
                    return {
                        name: metadata.name,
                        url,
                        path: metadata.fullPath,
                        size: metadata.size,
                        updated: metadata.updated
                    };
                })
            );
            setMusicFiles(filesData.sort((a, b) => new Date(b.updated).getTime() - new Date(a.updated).getTime()));
        } catch(e: any) {
            console.error("Error fetching music:", e);
            toast({ variant: 'destructive', title: "Fehler beim Laden", description: "Die Musikdateien konnten nicht geladen werden." });
        } finally {
            setLoading(false);
        }
    }, [toast]);
    
    useEffect(() => {
        fetchMusic();
    }, [fetchMusic]);

    const handleDeleteFile = (filePath: string, fileName: string) => {
      startDeleteTransition(async () => {
          try {
              const fileRef = ref(storage, filePath);
              await deleteObject(fileRef);
              toast({ title: 'Gelöscht', description: `Song "${fileName}" wurde gelöscht.` });
              fetchMusic();
          } catch(e: any) {
              toast({ variant: 'destructive', title: 'Fehler beim Löschen', description: e.message });
          }
      });
    };
    
    const handlePlayNext = () => {
        if (!currentlyPlaying) return;
        const currentIndex = musicFiles.findIndex(f => f.path === currentlyPlaying.path);
        if (currentIndex > -1 && currentIndex < musicFiles.length - 1) {
            setCurrentlyPlaying(musicFiles[currentIndex + 1]);
        } else {
            setCurrentlyPlaying(null); // Stop at the end of the list
        }
    }

    return (
        <div className="space-y-6 pb-24">
            <header className="flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-medium text-gray-900">Musikbibliothek</h1>
                    <p className="text-sm text-gray-500 mt-1">Verwalten und hören Sie Ihre hochgeladenen Songs.</p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={fetchMusic} disabled={loading} variant="outline" className="gcp-button">
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                        Aktualisieren
                    </Button>
                    <UploadDialog onUploadComplete={fetchMusic} />
                </div>
            </header>
            
            <div className="border rounded-lg overflow-hidden bg-white">
                 <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px]"></TableHead>
                            <TableHead>Titel</TableHead>
                            <TableHead>Größe</TableHead>
                            <TableHead>Hochgeladen am</TableHead>
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
                        ) : musicFiles.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-32 text-center text-gray-500">
                                    <Music4 className="mx-auto h-8 w-8 mb-2"/>
                                    Noch keine Songs hochgeladen.
                                </TableCell>
                            </TableRow>
                        ) : (
                            musicFiles.map(file => (
                                <TableRow key={file.path} className={currentlyPlaying?.path === file.path ? 'bg-blue-50' : ''}>
                                    <TableCell>
                                        <Button size="icon" variant="ghost" className="gcp-icon-button" onClick={() => setCurrentlyPlaying(file)}>
                                            {currentlyPlaying?.path === file.path && isPlaying ? <PauseCircle /> : <PlayCircle />}
                                        </Button>
                                    </TableCell>
                                    <TableCell className="font-medium truncate max-w-sm">
                                        {file.name}
                                    </TableCell>
                                    <TableCell>{formatBytes(file.size)}</TableCell>
                                    <TableCell>{format(new Date(file.updated), "dd.MM.yyyy HH:mm", { locale: de })}</TableCell>
                                    <TableCell className="text-right">
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button size="icon" variant="ghost" className="gcp-icon-button text-red-500 hover:text-red-700" title="Song löschen">
                                                    <Trash2 className="h-4 w-4"/>
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Sind Sie sicher?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Der Song "{file.name}" wird dauerhaft gelöscht. Diese Aktion kann nicht rückgängig gemacht werden.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDeleteFile(file.path, file.name)} disabled={isDeleting}>
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
            <MusicPlayer file={currentlyPlaying} onEnded={handlePlayNext} />
        </div>
    );
}

