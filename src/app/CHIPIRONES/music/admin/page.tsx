"use client";

import { useState, useEffect, useMemo } from 'react';
import { useCollection, useMemoFirebase } from '@/firebase';
import { useFirestore } from '@/firebase/provider';
import { collection, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ImageWithLoader as Image } from '@/components/ui/image-with-loader';
import { PlusCircle, Edit, Trash2, Loader2, Music4 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { initiateAnonymousSignIn } from '@/firebase/non-blocking-login';
import { useAuth, useUser } from '@/firebase';

interface Track {
    id: string;
    title: string;
    artist: string;
    duration: string;
    imageUrl: string;
}

function TrackForm({ track, onSave, closeDialog }: { track?: Track, onSave: (trackData: Omit<Track, 'id'>) => void, closeDialog: () => void }) {
    const [title, setTitle] = useState(track?.title || '');
    const [artist, setArtist] = useState(track?.artist || '');
    const [duration, setDuration] = useState(track?.duration || '');
    const [imageUrl, setImageUrl] = useState(track?.imageUrl || '');
    const [isSaving, setIsSaving] = useState(false);

    const handleSubmit = async () => {
        setIsSaving(true);
        await onSave({ title, artist, duration, imageUrl });
        setIsSaving(false);
        closeDialog();
    };

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="title">Titel</Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="artist">Künstler</Label>
                <Input id="artist" value={artist} onChange={(e) => setArtist(e.target.value)} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="duration">Dauer (z.B. 3:45)</Label>
                <Input id="duration" value={duration} onChange={(e) => setDuration(e.target.value)} />
            </div>
             <div className="space-y-2">
                <Label htmlFor="imageUrl">Bild-URL</Label>
                <Input id="imageUrl" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button variant="outline">Abbrechen</Button>
                </DialogClose>
                <Button onClick={handleSubmit} disabled={isSaving}>
                    {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Speichern
                </Button>
            </DialogFooter>
        </div>
    );
}

export default function MusicAdminPage() {
    const firestore = useFirestore();
    const auth = useAuth();
    const { user, isUserLoading } = useUser();
    const { toast } = useToast();
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const tracksCollection = useMemoFirebase(() => collection(firestore, '/CHIPIRONES/music/tracks'), [firestore]);
    const { data: tracks, isLoading } = useCollection<Track>(tracksCollection);

    useEffect(() => {
        if (!isUserLoading && !user) {
            initiateAnonymousSignIn(auth);
        }
    }, [isUserLoading, user, auth]);

    const handleSaveTrack = async (trackData: Omit<Track, 'id'>, id?: string) => {
        const trackId = id || doc(tracksCollection).id;
        const docRef = doc(tracksCollection, trackId);
        try {
            await setDoc(docRef, trackData, { merge: true });
            toast({ title: 'Erfolg', description: `Track "${trackData.title}" wurde erfolgreich gespeichert.` });
        } catch (error) {
            console.error("Error saving track:", error);
            toast({ variant: 'destructive', title: 'Fehler', description: 'Track konnte nicht gespeichert werden.' });
        }
    };
    
    const handleDeleteTrack = async (track: Track) => {
        try {
            await deleteDoc(doc(tracksCollection, track.id));
            toast({ title: 'Gelöscht', description: `Track "${track.title}" wurde entfernt.` });
        } catch (error) {
            console.error("Error deleting track:", error);
            toast({ variant: 'destructive', title: 'Fehler', description: 'Track konnte nicht gelöscht werden.' });
        }
    };

    if (isUserLoading || isLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-neutral-900 text-white">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-neutral-900 text-neutral-100 p-4 sm:p-6 md:p-8">
            <Card className="max-w-5xl mx-auto bg-neutral-800 border-neutral-700">
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                             <CardTitle className="font-headline text-2xl flex items-center gap-2"><Music4/>Chipirones Musik-Verwaltung</CardTitle>
                             <CardDescription className="text-neutral-400">Tracks hinzufügen, bearbeiten oder löschen.</CardDescription>
                        </div>
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                             <DialogTrigger asChild>
                                 <Button>
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Neuer Track
                                </Button>
                             </DialogTrigger>
                             <DialogContent className="bg-neutral-800 border-neutral-700 text-white">
                                <DialogHeader>
                                    <DialogTitle>Neuen Track hinzufügen</DialogTitle>
                                </DialogHeader>
                                 <TrackForm onSave={(trackData) => handleSaveTrack(trackData)} closeDialog={() => setIsDialogOpen(false)} />
                             </DialogContent>
                        </Dialog>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow className="border-neutral-700 hover:bg-neutral-700/50">
                                <TableHead className="w-[80px]">Cover</TableHead>
                                <TableHead>Titel</TableHead>
                                <TableHead>Künstler</TableHead>
                                <TableHead>Dauer</TableHead>
                                <TableHead className="text-right">Aktionen</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tracks && tracks.map(track => (
                                <TableRow key={track.id} className="border-neutral-700/50 hover:bg-neutral-700/50">
                                    <TableCell>
                                        <Image src={track.imageUrl} alt={track.title} width={40} height={40} className="rounded-md object-cover" />
                                    </TableCell>
                                    <TableCell className="font-medium">{track.title}</TableCell>
                                    <TableCell className="text-neutral-400">{track.artist}</TableCell>
                                    <TableCell className="text-neutral-400">{track.duration}</TableCell>
                                    <TableCell className="text-right space-x-2">
                                         <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                                            </DialogTrigger>
                                             <DialogContent className="bg-neutral-800 border-neutral-700 text-white">
                                                <DialogHeader>
                                                    <DialogTitle>Track bearbeiten</DialogTitle>
                                                </DialogHeader>
                                                <TrackForm track={track} onSave={(trackData) => handleSaveTrack(trackData, track.id)} closeDialog={() => { /* closes automatically */ }} />
                                            </DialogContent>
                                        </Dialog>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive/80"><Trash2 className="h-4 w-4" /></Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent className="bg-neutral-800 border-neutral-700 text-white">
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Sind Sie sicher?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Möchten Sie den Track "{track.title}" wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDeleteTrack(track)} className="bg-destructive hover:bg-destructive/80">Löschen</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
