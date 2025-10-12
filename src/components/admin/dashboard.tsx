

"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useActionState } from "react";
import { 
    Newsletter,
    LegalPage,
    Palabrota,
    Excerpt,
    getNewsletters,
    getLegalPages,
    getPalabrotas,
    getExcerpts
} from "@/lib/firestore";
import {
    addNewsletterAction,
    deleteNewsletterAction,
    duplicateNewsletterAction,
    addPalabrotaAction,
    updatePalabrotaAction,
    deletePalabrotaAction,
    bulkAddPalabrotasAction,
    updateExcerptAction
} from "@/app/admin/actions";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, RefreshCw, VenetianMask, FileText, PlusCircle, Trash2, Edit, FilePlus, Mail, Copy, Users, Tag, Send, Book, LayoutDashboard, ArrowRight, Newspaper, Search, FilterX, CopyPlus, History, Flame, Upload, MessageSquareQuote, ToggleLeft, ToggleRight, BookOpen, ArrowUpRight, DatabaseZap, Sparkles, CheckCircle, ShieldAlert, AlertTriangle, Radio } from "lucide-react";
import { Badge } from "../ui/badge";
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
  DialogDescription,
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { cn } from "@/lib/utils";
import { Switch } from "../ui/switch";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

function EmailMarketingManager({ initialNewsletters }: { initialNewsletters: Newsletter[] }) {
    const [selectedNewsletterId, setSelectedNewsletterId] = useState<string>('');
    
    const selectedNewsletter = useMemo(() => {
        return initialNewsletters.find(nl => nl.id === selectedNewsletterId);
    }, [selectedNewsletterId, initialNewsletters]);

    return (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <div className="space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline text-2xl font-bold">Abonnenten & Versand</CardTitle>
                        <CardDescription>Die Verwaltung Ihrer Kontakte und der Versand von Kampagnen finden jetzt direkt in Ihrem Resend-Konto statt.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                         <a href="https://resend.com/audiences" target="_blank" rel="noopener noreferrer" className="w-full">
                            <Button variant="outline" className="w-full">
                                <Users className="mr-2 h-4 w-4" /> Abonnenten in Resend verwalten <ArrowUpRight className="ml-2 h-4 w-4" />
                            </Button>
                        </a>
                         <a href="https://resend.com/emails" target="_blank" rel="noopener noreferrer" className="w-full">
                            <Button variant="outline" className="w-full">
                                <Send className="mr-2 h-4 w-4" /> Neue Kampagne in Resend starten <ArrowUpRight className="ml-2 h-4 w-4" />
                            </Button>
                        </a>
                    </CardContent>
                </Card>
            </div>
            
            <div className="space-y-4">
                <Card className="h-full flex flex-col">
                    <CardHeader>
                        <CardTitle className="font-headline text-2xl font-bold">E-Mail Vorschau & Kompatibilitäts-Check</CardTitle>
                         <Select onValueChange={setSelectedNewsletterId} value={selectedNewsletterId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Wählen Sie einen Newsletter zur Analyse..." />
                            </SelectTrigger>
                            <SelectContent>
                                {initialNewsletters.map(nl => (
                                    <SelectItem key={nl.id} value={nl.id}>{nl.name} - ({nl.subject})</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </CardHeader>
                    <CardContent className="flex-grow flex flex-col p-2 pt-0">
                        <div className="p-4 border rounded-lg bg-background flex-grow flex flex-col">
                            <EmailChecker htmlContent={selectedNewsletter?.content} />
                            <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-b-md flex-grow overflow-auto min-h-[400px]">
                                <iframe
                                    srcDoc={selectedNewsletter?.content || ''}
                                    title="E-Mail Vorschau"
                                    className="w-full h-full border bg-white"
                                    sandbox="" // for security
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function LegalPagesManager({ initialLegalPages }: { initialLegalPages: LegalPage[] }) {
    return (
        <div>
            <div className="border rounded-lg overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Titel</TableHead>
                            <TableHead>Slug</TableHead>
                            <TableHead>Zuletzt aktualisiert</TableHead>
                            <TableHead className="text-right">Aktionen</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {initialLegalPages.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-12 text-muted-foreground">
                                    <FileText className="mx-auto h-8 w-8 mb-2" />
                                    Keine Seiten gefunden.
                                </TableCell>
                            </TableRow>
                        ) : (
                            initialLegalPages.map((page) => (
                                <TableRow key={page.id}>
                                    <TableCell className="font-medium">{page.title}</TableCell>
                                    <TableCell className="text-muted-foreground">/{page.id}</TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {format(new Date(page.lastUpdated), "dd.MM.yyyy HH:mm", { locale: de })}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex gap-2 justify-end">
                                            <Link href={`/admin/editor/${page.id}`}>
                                                <Button size="sm" variant="outline">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

type AdminNewsletterState = {
  success: boolean;
  error?: string | null;
  message?: string;
  newNewsletterId?: string;
};

const initialNewsletterState: AdminNewsletterState = { success: false };

export function NewsletterManager({ initialNewsletters, onTabChange }: { initialNewsletters: Newsletter[], onTabChange: (value: string) => void; }) {
    const router = useRouter();
    const [newsletters, setNewsletters] = useState(initialNewsletters);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const { toast } = useToast();

    const [addState, addFormAction] = useActionState(addNewsletterAction, initialNewsletterState);
    const [deleteState, deleteFormAction] = useActionState(deleteNewsletterAction, initialNewsletterState);
    const [duplicateState, duplicateFormAction] = useActionState(duplicateNewsletterAction, initialNewsletterState);
    
    useEffect(() => {
        setNewsletters(initialNewsletters);
    }, [initialNewsletters]);
    
    useEffect(() => {
        if (addState.success) {
            toast({ title: "Erfolg", description: addState.message });
            setIsAddDialogOpen(false);
            if (addState.newNewsletterId) {
                router.push(`/admin/nle/${addState.newNewsletterId}`);
            }
        }
        if (addState.error) {
            toast({ variant: "destructive", title: "Fehler", description: addState.error });
        }
    }, [addState, toast, router]);

    useEffect(() => {
        if (deleteState.success) {
            toast({ title: "Erfolg", description: deleteState.message });
        }
        if (deleteState.error) {
            toast({ variant: "destructive", title: "Fehler", description: deleteState.error });
        }
    }, [deleteState, toast]);

     useEffect(() => {
        if (duplicateState.success) {
            toast({ title: "Erfolg", description: duplicateState.message });
        }
        if (duplicateState.error) {
            toast({ variant: "destructive", title: "Fehler", description: duplicateState.error });
        }
    }, [duplicateState, toast]);

    const handleCopyLink = (newsletterId: string) => {
        const previewUrl = `${window.location.origin}/nl/preview/${newsletterId}`;
        navigator.clipboard.writeText(previewUrl);
        toast({
            title: "Kopiert!",
            description: "Der Vorschau-Link wurde in die Zwischenablage kopiert.",
        });
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                 <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline"><PlusCircle className="mr-2 h-4 w-4" /> Neuer Newsletter</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <form action={addFormAction}>
                            <DialogHeader>
                                <DialogTitle>Neuen Newsletter erstellen</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <Input name="name" placeholder="Interner Name (z.B. 'Launch-Kampagne Woche 1')" required />
                                <Input name="subject" placeholder="Betreff der E-Mail" required />
                            </div>
                            <DialogFooter>
                                <DialogClose asChild><Button type="button" variant="secondary">Abbrechen</Button></DialogClose>
                                <Button type="submit">Erstellen & Bearbeiten</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
             <div className="border rounded-lg overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Betreff</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Zuletzt aktualisiert</TableHead>
                            <TableHead className="text-right">Aktionen</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {newsletters.length === 0 ? (
                             <TableRow>
                                <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                                    <Mail className="mx-auto h-8 w-8 mb-2" />
                                    Keine Newsletter gefunden.
                                </TableCell>
                            </TableRow>
                        ) : (
                            newsletters.map((newsletter) => (
                                <TableRow key={newsletter.id}>
                                    <TableCell className="font-medium">{newsletter.name}</TableCell>
                                    <TableCell className="text-muted-foreground">{newsletter.subject}</TableCell>
                                    <TableCell>
                                        <Badge variant={newsletter.isLive ? "default" : "secondary"} className={cn(newsletter.isLive && "bg-green-500 text-primary-foreground animate-pulse")}>
                                            {newsletter.isLive ? "Live" : "Entwurf"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {newsletter.lastUpdated ? format(new Date(newsletter.lastUpdated), "dd.MM.yyyy HH:mm", { locale: de }) : 'N/A'}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex gap-2 justify-end">
                                             <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button size="sm" variant="ghost" title="Diesen Newsletter als Vorlage verwenden und duplizieren" disabled={newsletter.isLive}>
                                                        <CopyPlus className="h-4 w-4" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                     <form action={duplicateFormAction}>
                                                        <input type="hidden" name="id" value={newsletter.id} />
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Newsletter duplizieren?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                              Möchten Sie wirklich eine Kopie von "{newsletter.name}" erstellen? Dies ist nützlich, um eine Vorlage zu erstellen.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                                                            <AlertDialogAction type="submit">Ja, duplizieren</AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </form>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                            <Button size="sm" variant="ghost" title="Vorschau-Link kopieren" onClick={() => handleCopyLink(newsletter.id)}>
                                                <Copy className="h-4 w-4" />
                                            </Button>
                                            <Link href={`/admin/nle/${newsletter.id}`} title="Newsletter bearbeiten">
                                                <Button size="sm" variant="outline" disabled={newsletter.isLive}>
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button size="sm" variant="destructive" title="Newsletter löschen" disabled={newsletter.isLive}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Sind Sie sicher?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                          Diese Aktion kann nicht rückgängig gemacht werden. Der Newsletter wird dauerhaft gelöscht.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                                                        <form action={deleteFormAction}>
                                                            <input type="hidden" name="id" value={newsletter.id} />
                                                            <AlertDialogAction type="submit">Löschen</AlertDialogAction>
                                                        </form>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
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

interface AnalysisResult {
    level: 'error' | 'warning' | 'info';
    message: string;
    details: string;
}

function EmailChecker({ htmlContent }: { htmlContent: string | undefined }) {
    const analysis = useMemo((): AnalysisResult[] => {
        if (typeof window === 'undefined' || !htmlContent) {
            return [];
        }

        const results: AnalysisResult[] = [];
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, 'text/html');

        // Check for style blocks in head
        if (doc.head.querySelectorAll('style').length > 0) {
            results.push({ level: 'error', message: 'CSS im <head> gefunden', details: 'Outlook (Windows) ignoriert CSS-Blöcke im <head>. Verwenden Sie Inline-Styles.' });
        }
        
        // Check for !important
        if (htmlContent.includes('!important')) {
             results.push({ level: 'error', message: '!important-Regeln erkannt', details: 'Outlook ignoriert `!important`. Definieren Sie Styles spezifischer, um sie durchzusetzen.' });
        }

        // Check for divs as main layout elements
        const bodyChildren = Array.from(doc.body.children);
        if (bodyChildren.some(el => el.tagName === 'DIV') && !bodyChildren.some(el => el.tagName === 'TABLE')) {
            results.push({ level: 'warning', message: 'Div-basiertes Layout', details: 'Layouts, die auf <div> basieren, können in Outlook brechen. Ein tabellenbasiertes Layout ist robuster.' });
        }

        // Check for missing alt tags on images
        doc.querySelectorAll('img').forEach(img => {
            if (!img.alt.trim()) {
                results.push({ level: 'warning', message: 'Fehlender alt-Text bei Bild', details: 'Bilder sollten immer einen Alternativtext haben, falls sie nicht geladen werden.' });
            }
        });
        
        // Check for missing width/height on images
        doc.querySelectorAll('img').forEach(img => {
            if (!img.getAttribute('width')) {
                results.push({ level: 'warning', message: 'Fehlendes width-Attribut bei Bild', details: 'Outlook ignoriert oft CSS-Größen. Fügen Sie HTML-Attribute für `width` hinzu.'});
            }
        });


        // Check for cellpadding/cellspacing
        if (doc.querySelectorAll('table:not([cellpadding="0"])').length > 0 || doc.querySelectorAll('table:not([cellspacing="0"])').length > 0) {
             results.push({ level: 'info', message: 'cellpadding/cellspacing fehlt', details: 'Setzen Sie `cellpadding="0"`, `cellspacing="0"` und `border="0"` bei Layout-Tabellen, um unerwartete Abstände zu vermeiden.' });
        }
        
         // Check for DOCTYPE
        if (!htmlContent.toLowerCase().includes('<!doctype')) {
            results.push({ level: 'info', message: 'Kein DOCTYPE gefunden', details: 'Ein DOCTYPE (z.B. <!DOCTYPE html>) stellt sicher, dass Clients die E-Mail im Standard-Modus rendern.' });
        }


        return results;
    }, [htmlContent]);
    
    const errors = analysis.filter(r => r.level === 'error');
    const warnings = analysis.filter(r => r.level === 'warning');
    const infos = analysis.filter(r => r.level === 'info');

    const getSummary = () => {
        if (!htmlContent) return { title: 'Wählen Sie einen Newsletter', description: 'Wählen Sie oben einen Newsletter aus, um ihn zu analysieren.', variant: 'default', icon: CheckCircle };
        if (errors.length > 0) return { title: `Analyse: ${errors.length} kritische(r) Fehler`, description: 'Diese Probleme führen wahrscheinlich zu Darstellungsfehlern in Outlook.', variant: 'destructive', icon: ShieldAlert };
        if (warnings.length > 0) return { title: `Analyse: ${warnings.length} Warnung(en)`, description: 'Es wurden potenzielle Probleme gefunden, die überprüft werden sollten.', variant: 'default', icon: AlertTriangle };
        return { title: 'Analyse: Alles in Ordnung', description: 'Keine offensichtlichen Kompatibilitätsprobleme gefunden.', variant: 'default', icon: CheckCircle };
    }

    const summary = getSummary();

    return (
        <div className="p-2 border-b">
            <Accordion type="single" collapsible disabled={!htmlContent}>
                <AccordionItem value="item-1" className="border-b-0">
                    <AccordionTrigger className="hover:no-underline p-0">
                        <Alert variant={summary.variant} className="w-full">
                            {React.createElement(summary.icon, { className: "h-4 w-4" })}
                            <AlertTitle>{summary.title}</AlertTitle>
                            <AlertDescription>{summary.description}</AlertDescription>
                        </Alert>
                    </AccordionTrigger>
                    <AccordionContent className="pt-4 text-xs">
                        <div className="space-y-3">
                           {errors.length > 0 && (
                                <div>
                                    <h4 className="font-semibold text-red-600">Kritische Fehler:</h4>
                                    <ul className="list-disc pl-5">
                                        {errors.map((e, i) => <li key={i}><strong>{e.message}:</strong> {e.details}</li>)}
                                    </ul>
                                </div>
                           )}
                           {warnings.length > 0 && (
                                <div>
                                    <h4 className="font-semibold text-yellow-600">Warnungen:</h4>
                                     <ul className="list-disc pl-5">
                                        {warnings.map((w, i) => <li key={i}><strong>{w.message}:</strong> {w.details}</li>)}
                                    </ul>
                                </div>
                           )}
                           {infos.length > 0 && (
                               <div>
                                    <h4 className="font-semibold text-blue-600">Hinweise & Best Practices:</h4>
                                    <ul className="list-disc pl-5">
                                        {infos.map((info, i) => <li key={i}><strong>{info.message}:</strong> {info.details}</li>)}
                                    </ul>
                               </div>
                           )}
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    )
}

function PalabrotasManager({ initialPalabrotas }: { initialPalabrotas: Palabrota[] }) {
    const [palabrotas, setPalabrotas] = useState<Palabrota[]>(initialPalabrotas);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const fetchPalabrotas = useCallback(async () => {
        setLoading(true);
        try {
            const fetched = await getPalabrotas();
            setPalabrotas(fetched);
        } catch (error) {
            console.error("Error fetching palabrotas:", error);
            toast({ variant: "destructive", title: "Fehler", description: "Vokabular konnte nicht geladen werden." });
        } finally {
            setLoading(false);
        }
    }, [toast]);
    
    useEffect(() => {
        setPalabrotas(initialPalabrotas);
    }, [initialPalabrotas]);

    return (
        <div>
            <div className="flex justify-between items-center mb-4 gap-4">
                <div className="flex gap-2">
                    <PalabrotaForm fetchPalabrotas={fetchPalabrotas} />
                    <BulkPalabrotaForm fetchPalabrotas={fetchPalabrotas} />
                </div>
                 <Button onClick={fetchPalabrotas} disabled={loading} variant="outline">
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                    Aktualisieren
                </Button>
            </div>
            <div className="border rounded-lg overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Deutsch</TableHead>
                            <TableHead>Spanisch</TableHead>
                            <TableHead>Pfeifer-Faktor</TableHead>
                            <TableHead className="text-right">Aktionen</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {palabrotas.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium">{item.de}</TableCell>
                                <TableCell className="italic text-muted-foreground">{item.es}</TableCell>
                                <TableCell>
                                    <div className="flex">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <Flame key={i} className={cn('h-4 w-4', i < item.pfeiferFaktor ? 'text-red-500 fill-current' : 'text-gray-300')} />
                                        ))}
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex gap-2 justify-end">
                                        <PalabrotaForm isEditMode={true} palabra={item} fetchPalabrotas={fetchPalabrotas}>
                                            <Button size="sm" variant="outline"><Edit className="h-4 w-4" /></Button>
                                        </PalabrotaForm>
                                        <DeletePalabrotaAlert id={item.id} name={item.de} fetchPalabrotas={fetchPalabrotas} />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

function BulkPalabrotaForm({ fetchPalabrotas }: { fetchPalabrotas: () => void; }) {
    const { toast } = useToast();
    const [isOpen, setIsOpen] = useState(false);
    const [state, action] = useActionState(bulkAddPalabrotasAction, { success: false, error: null, message: null });

    useEffect(() => {
        if (state.success) {
            toast({ title: "Erfolg", description: state.message });
            setIsOpen(false);
            fetchPalabrotas();
        }
        if (state.error) {
            toast({ variant: "destructive", title: "Fehler", description: state.error });
        }
    }, [state, toast, fetchPalabrotas]);

    return (
         <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline"><Upload className="mr-2 h-4 w-4" /> Massen-Import</Button>
            </DialogTrigger>
            <DialogContent>
                 <form action={action}>
                    <DialogHeader>
                        <DialogTitle>Palabrotas per Liste importieren</DialogTitle>
                        <DialogDescription>
                            Fügen Sie eine Liste von Wörtern ein. Jedes Paar muss im Format "Deutsch Spanisch" sein und durch ein Semikolon getrennt werden.
                        </DialogDescription>
                    </DialogHeader>
                     <div className="grid gap-4 py-4">
                        <Textarea 
                            name="wordList"
                            placeholder="z.B. Wort1 Spanisch1; Wort2 Spanisch2; ..."
                            className="h-48"
                            required
                        />
                    </div>
                    <DialogFooter>
                        <DialogClose asChild><Button type="button" variant="secondary">Abbrechen</Button></DialogClose>
                        <Button type="submit">Importieren</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function PalabrotaForm({
  isEditMode = false,
  palabra,
  fetchPalabrotas,
  children
}: {
  isEditMode?: boolean;
  palabra?: Palabrota;
  fetchPalabrotas: () => void;
  children?: React.ReactNode;
}) {
    const { toast } = useToast();
    const [isOpen, setIsOpen] = useState(false);
    const formAction = isEditMode ? updatePalabrotaAction : addPalabrotaAction;
    const [state, action] = useActionState(formAction, { success: false, error: null, message: null });

    const handleFetchPalabrotas = useCallback(() => {
      fetchPalabrotas();
    }, [fetchPalabrotas]);

    useEffect(() => {
        if (state.success) {
            toast({ title: "Erfolg", description: state.message });
            setIsOpen(false);
            handleFetchPalabrotas();
        }
        if (state.error) {
            toast({ variant: "destructive", title: "Fehler", description: state.error });
        }
    }, [state, toast, handleFetchPalabrotas]);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {children ? children : <Button variant="outline"><PlusCircle className="mr-2 h-4 w-4" /> Wort hinzufügen</Button>}
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
                <form action={action}>
                    <DialogHeader>
                        <DialogTitle>{isEditMode ? 'Wort bearbeiten' : 'Neues Wort hinzufügen'}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        {isEditMode && <input type="hidden" name="id" value={palabra?.id} />}
                        <Input name="de" placeholder="Deutsches Wort" defaultValue={palabra?.de} required />
                        <Input name="es" placeholder="Spanisches Wort" defaultValue={palabra?.es} required />
                        <Input name="phonetik" placeholder="Phonetische Schreibweise (z.B. chili-poy-yas)" defaultValue={palabra?.phonetik} />
                        <Input name="wortart" placeholder="Wortart" defaultValue={palabra?.wortart} required />
                        <div className="grid grid-cols-2 gap-4">
                           <Input name="artikel" placeholder="Artikel (el, la...)" defaultValue={palabra?.artikel} />
                           <Select name="geschlecht" defaultValue={palabra?.geschlecht}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Geschlecht" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="m">Männlich</SelectItem>
                                    <SelectItem value="w">Weiblich</SelectItem>
                                    <SelectItem value="n">Neutral</SelectItem>
                                    <SelectItem value="p">Plural</SelectItem>
                                </SelectContent>
                           </Select>
                        </div>
                        <Input name="mehrzahl" placeholder="Mehrzahl" defaultValue={palabra?.mehrzahl} />
                        <Textarea name="anwendung" placeholder="Anwendung" defaultValue={palabra?.anwendung} required />
                        <Textarea name="synonyme" placeholder="Synonyme" defaultValue={palabra?.synonyme} required />
                        <Textarea name="beispiel" placeholder="Beispielsatz" defaultValue={palabra?.beispiel} required />
                        <Textarea name="kontext" placeholder="Zusätzlicher Kontext/Nuancen" defaultValue={palabra?.kontext} />
                        <Input name="region" placeholder="Region (z.B. Spanien, Lateinamerika)" defaultValue={palabra?.region} />
                        <Input name="steigerung" placeholder="Steigerung (für Adjektive)" defaultValue={palabra?.steigerung} />
                        <div>
                            <Label>Pfeifer-Faktor™</Label>
                            <Input name="pfeiferFaktor" type="number" min="0" max="5" defaultValue={palabra?.pfeiferFaktor ?? 3} required />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild><Button type="button" variant="secondary">Abbrechen</Button></DialogClose>
                        <Button type="submit">{isEditMode ? 'Speichern' : 'Hinzufügen'}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function DeletePalabrotaAlert({ id, name, fetchPalabrotas }: { id: string, name: string, fetchPalabrotas: () => void }) {
    const { toast } = useToast();
    const [state, action] = useActionState(deletePalabrotaAction, { success: false, error: null, message: null });

    const handleFetchPalabrotas = useCallback(() => {
      fetchPalabrotas();
    }, [fetchPalabrotas]);


    useEffect(() => {
        if (state.success) {
            toast({ title: "Erfolg", description: state.message });
            handleFetchPalabrotas();
        }
        if (state.error) {
            toast({ variant: "destructive", title: "Fehler", description: state.error });
        }
    }, [state, toast, handleFetchPalabrotas]);

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button size="sm" variant="destructive"><Trash2 className="h-4 w-4" /></Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <form action={action}>
                    <input type="hidden" name="id" value={id} />
                    <AlertDialogHeader>
                        <AlertDialogTitle>Wort "{name}" wirklich löschen?</AlertDialogTitle>
                        <AlertDialogDescription>Diese Aktion kann nicht rückgängig gemacht werden.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                        <AlertDialogAction type="submit">Ja, löschen</AlertDialogAction>
                    </AlertDialogFooter>
                </form>
            </AlertDialogContent>
        </AlertDialog>
    );
}

function ExcerptsManager({ initialExcerpts }: { initialExcerpts: Excerpt[] }) {
    const { toast } = useToast();
    const [excerpts, setExcerpts] = useState(initialExcerpts);

    const [state, formAction] = useActionState(updateExcerptAction, { success: false, error: null });

    useEffect(() => {
        if (state.success) {
            toast({ title: "Erfolg", description: state.message || "Status aktualisiert." });
            const slug = state.slug;
            const newIsPublished = state.isPublished;
            if (slug !== undefined && newIsPublished !== undefined) {
                setExcerpts(prev => prev.map(e => e.slug === slug ? { ...e, isPublished: newIsPublished } : e));
            } else {
                 getExcerpts().then(setExcerpts);
            }
        }
        if (state.error) {
            toast({ variant: "destructive", title: "Fehler", description: state.error });
        }
    }, [state, toast]);

    useEffect(() => {
        setExcerpts(initialExcerpts);
    }, [initialExcerpts]);

    return (
        <div className="space-y-4">
            <p className="text-muted-foreground">Verwalten Sie hier die 36 Exzerpt-Kapitel. Veröffentlichte Kapitel erscheinen auf der <Link href="/exzerpte" className="underline" target="_blank">Exzerpte-Übersichtsseite</Link>.</p>
            <div className="border rounded-lg overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Kapitel</TableHead>
                            <TableHead>Titel</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Aktionen</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {excerpts.map((excerpt) => (
                            <TableRow key={excerpt.id}>
                                <TableCell className="font-medium">{excerpt.chapterNumber}</TableCell>
                                <TableCell>{excerpt.title}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Badge variant={excerpt.isPublished ? "default" : "secondary"}>
                                            {excerpt.isPublished ? "Veröffentlicht" : "Entwurf"}
                                        </Badge>
                                        {excerpt.isPublished && (
                                            <Link href={`/exzerpt/${excerpt.slug}`} target="_blank" title="Live-Seite ansehen">
                                                <Button variant="ghost" size="icon" className="h-6 w-6">
                                                    <ArrowUpRight className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <form action={formAction} className="inline-flex gap-2 items-center">
                                        <input type="hidden" name="slug" value={excerpt.slug} />
                                        <input type="hidden" name="isPublished" value={String(!excerpt.isPublished)} />
                                        <Button 
                                            type="submit"
                                            size="sm" 
                                            variant="ghost" 
                                            title={excerpt.isPublished ? "Veröffentlichung zurückziehen" : "Veröffentlichen"}
                                        >
                                            {excerpt.isPublished ? <ToggleRight className="h-5 w-5 text-green-600"/> : <ToggleLeft className="h-5 w-5 text-gray-400"/>}
                                        </Button>
                                    </form>
                                    <Link href={`/admin/exzerpt/${excerpt.slug}`} className="inline-flex">
                                        <Button size="sm" variant="outline">
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}


function OverviewTab({
    newsletters,
    legalPages,
    onTabChange
} : {
    newsletters: Newsletter[],
    legalPages: LegalPage[],
    onTabChange: (value: string) => void;
}) {
    const stats = [
        {
            title: "E-Mail Marketing",
            value: "Resend",
            icon: Users,
            link: "email",
            description: "Abonnenten & Versand"
        },
        {
            title: "Newsletter",
            value: newsletters.length,
            icon: Newspaper,
            link: "newsletters",
            description: "Vorlagen bearbeiten"
        },
        {
            title: "Dynamische LPs",
            value: legalPages.length,
            icon: FileText,
            link: "dynamic-lps"
        },
    ]

    return (
        <div>
            <h2 className="text-2xl font-bold font-headline mb-4">Willkommen im Cockpit!</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map(stat => (
                    <Card key={stat.title}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                            <stat.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                             <button onClick={() => onTabChange(stat.link)} className="text-xs text-muted-foreground hover:text-primary flex items-center">
                                {stat.description || 'Zum Tab'} <ArrowRight className="h-3 w-3 ml-1" />
                            </button>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
                 <Card>
                    <CardHeader>
                        <CardTitle className="font-headline text-xl flex items-center gap-2"><DatabaseZap className="h-5 w-5"/>IMCORE</CardTitle>
                        <CardDescription>(Internal Management Core)</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                           Erweiterte Verwaltung von Datenbank, Storage, Analytics und KI-Flows.
                        </p>
                        <Link href="/internal/isdm/dashboard">
                            <Button variant="outline">
                                Zum IMCORE <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
                 <Card className="flex flex-col justify-center items-center p-6 text-center bg-muted/40">
                    <h3 className="font-headline text-lg font-semibold">"Hallo Welt" Admin-Bereich</h3>
                    <p className="text-sm text-muted-foreground mt-1">Verwalten Sie hier die Inhalte und Abonnenten. Gehen Sie mit großer Macht weise um.</p>
                </Card>
            </div>
        </div>
    )
}

export function AdminDashboard({ defaultTab = "übersicht" }: { defaultTab?: string }) {
    const [activeTab, setActiveTab] = useState(defaultTab);
    const [loading, setLoading] = useState(true);
    const [initialData, setInitialData] = useState({
        legalPages: [] as LegalPage[],
        newsletters: [] as Newsletter[],
        palabrotas: [] as Palabrota[],
        excerpts: [] as Excerpt[],
    });

    const fetchAllData = useCallback(async () => {
        setLoading(true);
        try {
            const [
                legalPages,
                newsletters,
                palabrotas,
                excerpts,
            ] = await Promise.all([
                getLegalPages(),
                getNewsletters(),
                getPalabrotas(),
                getExcerpts(),
            ]);
            setInitialData({
                legalPages,
                newsletters,
                palabrotas,
                excerpts,
            });
        } catch (error) {
            console.error("Failed to load admin dashboard data:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAllData();
    }, [fetchAllData]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    return (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-7 h-auto">
                <TabsTrigger value="übersicht"><LayoutDashboard className="mr-2 h-4 w-4" />Übersicht</TabsTrigger>
                <TabsTrigger value="email"><Mail className="mr-2 h-4 w-4" />E-Mail</TabsTrigger>
                <TabsTrigger value="newsletters">Newsletter</TabsTrigger>
                <TabsTrigger value="dynamic-lps">Dynamische LPs</TabsTrigger>
                <TabsTrigger value="excerpts"><BookOpen className="mr-2 h-4w-4" />Exzerpte</TabsTrigger>
                <TabsTrigger value="palabrotas">Palabrotas</TabsTrigger>
                <TabsTrigger value="seo"><Sparkles className="mr-2 h-4 w-4" />SEO</TabsTrigger>
            </TabsList>
            <TabsContent value="übersicht" className="mt-6">
                <OverviewTab 
                    newsletters={initialData.newsletters}
                    legalPages={initialData.legalPages}
                    onTabChange={setActiveTab}
                />
            </TabsContent>
            <TabsContent value="email" className="mt-6">
                <EmailMarketingManager initialNewsletters={initialData.newsletters} />
            </TabsContent>
             <TabsContent value="dynamic-lps" className="mt-6">
                <LegalPagesManager initialLegalPages={initialData.legalPages} />
            </TabsContent>
            <TabsContent value="excerpts" className="mt-6">
                <ExcerptsManager initialExcerpts={initialData.excerpts} />
            </TabsContent>
            <TabsContent value="newsletters" className="mt-6">
                <NewsletterManager initialNewsletters={initialData.newsletters} onTabChange={setActiveTab} />
            </TabsContent>
            <TabsContent value="palabrotas" className="mt-6">
                <PalabrotasManager initialPalabrotas={initialData.palabrotas} />
            </TabsContent>
             <TabsContent value="seo" className="mt-6">
                 <Card>
                    <CardHeader>
                        <CardTitle>SEO-Zentrale</CardTitle>
                        <CardDescription>Verwalten Sie die Metadaten für alle Seiten.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Link href="/admin/seo">
                            <Button>Zum SEO-Dashboard <ArrowRight className="ml-2 h-4 w-4"/></Button>
                        </Link>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    )
}
