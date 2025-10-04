

"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useActionState } from "react";
import { 
    Newsletter,
    Subscriber,
    Campaign,
    LegalPage,
    Palabrota,
    Excerpt,
    getSubscribers,
    getPalabrotas,
    getExcerpts
} from "@/lib/firestore";
import {
    addNewsletterAction,
    deleteNewsletterAction,
    duplicateNewsletterAction,
    tagSubscribersAction,
    sendNewsletterAction,
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
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, RefreshCw, VenetianMask, FileText, PlusCircle, Trash2, Edit, FilePlus, Mail, Copy, Users, Tag, Send, Book, LayoutDashboard, ArrowRight, Newspaper, Search, FilterX, CopyPlus, History, Flame, Upload, MessageSquareQuote, ToggleLeft, ToggleRight, BookOpen, ArrowUpRight, DatabaseZap } from "lucide-react";
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


function LeadsTable({ initialSubscribers }: { initialSubscribers: Subscriber[] }) {
    const [subscribers, setSubscribers] = useState<Subscriber[]>(initialSubscribers);
    const [loading, setLoading] = useState(false);
    const [selectedSubscribers, setSelectedSubscribers] = useState<string[]>([]);
    const [tagName, setTagName] = useState('');
    const { toast } = useToast();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    const [tagState, tagFormAction] = useActionState(tagSubscribersAction, { success: false, error: null });

    const allTags = useMemo(() => {
        const tagSet = new Set<string>();
        subscribers.forEach(s => s.tags?.forEach(t => tagSet.add(t)));
        return Array.from(tagSet).sort();
    }, [subscribers]);

    const filteredSubscribers = useMemo(() => {
        return subscribers.filter(sub => {
            const matchesSearch = sub.email.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesTags = selectedTags.length === 0 || selectedTags.every(tag => sub.tags?.includes(tag));
            return matchesSearch && matchesTags;
        });
    }, [subscribers, searchTerm, selectedTags]);

    const fetchLeads = useCallback(async () => {
        setLoading(true);
        try {
            const fetchedSubscribers = await getSubscribers();
            setSubscribers(fetchedSubscribers);
        } catch (error) {
            console.error("Error fetching subscribers:", error);
            toast({ variant: "destructive", title: "Fehler", description: "Abonnenten konnten nicht geladen werden." });
        } finally {
            setLoading(false);
        }
    }, [toast]);
    
    useEffect(() => {
        setSubscribers(initialSubscribers);
    }, [initialSubscribers]);

    useEffect(() => {
        if(tagState.success) {
            toast({ title: "Erfolg", description: "Tags wurden erfolgreich zugewiesen."});
            setSelectedSubscribers([]);
            setTagName('');
            fetchLeads(); // Refresh data
        }
        if (tagState.error) {
            toast({ variant: "destructive", title: "Fehler", description: tagState.error });
        }
    }, [tagState, toast, fetchLeads]);

    const handleSelectAll = (checked: boolean | 'indeterminate') => {
        if (checked === true) {
            setSelectedSubscribers(filteredSubscribers.map(sub => sub.id));
        } else {
            setSelectedSubscribers([]);
        }
    };
    
    const handleTagFormSubmit = (formData: FormData) => {
        formData.set('subscriberIds', JSON.stringify(selectedSubscribers));
        tagFormAction(formData);
    }
    
    const handleTagFilterClick = (tag: string) => {
        setSelectedTags(prev => 
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                 <form action={handleTagFormSubmit} className="flex items-center gap-2">
                    <Input 
                        placeholder="Tag-Name (z.B. HW2-Interesse)" 
                        value={tagName}
                        onChange={(e) => setTagName(e.target.value)}
                        name="tagName"
                        disabled={selectedSubscribers.length === 0}
                    />
                    <Button type="submit" disabled={selectedSubscribers.length === 0 || !tagName}>
                        <Tag className="mr-2 h-4 w-4" />
                        Zuweisen ({selectedSubscribers.length})
                    </Button>
                </form>
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Nach E-Mail suchen..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Button onClick={fetchLeads} disabled={loading} variant="outline">
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                    Aktualisieren
                </Button>
            </div>
             <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-medium">Filter nach Tags:</span>
                {allTags.map(tag => (
                     <Button 
                        key={tag} 
                        variant={selectedTags.includes(tag) ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleTagFilterClick(tag)}
                        className="h-7"
                    >
                        {tag}
                    </Button>
                ))}
                {selectedTags.length > 0 && (
                    <Button variant="ghost" size="sm" onClick={() => setSelectedTags([])} className="h-7 text-muted-foreground">
                        <FilterX className="mr-2 h-4 w-4"/>
                        Filter zurücksetzen
                    </Button>
                )}
            </div>
            <div className="border rounded-lg overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px]">
                                <Checkbox 
                                    checked={selectedSubscribers.length === filteredSubscribers.length && filteredSubscribers.length > 0 ? true : (selectedSubscribers.length > 0 ? 'indeterminate' : false)}
                                    onCheckedChange={handleSelectAll}
                                />
                            </TableHead>
                            <TableHead>E-Mail</TableHead>
                            <TableHead>Quelle</TableHead>
                            <TableHead>Tags</TableHead>
                            <TableHead>Datum</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-12">
                                    <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
                                </TableCell>
                            </TableRow>
                        ) : filteredSubscribers.length === 0 ? (
                             <TableRow>
                                <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                                    <VenetianMask className="mx-auto h-8 w-8 mb-2" />
                                    {subscribers.length === 0 ? "Noch keine Leads." : "Keine Leads entsprechen Ihren Filterkriterien."}
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredSubscribers.map((sub) => (
                                <TableRow key={sub.id} data-state={selectedSubscribers.includes(sub.id) ? 'selected' : ''}>
                                    <TableCell>
                                        <Checkbox 
                                            checked={selectedSubscribers.includes(sub.id)}
                                            onCheckedChange={(checked) => {
                                                setSelectedSubscribers(prev => 
                                                    checked ? [...prev, sub.id] : prev.filter(id => id !== sub.id)
                                                )
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-medium">{sub.email}</div>
                                    </TableCell>
                                    <TableCell>
                                        {Array.isArray(sub.source) ? sub.source.map(s => <Badge key={s} variant="secondary" className="mr-1">{s}</Badge>) : <Badge variant="secondary">{sub.source}</Badge>}
                                    </TableCell>
                                    <TableCell>
                                        {sub.tags?.map(tag => <Badge key={tag} variant="outline" className="mr-1">{tag}</Badge>)}
                                    </TableCell>
                                     <TableCell>
                                        {sub.subscribedAt ? format(new Date(sub.subscribedAt), "dd.MM.yyyy HH:mm", { locale: de }) : 'N/A'}
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

function NewsletterManager({ initialNewsletters, onTabChange }: { initialNewsletters: Newsletter[], onTabChange: (value: string) => void; }) {
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
                <Button onClick={() => onTabChange('campaigns')}>
                    Kampagne starten <Send className="ml-2 h-4 w-4" />
                </Button>
            </div>
             <div className="border rounded-lg overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Betreff</TableHead>
                            <TableHead>Zuletzt aktualisiert</TableHead>
                            <TableHead className="text-right">Aktionen</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {newsletters.length === 0 ? (
                             <TableRow>
                                <TableCell colSpan={4} className="text-center py-12 text-muted-foreground">
                                    <Mail className="mx-auto h-8 w-8 mb-2" />
                                    Keine Newsletter gefunden.
                                </TableCell>
                            </TableRow>
                        ) : (
                            newsletters.map((newsletter) => (
                                <TableRow key={newsletter.id}>
                                    <TableCell className="font-medium">{newsletter.name}</TableCell>
                                    <TableCell className="text-muted-foreground">{newsletter.subject}</TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {newsletter.lastUpdated ? format(new Date(newsletter.lastUpdated), "dd.MM.yyyy HH:mm", { locale: de }) : 'N/A'}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex gap-2 justify-end">
                                             <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button size="sm" variant="ghost" title="Diesen Newsletter als Vorlage verwenden und duplizieren">
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
                                                <Button size="sm" variant="outline">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button size="sm" variant="destructive" title="Newsletter löschen">
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

function CampaignsManager({ initialNewsletters, initialSubscribers, initialCampaigns }: { initialNewsletters: Newsletter[], initialSubscribers: Subscriber[], initialCampaigns: Campaign[] }) {
    const { toast } = useToast();
    const [sendState, sendFormAction] = useActionState(sendNewsletterAction, { success: false, message: null });

    const allTags = useMemo(() => {
        const tagSet = new Set<string>();
        initialSubscribers.forEach(s => s.tags?.forEach(t => tagSet.add(t)));
        return Array.from(tagSet);
    }, [initialSubscribers]);

    const [selectedNewsletter, setSelectedNewsletter] = useState<string>('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    
    useEffect(() => {
        if(sendState.message) {
            toast({
                title: sendState.success ? "Kampagne gestartet" : "Fehler",
                description: sendState.message,
                variant: sendState.success ? "default" : "destructive",
            });
        }
    }, [sendState, toast]);

    const matchingSubscribers = useMemo(() => {
        if (selectedTags.length === 0) return 0;
        return initialSubscribers.filter(s => selectedTags.every(tag => s.tags?.includes(tag))).length;
    }, [selectedTags, initialSubscribers]);

    const handleTagClick = (tag: string) => {
        setSelectedTags(prev => 
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        );
    };

    return (
        <div className="space-y-12">
            <form action={sendFormAction}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-6 p-6 border rounded-lg">
                        <h3 className="font-headline text-2xl font-bold">1. Newsletter auswählen</h3>
                        <Select name="newsletterId" required onValueChange={setSelectedNewsletter} value={selectedNewsletter}>
                            <SelectTrigger>
                                <SelectValue placeholder="Wählen Sie einen Newsletter..." />
                            </SelectTrigger>
                            <SelectContent>
                                {initialNewsletters.map(nl => (
                                    <SelectItem key={nl.id} value={nl.id}>{nl.name} - ({nl.subject})</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <h3 className="font-headline text-2xl font-bold mt-8">2. Zielgruppe definieren</h3>
                        <p className="text-sm text-muted-foreground">Wählen Sie einen oder mehrere Tags aus. Die Kampagne wird an alle Abonnenten gesendet, die **alle** ausgewählten Tags besitzen.</p>
                        <div className="flex flex-wrap gap-2">
                            {allTags.length === 0 ? (
                                <p className="text-sm text-muted-foreground">Noch keine Tags vorhanden. Weisen Sie im "Leads"-Tab welche zu.</p>
                            ) : allTags.map(tag => (
                                <Button 
                                    key={tag} 
                                    type="button"
                                    variant={selectedTags.includes(tag) ? "default" : "outline"}
                                    onClick={() => handleTagClick(tag)}
                                >
                                    {tag}
                                </Button>
                            ))}
                        </div>
                        {/* Hidden input to pass tags to server action */}
                        <input type="hidden" name="tags" value={JSON.stringify(selectedTags)} />
                    </div>
                    <div className="space-y-6 p-6 border rounded-lg bg-muted/50">
                        <h3 className="font-headline text-2xl font-bold">3. Vorschau & Versand</h3>
                        <Alert>
                            <Send className="h-4 w-4" />
                            <AlertTitle>Zusammenfassung</AlertTitle>
                            <AlertDescription>
                                <p>Newsletter: <strong>{initialNewsletters.find(nl => nl.id === selectedNewsletter)?.name || 'Keiner ausgewählt'}</strong></p>
                                <p>Ziel-Tags: {selectedTags.length > 0 ? selectedTags.map(t => <Badge key={t} className="mr-1">{t}</Badge>) : 'Keine'}</p>
                                <p className="mt-2 text-lg">Abonnenten, die erreicht werden: <strong className="text-primary">{matchingSubscribers}</strong></p>
                            </AlertDescription>
                        </Alert>
                        
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button size="lg" className="w-full" disabled={!selectedNewsletter || selectedTags.length === 0 || matchingSubscribers === 0}>
                                    <Send className="mr-2 h-5 w-5" />
                                    Kampagne starten
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Sind Sie absolut sicher?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Sie sind dabei, den Newsletter "{initialNewsletters.find(nl => nl.id === selectedNewsletter)?.name}" an {matchingSubscribers} Empfänger zu senden.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                                    <AlertDialogAction type="submit">Ja, jetzt versenden</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                        {sendState.success === false && sendState.message && (
                            <Alert variant="destructive">
                                <AlertTitle>Fehler beim Versand</AlertTitle>
                                <AlertDescription>
                                    {sendState.message}
                                </AlertDescription>
                            </Alert>
                        )}
                    </div>
                </div>
            </form>

            <div>
                <h3 className="font-headline text-2xl font-bold mb-4 flex items-center gap-2"><History className="h-6 w-6"/>Versand-Verlauf</h3>
                <div className="border rounded-lg overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Newsletter</TableHead>
                                <TableHead>Betreff</TableHead>
                                <TableHead>Empfänger</TableHead>
                                <TableHead>Tags</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Datum</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {initialCampaigns.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                                        <History className="mx-auto h-8 w-8 mb-2" />
                                        Bisher keine Kampagnen versendet.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                initialCampaigns.map((campaign) => (
                                    <TableRow key={campaign.id}>
                                        <TableCell className="font-medium">{campaign.newsletterName}</TableCell>
                                        <TableCell className="text-muted-foreground">{campaign.newsletterSubject}</TableCell>
                                        <TableCell className="text-muted-foreground">{campaign.recipientCount}</TableCell>
                                        <TableCell>
                                            {campaign.tags.map(tag => <Badge key={tag} variant="secondary" className="mr-1">{tag}</Badge>)}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={campaign.status === 'sent' ? 'default' : 'destructive'}>{campaign.status}</Badge>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {format(new Date(campaign.sentAt), "dd.MM.yyyy HH:mm", { locale: de })}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
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
                        <Input name="wortart" placeholder="Wortart" defaultValue={palabra?.wortart} required />
                        <Textarea name="anwendung" placeholder="Anwendung" defaultValue={palabra?.anwendung} required />
                        <Textarea name="synonyme" placeholder="Synonyme" defaultValue={palabra?.synonyme} required />
                        <Textarea name="beispiel" placeholder="Beispielsatz" defaultValue={palabra?.beispiel} required />
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

    const [state, formAction] = useActionState(updateExcerptAction, { success: false, error: null, message: null });
    
    useEffect(() => {
        if (state.success) {
            toast({ title: "Erfolg", description: state.message || "Status aktualisiert." });
            // This is an optimistic update. A better way would be to refetch.
            const formData = (state as any).formData as FormData;
            if(formData) {
                const slug = formData.get('slug');
                setExcerpts(prev => prev.map(e => e.slug === slug ? { ...e, isPublished: !e.isPublished } : e));
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
    subscribers,
    legalPages,
    onTabChange
} : {
    newsletters: Newsletter[],
    subscribers: Subscriber[],
    legalPages: LegalPage[],
    onTabChange: (value: string) => void;
}) {
    const stats = [
        {
            title: "Abonnenten",
            value: subscribers.length,
            icon: Users,
            link: "leads"
        },
        {
            title: "Newsletter",
            value: newsletters.length,
            icon: Newspaper,
            link: "newsletters"
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
                                Zum Tab <ArrowRight className="h-3 w-3 ml-1" />
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
                        <Link href="/internal">
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

export function AdminDashboard({
    initialLegalPages,
    initialNewsletters,
    initialSubscribers,
    initialCampaigns,
    initialPalabrotas,
    initialExcerpts,
}: {
    initialLegalPages: LegalPage[];
    initialNewsletters: Newsletter[];
    initialSubscribers: Subscriber[];
    initialCampaigns: Campaign[];
    initialPalabrotas: Palabrota[];
    initialExcerpts: Excerpt[];
}) {
    const [activeTab, setActiveTab] = useState("übersicht");

    return (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-7 h-auto">
                <TabsTrigger value="übersicht"><LayoutDashboard className="mr-2 h-4 w-4" />Übersicht</TabsTrigger>
                <TabsTrigger value="leads"><Users className="mr-2 h-4 w-4" />Leads</TabsTrigger>
                <TabsTrigger value="dynamic-lps">Dynamische LPs</TabsTrigger>
                <TabsTrigger value="excerpts"><BookOpen className="mr-2 h-4 w-4" />Exzerpte</TabsTrigger>
                <TabsTrigger value="newsletters">Newsletter</TabsTrigger>
                 <TabsTrigger value="palabrotas">Palabrotas</TabsTrigger>
                <TabsTrigger value="campaigns"><Send className="mr-2 h-4 w-4" />Kampagnen</TabsTrigger>
            </TabsList>
            <TabsContent value="übersicht" className="mt-6">
                <OverviewTab 
                    newsletters={initialNewsletters}
                    subscribers={initialSubscribers}
                    legalPages={initialLegalPages}
                    onTabChange={setActiveTab}
                />
            </TabsContent>
            <TabsContent value="leads" className="mt-6">
                <LeadsTable initialSubscribers={initialSubscribers} />
            </TabsContent>
             <TabsContent value="dynamic-lps" className="mt-6">
                <LegalPagesManager initialLegalPages={initialLegalPages} />
            </TabsContent>
            <TabsContent value="excerpts" className="mt-6">
                <ExcerptsManager initialExcerpts={initialExcerpts} />
            </TabsContent>
            <TabsContent value="newsletters" className="mt-6">
                <NewsletterManager initialNewsletters={initialNewsletters} onTabChange={setActiveTab} />
            </TabsContent>
            <TabsContent value="palabrotas" className="mt-6">
                <PalabrotasManager initialPalabrotas={initialPalabrotas} />
            </TabsContent>
             <TabsContent value="campaigns" className="mt-6">
                <CampaignsManager 
                    initialNewsletters={initialNewsletters} 
                    initialSubscribers={initialSubscribers}
                    initialCampaigns={initialCampaigns}
                />
            </TabsContent>
        </Tabs>
    )
}
