'use client';

import { useState, useActionState, useEffect, useMemo, useRef } from "react";
import { useFormStatus } from "react-dom";
import { Palabrota } from "@/lib/firestore";
import { savePalabrotaAction, deletePalabrotaAction, bulkAddPalabrotasAction, PalabrotaState } from "./actions";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Flame, Loader2, PlusCircle, Trash2, Edit, FileUp } from "lucide-react";
import { cn } from "@/lib/utils";

const initialState: PalabrotaState = { success: false, error: null, message: undefined };

function PfeiferFaktor({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Flame
          key={i}
          className={cn(
            'h-4 w-4',
            i < rating ? 'text-red-500 fill-current' : 'text-gray-300'
          )}
        />
      ))}
    </div>
  );
}

function SaveButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Speichern
        </Button>
    )
}

function PalabrotaForm({ palabrota, onFormSubmit }: { palabrota?: Palabrota | null, onFormSubmit: () => void }) {
    const [state, formAction] = useActionState(savePalabrotaAction, initialState);
    const { toast } = useToast();
    const [pfeiferFaktor, setPfeiferFaktor] = useState(palabrota?.pfeiferFaktor || 3);

    useEffect(() => {
        if(state.success) {
            toast({ title: "Erfolg!", description: state.message });
            onFormSubmit();
        }
        if(state.error) {
            toast({ variant: "destructive", title: "Fehler", description: state.error });
        }
    }, [state, toast, onFormSubmit]);

    return (
        <form action={formAction} className="space-y-4">
            {palabrota?.id && <input type="hidden" name="id" value={palabrota.id} />}
             <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <Label htmlFor="de">Deutsch</Label>
                    <Input id="de" name="de" defaultValue={palabrota?.de} required />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="es">Spanisch</Label>
                    <Input id="es" name="es" defaultValue={palabrota?.es} required />
                </div>
            </div>
             <div className="space-y-2">
                <Label htmlFor="wortart">Wortart</Label>
                <Input id="wortart" name="wortart" defaultValue={palabrota?.wortart} required />
            </div>
             <div className="space-y-2">
                <Label htmlFor="anwendung">Anwendung</Label>
                <Textarea id="anwendung" name="anwendung" defaultValue={palabrota?.anwendung} required />
            </div>
             <div className="space-y-2">
                <Label htmlFor="synonyme">Synonyme</Label>
                <Input id="synonyme" name="synonyme" defaultValue={palabrota?.synonyme} required />
            </div>
             <div className="space-y-2">
                <Label htmlFor="beispiel">Beispiel</Label>
                <Textarea id="beispiel" name="beispiel" defaultValue={palabrota?.beispiel} required />
            </div>
             <div className="space-y-2">
                <Label htmlFor="pfeiferFaktor">Pfeifer-Faktor™ ({pfeiferFaktor})</Label>
                <Slider 
                    name="pfeiferFaktor" 
                    defaultValue={[pfeiferFaktor]} 
                    max={5} 
                    step={1} 
                    onValueChange={(value) => setPfeiferFaktor(value[0])}
                />
            </div>
             <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="outline">Abbrechen</Button>
                </DialogClose>
                <SaveButton />
            </DialogFooter>
        </form>
    );
}

function BulkImportForm({ onFormSubmit }: { onFormSubmit: () => void }) {
    const [state, formAction] = useActionState(bulkAddPalabrotasAction, initialState);
    const { toast } = useToast();
    
    useEffect(() => {
        if (state.success) {
            toast({ title: "Erfolg!", description: state.message });
            onFormSubmit();
        }
        if (state.error) {
            toast({ variant: "destructive", title: "Fehler", description: state.error });
        }
    }, [state, toast, onFormSubmit]);

    return (
        <form action={formAction} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="wordList">Wortliste</Label>
                <Textarea 
                    id="wordList" 
                    name="wordList" 
                    rows={10} 
                    placeholder="Dummkopf gilipollas; Scheiße mierda; Verdammt joder"
                />
                <p className="text-xs text-muted-foreground">
                    Format: Deutsches Wort, dann das spanische Wort, getrennt durch Leerzeichen. Mehrere Einträge mit einem Semikolon (;) trennen.
                </p>
            </div>
            <DialogFooter>
                <DialogClose asChild><Button type="button" variant="outline">Abbrechen</Button></DialogClose>
                <SaveButton />
            </DialogFooter>
        </form>
    )
}

export function PalabrotasClient({ initialData }: { initialData: Palabrota[] }) {
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [openBulkDialog, setOpenBulkDialog] = useState(false);
    const [currentPalabrota, setCurrentPalabrota] = useState<Palabrota | null>(null);

    const handleFormSubmit = () => {
        setOpenAddDialog(false);
        setOpenBulkDialog(false);
        setCurrentPalabrota(null);
    }
    
    return (
        <>
        <div className="flex justify-end gap-2">
            <Dialog open={openBulkDialog} onOpenChange={setOpenBulkDialog}>
                <DialogTrigger asChild>
                    <Button variant="outline"><FileUp className="mr-2 h-4 w-4" /> Massen-Import</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Massen-Import von Wörtern</DialogTitle>
                    </DialogHeader>
                    <BulkImportForm onFormSubmit={handleFormSubmit} />
                </DialogContent>
            </Dialog>
            <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
                <DialogTrigger asChild>
                    <Button onClick={() => setCurrentPalabrota(null)}><PlusCircle className="mr-2 h-4 w-4" /> Neues Wort</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[625px]">
                    <DialogHeader>
                        <DialogTitle>Neues Wort hinzufügen</DialogTitle>
                    </DialogHeader>
                    <PalabrotaForm onFormSubmit={handleFormSubmit} />
                </DialogContent>
            </Dialog>
        </div>

        <div className="border rounded-lg bg-background mt-4">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Deutsch</TableHead>
                        <TableHead>Spanisch</TableHead>
                        <TableHead>Wortart</TableHead>
                        <TableHead>Pfeifer-Faktor™</TableHead>
                        <TableHead className="text-right">Aktionen</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {initialData.map((palabrota) => (
                        <TableRow key={palabrota.id}>
                            <TableCell className="font-medium">{palabrota.de}</TableCell>
                            <TableCell className="italic">{palabrota.es}</TableCell>
                            <TableCell><span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">{palabrota.wortart}</span></TableCell>
                            <TableCell><PfeiferFaktor rating={palabrota.pfeiferFaktor} /></TableCell>
                            <TableCell className="text-right">
                                <Dialog onOpenChange={(open) => !open && setCurrentPalabrota(null)}>
                                     <DialogTrigger asChild>
                                        <Button variant="ghost" size="icon" onClick={() => setCurrentPalabrota(palabrota)}>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                    </DialogTrigger>
                                     <DialogContent className="sm:max-w-[625px]">
                                        <DialogHeader>
                                            <DialogTitle>Wort bearbeiten</DialogTitle>
                                        </DialogHeader>
                                        {currentPalabrota?.id === palabrota.id && <PalabrotaForm palabrota={currentPalabrota} onFormSubmit={handleFormSubmit} />}
                                    </DialogContent>
                                </Dialog>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <form action={deletePalabrotaAction}>
                                            <input type="hidden" name="id" value={palabrota.id} />
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Sind Sie absolut sicher?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Möchten Sie das Wort "{palabrota.de}" wirklich endgültig löschen? Diese Aktion kann nicht rückgängig gemacht werden.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                                                <AlertDialogAction type="submit" variant="destructive">Löschen</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </form>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
        </>
    );
}
