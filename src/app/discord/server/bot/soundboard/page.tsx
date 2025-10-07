
"use client";

import { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, query, orderBy } from "firebase/firestore";
import { app } from "@/app/firebase";
import { Plus, Hash, Volume2, Bot, Trash2, UploadCloud, File, PlayCircle, Loader2, Music4 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
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
import Image from 'next/image';

const storage = getStorage(app);
const db = getFirestore(app);

interface Sound {
  id: string;
  name: string;
  emoji: string;
  url: string;
  path: string;
  createdAt: Date;
}

function ServerIcon({ src, name }: { src: string, name: string }) {
  return (
    <div className="group relative mx-auto mb-2">
      <div className="w-12 h-12 rounded-full bg-neutral-700 group-hover:rounded-2xl transition-all duration-200 overflow-hidden flex items-center justify-center">
        <Image src={src} alt={name} width={48} height={48} className="object-cover" />
      </div>
      <div className="absolute left-full top-1/2 -translate-y-1/2 ml-4 w-max px-2 py-1 bg-black text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        {name}
      </div>
    </div>
  );
}

function UploadDialog({ onUploadComplete }: { onUploadComplete: () => void }) {
  const [filesToUpload, setFilesToUpload] = useState<File[]>([]);
  const [emoji, setEmoji] = useState('🔊');
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFilesToUpload(prev => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'audio/*': [] }
  });
  
  const handleUpload = async () => {
    if (filesToUpload.length === 0) {
        toast({ variant: 'destructive', title: "Keine Dateien ausgewählt."});
        return;
    }
    
    setIsUploading(true);
    setUploadProgress({});

    for (const file of filesToUpload) {
        const soundName = file.name.replace(/\.[^/.]+$/, "");
        const filePath = `soundboard/${Date.now()}-${file.name}`;
        const storageRef = ref(storage, filePath);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setUploadProgress(prev => ({...prev, [file.name]: progress}));
            },
            (error) => {
                console.error("Upload Error:", error);
                toast({ variant: "destructive", title: `Fehler beim Upload von ${file.name}`, description: error.message });
                setIsUploading(false);
            },
            async () => {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                await addDoc(collection(db, "soundboard"), {
                    name: soundName,
                    emoji: emoji,
                    url: downloadURL,
                    path: filePath,
                    createdAt: new Date(),
                });
                toast({ title: "Upload erfolgreich", description: `${file.name} wurde zum Soundboard hinzugefügt.`});
                if (filesToUpload.indexOf(file) === filesToUpload.length - 1) {
                    setIsUploading(false);
                    onUploadComplete();
                    setFilesToUpload([]);
                }
            }
        );
    }
  };

  return (
    <Dialog onOpenChange={(open) => !open && setFilesToUpload([])}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full bg-neutral-700 border-neutral-600 hover:bg-neutral-600">
          <UploadCloud className="mr-2 h-4 w-4" /> Sound hochladen
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-neutral-800 border-neutral-700 text-white">
        <DialogHeader>
          <DialogTitle>Neuen Sound hinzufügen</DialogTitle>
          <DialogDescription>
            Lade eine oder mehrere Audiodateien hoch, um sie zum Soundboard hinzuzufügen.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
            <div {...getRootProps()} className={`p-10 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${isDragActive ? 'border-indigo-500 bg-indigo-500/10' : 'border-neutral-600 bg-neutral-900 hover:bg-neutral-700'}`}>
                <input {...getInputProps()} />
                 <div className="flex flex-col items-center gap-2 text-neutral-400">
                    <UploadCloud className="h-10 w-10"/>
                    <p className="font-semibold">Dateien per Drag & Drop hierher ziehen oder klicken</p>
                    <p className="text-xs">Audioformate wie MP3, WAV oder OGG werden empfohlen.</p>
                </div>
            </div>
            
            {filesToUpload.length > 0 && (
                <div className="space-y-2">
                    <h4 className="font-semibold">Ausgewählte Dateien:</h4>
                    <div className="space-y-3 max-h-40 overflow-y-auto pr-2">
                        {filesToUpload.map((file, i) => (
                            <div key={i} className="flex items-center gap-3 p-2 bg-neutral-700/50 rounded-md">
                                <File className="h-5 w-5 text-neutral-400" />
                                <div className="flex-grow">
                                    <p className="text-sm font-medium truncate">{file.name}</p>
                                    {uploadProgress[file.name] !== undefined && <Progress value={uploadProgress[file.name]} className="h-1 mt-1" />}
                                </div>
                                <Button variant="ghost" size="icon" className="h-6 w-6 text-neutral-400 hover:text-red-500" onClick={() => setFilesToUpload(files => files.filter(f => f.name !== file.name))}>
                                    <Trash2 className="h-4 w-4"/>
                                </Button>
                            </div>
                        ))}
                    </div>
                     <div>
                        <label htmlFor="emoji" className="text-sm font-medium">Standard-Emoji für Uploads</label>
                        <Input id="emoji" value={emoji} onChange={(e) => setEmoji(e.target.value)} maxLength={2} className="mt-1 bg-neutral-900 border-neutral-700 w-20 text-center" />
                    </div>
                </div>
            )}
        </div>
        <Button onClick={handleUpload} disabled={isUploading} className="w-full bg-indigo-600 hover:bg-indigo-700">
            {isUploading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Lade hoch...</> : "Hochladen"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}

function SoundButton({ sound, onDelete }: { sound: Sound, onDelete: (sound: Sound) => void }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = React.useRef<HTMLAudioElement | null>(null);

    const playSound = () => {
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play();
            setIsPlaying(true);
        }
    };
    
    useEffect(() => {
        audioRef.current = new Audio(sound.url);
        const handleEnd = () => setIsPlaying(false);
        audioRef.current.addEventListener('ended', handleEnd);
        return () => {
            audioRef.current?.removeEventListener('ended', handleEnd);
        }
    }, [sound.url])

    return (
        <AlertDialog>
            <div className="group relative aspect-square flex flex-col items-center justify-center bg-neutral-700 rounded-lg cursor-pointer hover:bg-neutral-600 transition-colors p-2 text-center" onClick={playSound}>
                <span className="text-4xl transition-transform group-hover:scale-110">{sound.emoji}</span>
                <p className="text-xs font-semibold mt-2 break-all">{sound.name}</p>
                {isPlaying && (
                    <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                        <Volume2 className="h-8 w-8 text-white animate-pulse" />
                    </div>
                )}
                 <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="icon" className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 className="h-3 w-3" />
                    </Button>
                </AlertDialogTrigger>
            </div>
            <AlertDialogContent className="bg-neutral-800 text-white border-neutral-700">
                <AlertDialogHeader>
                    <AlertDialogTitle>Sound "{sound.name}" wirklich löschen?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Diese Aktion kann nicht rückgängig gemacht werden. Die Audiodatei wird dauerhaft aus dem Speicher gelöscht.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="bg-transparent text-white hover:bg-neutral-700">Abbrechen</AlertDialogCancel>
                    <AlertDialogAction onClick={() => onDelete(sound)} className="bg-red-600 hover:bg-red-700">Löschen</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export default function DiscordSoundboardPage() {
  const [sounds, setSounds] = useState<Sound[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchSounds = useCallback(async () => {
    setIsLoading(true);
    try {
        const q = query(collection(db, "soundboard"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const soundsData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: (doc.data().createdAt as any).toDate()
        } as Sound));
        setSounds(soundsData);
    } catch (e) {
        console.error("Error fetching sounds: ", e);
        toast({ variant: "destructive", title: "Fehler", description: "Sounds konnten nicht geladen werden." });
    } finally {
        setIsLoading(false);
    }
  }, [toast]);
  
  useEffect(() => {
    fetchSounds();
  }, [fetchSounds]);

  const handleDeleteSound = async (soundToDelete: Sound) => {
    try {
        // Delete from Firestore
        await deleteDoc(doc(db, "soundboard", soundToDelete.id));

        // Delete from Storage
        const soundRef = ref(storage, soundToDelete.path);
        await deleteObject(soundRef);

        toast({ title: "Erfolgreich gelöscht", description: `"${soundToDelete.name}" wurde entfernt.` });
        fetchSounds(); // Refresh list
    } catch (error: any) {
        console.error("Error deleting sound: ", error);
        toast({ variant: "destructive", title: "Fehler beim Löschen", description: error.message });
    }
  };

  return (
    <div className="flex h-screen w-full bg-neutral-800 text-neutral-200 font-sans">
      {/* Server List */}
      <div className="w-18 bg-neutral-900 p-2 flex flex-col items-center space-y-2">
        <ServerIcon src="https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/p_und_r-logo.png?alt=media&token=e1b7c172-fa61-47f4-a4e4-f92fe0ffa522" name="Paulik & Reisch" />
        <div className="w-8 h-px bg-neutral-700"></div>
        <div className="group relative mx-auto">
            <div className="w-12 h-12 rounded-full bg-neutral-700 group-hover:rounded-2xl group-hover:bg-green-600 transition-all duration-200 flex items-center justify-center cursor-pointer">
                <Plus className="h-6 w-6 text-green-400 group-hover:text-white" />
            </div>
        </div>
      </div>

      {/* Channel List */}
      <div className="w-60 bg-neutral-800 flex flex-col p-2">
        <div className="p-2 mb-2">
            <h1 className="font-bold text-lg">Paulik & Reisch</h1>
        </div>
        <div className="flex-grow space-y-1">
            <div className="px-2 py-1 text-neutral-400 text-xs font-bold uppercase">Textkanäle</div>
            <div className="flex items-center p-2 rounded-md text-neutral-400 hover:bg-neutral-700/50 cursor-pointer"><Hash className="mr-2 h-5 w-5"/> allgemein</div>
            <div className="flex items-center p-2 rounded-md text-neutral-400 hover:bg-neutral-700/50 cursor-pointer"><Hash className="mr-2 h-5 w-5"/> buch-ideen</div>
            
            <div className="px-2 py-1 text-neutral-400 text-xs font-bold uppercase mt-4">Sprachkanäle</div>
            <div className="flex items-center p-2 rounded-md text-neutral-400 hover:bg-neutral-700/50 cursor-pointer"><Volume2 className="mr-2 h-5 w-5"/> Plauderecke</div>
            <div className="flex items-center p-2 rounded-md text-white bg-neutral-700 cursor-pointer"><Bot className="mr-2 h-5 w-5"/> Bot-Steuerung</div>
        </div>
         <div className="p-2 bg-neutral-900/50 rounded-md flex items-center gap-2">
            <Image src="https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/p_und_r-logo.png?alt=media&token=e1b7c172-fa61-47f4-a4e4-f92fe0ffa522" alt="User Avatar" width={32} height={32} className="rounded-full" />
            <div>
                <div className="font-semibold text-sm">Admin</div>
                <div className="text-xs text-neutral-400">Online</div>
            </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-neutral-700 flex flex-col">
        <header className="flex-shrink-0 h-12 border-b border-neutral-800 shadow-md flex items-center px-4 justify-between">
            <div className="flex items-center">
                <Music4 className="h-6 w-6 text-neutral-400 mr-2"/>
                <h2 className="font-bold text-lg">Soundboard</h2>
            </div>
            <Badge>Bot ist verbunden</Badge>
        </header>

        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4">
                <div className="aspect-square flex flex-col items-center justify-center bg-neutral-800/50 rounded-lg border-2 border-dashed border-neutral-600 hover:border-indigo-500 hover:bg-neutral-600/50 transition-colors">
                     <UploadDialog onUploadComplete={fetchSounds} />
                </div>
                {isLoading ? (
                    Array.from({length: 10}).map((_, i) => (
                        <div key={i} className="aspect-square bg-neutral-700 rounded-lg animate-pulse"></div>
                    ))
                ) : (
                    sounds.map(sound => (
                        <SoundButton key={sound.id} sound={sound} onDelete={handleDeleteSound} />
                    ))
                )}
            </div>
        </main>
      </div>
    </div>
  );
}

    