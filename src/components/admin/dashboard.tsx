

"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useActionState } from "react";
import { 
    Product, 
    LegalPage, 
    Newsletter,
    Subscriber,
    getSubscribers,
} from "@/lib/firestore";
import {
    addProductAction,
    updateProductAction,
    deleteProductAction,
    addLegalPageAction,
    deleteLegalPageAction,
    addNewsletterAction,
    deleteNewsletterAction,
    tagSubscribersAction,
    sendNewsletterAction,
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
import { Loader2, RefreshCw, Save, VenetianMask, FileText, PlusCircle, Trash2, Edit, FilePlus, Mail, Copy, Users, Tag, Send } from "lucide-react";
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
import { CodeEditor } from "./code-editor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


function LeadsTable({ initialSubscribers }: { initialSubscribers: Subscriber[] }) {
    const [subscribers, setSubscribers] = useState<Subscriber[]>(initialSubscribers);
    const [loading, setLoading] = useState(false);
    const [selectedSubscribers, setSelectedSubscribers] = useState<string[]>([]);
    const [tagName, setTagName] = useState('');
    const { toast } = useToast();

    const [tagState, tagFormAction] = useActionState(tagSubscribersAction, { success: false, error: null });

    const fetchLeads = async () => {
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
    };
    
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
    }, [tagState, toast]);

    const handleSelectAll = (checked: boolean | 'indeterminate') => {
        if (checked === true) {
            setSelectedSubscribers(subscribers.map(sub => sub.id));
        } else {
            setSelectedSubscribers([]);
        }
    };
    
    const handleTagFormSubmit = (formData: FormData) => {
        formData.set('subscriberIds', JSON.stringify(selectedSubscribers));
        tagFormAction(formData);
    }

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
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
                <Button onClick={fetchLeads} disabled={loading} variant="outline">
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                    Aktualisieren
                </Button>
            </div>
            <div className="border rounded-lg overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px]">
                                <Checkbox 
                                    checked={selectedSubscribers.length === subscribers.length && subscribers.length > 0 ? true : (selectedSubscribers.length > 0 ? 'indeterminate' : false)}
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
                        ) : subscribers.length === 0 ? (
                             <TableRow>
                                <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                                    <VenetianMask className="mx-auto h-8 w-8 mb-2" />
                                    Noch keine Leads. Die Welt ist noch nicht bereit für so viel Genialität.
                                </TableCell>
                            </TableRow>
                        ) : (
                            subscribers.map((sub) => (
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

type AdminProductState = {
  success: boolean;
  error: string | null;
  message?: string;
};

const initialProductState: AdminProductState = { success: false, error: null };

function ProductsManager({ initialProducts }: { initialProducts: Product[] }) {
    const [products, setProducts] = useState<Product[]>(initialProducts);
    const [editingProducts, setEditingProducts] = useState<{ [key: string]: Partial<Product> }>({});
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const { toast } = useToast();

    const [addState, addFormAction] = useActionState(addProductAction, initialProductState);
    const [updateState, updateFormAction] = useActionState(updateProductAction, initialProductState);
    const [deleteState, deleteFormAction] = useActionState(deleteProductAction, initialProductState);

     useEffect(() => {
        setProducts(initialProducts);
    }, [initialProducts]);
    
    useEffect(() => {
        if (addState.success) {
            toast({ title: "Erfolg", description: addState.message });
            setIsAddDialogOpen(false);
        }
        if (addState.error) {
            toast({ variant: "destructive", title: "Fehler", description: addState.error });
        }
    }, [addState, toast]);
    
    useEffect(() => {
        if (updateState.success) {
            toast({ title: "Erfolg", description: updateState.message });
            setEditingProducts({});
        }
        if (updateState.error) {
            toast({ variant: "destructive", title: "Fehler", description: updateState.error });
        }
    }, [updateState, toast]);

    useEffect(() => {
        if (deleteState.success) {
            toast({ title: "Erfolg", description: deleteState.message });
        }
        if (deleteState.error) {
            toast({ variant: "destructive", title: "Fehler", description: deleteState.error });
        }
    }, [deleteState, toast]);


    const handleInputChange = (productId: string, field: keyof Product, value: string | number) => {
        setEditingProducts(prev => ({
            ...prev,
            [productId]: { ...prev[productId], [field]: value }
        }));
    };

    return (
        <div>
             <div className="flex justify-between items-center mb-4">
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline"><PlusCircle className="mr-2 h-4 w-4" /> Neues Produkt</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <form action={addFormAction}>
                            <DialogHeader>
                                <DialogTitle>Neues Produkt hinzufügen</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <Input name="title" placeholder="Titel" required />
                                <Input name="subtitle" placeholder="Untertitel" />
                                <Input name="price" type="number" step="0.01" placeholder="Preis (z.B. 10.99)" required />
                                <Input name="preorderPrice" type="number" step="0.01" placeholder="Vorbestell-Preis (optional)" />
                                <Input name="amazonLink" placeholder="Amazon Link" required />
                                <Input name="imageSrc" placeholder="Bild-URL (z.B. https://picsum.photos/...)" required />
                                <Input name="aiHint" placeholder="AI-Hint für Bild (z.B. book cover)" />
                                <Textarea name="description" placeholder="Beschreibung" />
                            </div>
                            <DialogFooter>
                                <DialogClose asChild><Button type="button" variant="secondary">Abbrechen</Button></DialogClose>
                                <Button type="submit">Speichern</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
            <div className="border rounded-lg overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Produkt</TableHead>
                            <TableHead>Preis</TableHead>
                            <TableHead>Vorbestell-Preis</TableHead>
                            <TableHead>Amazon Link</TableHead>
                            <TableHead className="text-right">Aktionen</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.length === 0 ? (
                             <TableRow>
                                <TableCell colSpan={5} className="text-center py-12">
                                    <p>Keine Produkte gefunden.</p>
                                </TableCell>
                            </TableRow>
                        ) : (
                            products.map((product) => {
                                const currentProduct = { ...product, ...editingProducts[product.id] };
                                return (
                                <TableRow key={product.id}>
                                    <TableCell className="font-medium">{currentProduct.title}</TableCell>
                                    <TableCell>
                                        <Input
                                            type="number"
                                            value={currentProduct.price ?? ''}
                                            onChange={(e) => handleInputChange(product.id, 'price', parseFloat(e.target.value))}
                                            className="w-24"
                                        />
                                    </TableCell>
                                    <TableCell>
                                         <Input
                                            type="number"
                                            value={currentProduct.preorderPrice ?? ''}
                                            onChange={(e) => handleInputChange(product.id, 'preorderPrice', parseFloat(e.target.value))}
                                            className="w-24"
                                            placeholder="N/A"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Input
                                            value={currentProduct.amazonLink}
                                            onChange={(e) => handleInputChange(product.id, 'amazonLink', e.target.value)}
                                            className="w-full"
                                        />
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex gap-2 justify-end">
                                            <form action={updateFormAction}>
                                                <input type="hidden" name="productId" value={product.id} />
                                                <input type="hidden" name="productData" value={JSON.stringify(editingProducts[product.id] || {})} />
                                                <Button type="submit" disabled={!editingProducts[product.id]} size="sm" variant="outline">
                                                    <Save className="h-4 w-4" />
                                                </Button>
                                            </form>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button size="sm" variant="destructive">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <form action={deleteFormAction}>
                                                        <input type="hidden" name="productId" value={product.id} />
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Sind Sie sicher?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Diese Aktion kann nicht rückgängig gemacht werden. Das Produkt wird dauerhaft gelöscht.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                                                            <AlertDialogAction type="submit">Löschen</AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </form>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )})
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

type AdminLegalPageState = {
  success: boolean;
  error: string | null;
  message?: string;
};
const initialLegalPageState: AdminLegalPageState = { success: false, error: null };

function LegalPagesManager({ initialPages }: { initialPages: LegalPage[] }) {
    const [pages, setPages] = useState<LegalPage[]>(initialPages);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const { toast } = useToast();

    const [addState, addFormAction] = useActionState(addLegalPageAction, initialLegalPageState);
    const [deleteState, deleteFormAction] = useActionState(deleteLegalPageAction, initialLegalPageState);
    
    const [newContent, setNewContent] = useState("<h1 class=\"text-4xl font-bold\">Neuer Seitentitel</h1>\n<p class=\"mt-4\">Dies ist der Inhalt Ihrer neuen Seite.</p>");

    useEffect(() => {
        setPages(initialPages);
    }, [initialPages]);

    useEffect(() => {
        if (addState.success) {
            toast({ title: "Erfolg", description: addState.message });
            setIsAddDialogOpen(false);
            setNewContent("<h1 class=\"text-4xl font-bold\">Neuer Seitentitel</h1>\n<p class=\"mt-4\">Dies ist der Inhalt Ihrer neuen Seite.</p>");
        }
        if (addState.error) {
            toast({ variant: "destructive", title: "Fehler", description: addState.error });
        }
    }, [addState, toast]);

    useEffect(() => {
        if (deleteState.success) {
            toast({ title: "Erfolg", description: deleteState.message });
        }
        if (deleteState.error) {
            toast({ variant: "destructive", title: "Fehler", description: deleteState.error });
        }
    }, [deleteState, toast]);
    
    const handleAddFormSubmit = (formData: FormData) => {
        formData.set('content', newContent);
        formData.set('components', '[]'); // Start with empty components for new pages
        addFormAction(formData);
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                 <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline"><PlusCircle className="mr-2 h-4 w-4" /> Neue Dynamische LP</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-4xl max-h-[90vh] flex flex-col">
                        <form onSubmit={(e) => { e.preventDefault(); handleAddFormSubmit(new FormData(e.currentTarget)); }} className="flex flex-col min-h-0 flex-grow">
                            <DialogHeader>
                                <DialogTitle>Neue Dynamische LP hinzufügen</DialogTitle>
                                <DialogDescription>Erstellen Sie hier eine neue Seite.</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4 flex-grow min-h-0">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="pageId">Seiten-ID (slug)</Label>
                                        <Input id="pageId" name="pageId" placeholder="z.B. 'neue-seite'" required />
                                    </div>
                                     <div>
                                        <Label htmlFor="title">Seitentitel</Label>
                                        <Input id="title" name="title" placeholder="Seitentitel für Browser-Tab" required />
                                    </div>
                                </div>
                               
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
                            <TableHead>Titel</TableHead>
                            <TableHead>URL-Slug</TableHead>
                            <TableHead>Zuletzt aktualisiert</TableHead>
                            <TableHead className="text-right">Aktionen</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {pages.length === 0 ? (
                             <TableRow>
                                <TableCell colSpan={4} className="text-center py-12 text-muted-foreground">
                                    <FileText className="mx-auto h-8 w-8 mb-2" />
                                    Keine Seiten gefunden.
                                </TableCell>
                            </TableRow>
                        ) : (
                            pages.map((page) => (
                                <TableRow key={page.id}>
                                    <TableCell className="font-medium">{page.title}</TableCell>
                                    <TableCell>
                                        <Link href={`/${page.id}`} target="_blank" className="text-muted-foreground hover:text-primary underline">
                                            /{page.id}
                                        </Link>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {page.lastUpdated ? format(new Date(page.lastUpdated), "dd.MM.yyyy HH:mm", { locale: de }) : 'N/A'}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex gap-2 justify-end">
                                            <Link href={`/admin/editor/${page.id}`}>
                                                <Button size="sm" variant="outline">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button size="sm" variant="destructive">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Sind Sie sicher?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Diese Aktion kann nicht rückgängig gemacht werden. Die Seite /{page.id} wird dauerhaft gelöscht.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                                                        <form action={deleteFormAction}>
                                                            <input type="hidden" name="pageId" value={page.id} />
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

type AdminNewsletterState = {
  success: boolean;
  error?: string | null;
  message?: string;
  newNewsletterId?: string;
};

const initialNewsletterState: AdminNewsletterState = { success: false };

function NewsletterManager({ initialNewsletters }: { initialNewsletters: Newsletter[] }) {
    const router = useRouter();
    const [newsletters, setNewsletters] = useState(initialNewsletters);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const { toast } = useToast();

    const [addState, addFormAction] = useActionState(addNewsletterAction, initialNewsletterState);
    const [deleteState, deleteFormAction] = useActionState(deleteNewsletterAction, initialNewsletterState);
    
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
                                            <Button size="sm" variant="ghost" onClick={() => handleCopyLink(newsletter.id)}>
                                                <Copy className="h-4 w-4" />
                                            </Button>
                                            <Link href={`/admin/nle/${newsletter.id}`}>
                                                <Button size="sm" variant="outline">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button size="sm" variant="destructive">
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

function CampaignsManager({ initialNewsletters, initialSubscribers }: { initialNewsletters: Newsletter[], initialSubscribers: Subscriber[] }) {
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
                title: sendState.success ? "Kampagne gestartet (simuliert)" : "Fehler",
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
                                    Sie sind dabei, den Newsletter "{initialNewsletters.find(nl => nl.id === selectedNewsletter)?.name}" an {matchingSubscribers} Empfänger zu senden. Diese Aktion ist nur simuliert und versendet keine echten E-Mails.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                                <AlertDialogAction type="submit">Ja, Versand simulieren</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                    <Alert variant="destructive">
                        <AlertTitle>Wichtiger Hinweis</AlertTitle>
                        <AlertDescription>
                            Diese Funktion ist derzeit nur eine **Simulation**. Es werden **keine echten E-Mails** versendet. Ein Entwickler muss hier einen E-Mail-Service wie Resend oder Mailgun anbinden. Die Logik ist in `sendNewsletterAction` in `src/app/admin/actions.ts` vorbereitet.
                        </AlertDescription>
                    </Alert>
                </div>
            </div>
        </form>
    );
}

export function AdminDashboard({
    initialProducts,
    initialLegalPages,
    initialNewsletters,
    initialSubscribers,
}: {
    initialProducts: Product[];
    initialLegalPages: LegalPage[];
    initialNewsletters: Newsletter[];
    initialSubscribers: Subscriber[];
}) {
    return (
        <Tabs defaultValue="leads" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="leads"><Users className="mr-2 h-4 w-4" />Leads</TabsTrigger>
                <TabsTrigger value="products">Produkte</TabsTrigger>
                <TabsTrigger value="legal">Dynamische LPs</TabsTrigger>
                <TabsTrigger value="newsletters">Newsletter</TabsTrigger>
                <TabsTrigger value="campaigns"><Send className="mr-2 h-4 w-4" />Kampagnen</TabsTrigger>
            </TabsList>
            <TabsContent value="leads" className="mt-6">
                <LeadsTable initialSubscribers={initialSubscribers} />
            </TabsContent>
            <TabsContent value="products" className="mt-6">
                <ProductsManager initialProducts={initialProducts} />
            </TabsContent>
            <TabsContent value="legal" className="mt-6">
                <LegalPagesManager initialPages={initialPages} />
            </TabsContent>
            <TabsContent value="newsletters" className="mt-6">
                <NewsletterManager initialNewsletters={initialNewsletters} />
            </TabsContent>
             <TabsContent value="campaigns" className="mt-6">
                <CampaignsManager initialNewsletters={initialNewsletters} initialSubscribers={initialSubscribers} />
            </TabsContent>
        </Tabs>
    )
}
