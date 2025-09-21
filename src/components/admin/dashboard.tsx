"use client";

import { useState, useEffect } from "react";
import { useActionState } from "react";
import { 
    Order, 
    Product, 
    LegalPage, 
    getOrders
} from "@/lib/firestore";
import {
    addProductAction,
    updateProductAction,
    deleteProductAction,
    addLegalPageAction,
    updateLegalPageAction,
    deleteLegalPageAction,
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
import { Loader2, RefreshCw, Save, VenetianMask, FileText, PlusCircle, Trash2, Edit } from "lucide-react";
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

function LeadsTable() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const fetchedOrders = await getOrders();
            setOrders(fetchedOrders);
        } catch (error) {
            console.error("Error fetching orders:", error);
            toast({ variant: "destructive", title: "Fehler", description: "Bestellungen konnten nicht geladen werden." });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    return (
        <div>
            <div className="flex justify-end mb-4">
                <Button onClick={fetchOrders} disabled={loading} variant="outline">
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                    Aktualisieren
                </Button>
            </div>
            <div className="border rounded-lg overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Datum</TableHead>
                            <TableHead>Kunde</TableHead>
                            <TableHead>Bestelltyp</TableHead>
                            <TableHead>Bestellte Artikel</TableHead>
                            <TableHead className="text-right">Gesamtpreis</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-12">
                                    <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
                                </TableCell>
                            </TableRow>
                        ) : orders.length === 0 ? (
                             <TableRow>
                                <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                                    <VenetianMask className="mx-auto h-8 w-8 mb-2" />
                                    Noch keine Leads. Die Welt ist noch nicht bereit für so viel Genialität.
                                </TableCell>
                            </TableRow>
                        ) : (
                            orders.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell>
                                        {order.timestamp ? format(new Date(order.timestamp), "dd.MM.yyyy HH:mm", { locale: de }) : 'N/A'}
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-medium">{order.firstName} {order.lastName}</div>
                                        <div className="text-sm text-muted-foreground">{order.email}</div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={order.orderType?.includes('Bundle') ? 'default' : 'secondary'}>
                                            {order.orderType || 'Unbekannt'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {order.items?.map((item: any, index: number) => (
                                            <div key={index} className="text-sm">{item.title}</div>
                                        ))}
                                    </TableCell>
                                    <TableCell className="text-right font-mono">
                                        {order.totalPrice?.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
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


function EditLegalPageDialog({ page, onOpenChange, open }: { page: LegalPage; open: boolean; onOpenChange: (open: boolean) => void; }) {
    const [updateState, updateFormAction] = useActionState(updateLegalPageAction, initialLegalPageState);
    const { toast } = useToast();

    useEffect(() => {
        if (updateState.success) {
            toast({ title: "Erfolg", description: updateState.message });
            onOpenChange(false);
        }
        if (updateState.error) {
            toast({ variant: "destructive", title: "Fehler", description: updateState.error });
        }
    }, [updateState, toast, onOpenChange]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-4xl">
                <form action={updateFormAction}>
                    <input type="hidden" name="pageId" value={page.id} />
                    <DialogHeader>
                        <DialogTitle>Dynamische LP bearbeiten: /{page.id}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div>
                            <Label htmlFor="title">Seitentitel</Label>
                            <Input id="title" name="title" defaultValue={page.title} required />
                        </div>
                        <div>
                            <Label htmlFor="content">Inhalt (HTML & Tailwind CSS erlaubt)</Label>
                            <Textarea
                                id="content"
                                name="content"
                                defaultValue={page.content}
                                required
                                className="h-96 font-mono"
                                placeholder="<h1>Titel</h1><p class='text-red-500'>Inhalt...</p>"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild><Button type="button" variant="secondary">Abbrechen</Button></DialogClose>
                        <Button type="submit">Änderungen speichern</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}


function LegalPagesManager({ initialPages }: { initialPages: LegalPage[] }) {
    const [pages, setPages] = useState<LegalPage[]>(initialPages);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [editingPage, setEditingPage] = useState<LegalPage | null>(null);
    const { toast } = useToast();

    const [addState, addFormAction] = useActionState(addLegalPageAction, initialLegalPageState);
    const [deleteState, deleteFormAction] = useActionState(deleteLegalPageAction, initialLegalPageState);

    useEffect(() => {
        setPages(initialPages);
    }, [initialPages]);

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
        if (deleteState.success) {
            toast({ title: "Erfolg", description: deleteState.message });
        }
        if (deleteState.error) {
            toast({ variant: "destructive", title: "Fehler", description: deleteState.error });
        }
    }, [deleteState, toast]);

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                 <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline"><PlusCircle className="mr-2 h-4 w-4" /> Neue Dynamische LP</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <form action={addFormAction}>
                            <DialogHeader>
                                <DialogTitle>Neue Dynamische LP hinzufügen</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <Input name="pageId" placeholder="Seiten-ID (slug, z.B. 'neue-seite')" required />
                                <Input name="title" placeholder="Seitentitel" required />
                                <Textarea name="content" placeholder="Inhalt (HTML & Tailwind CSS erlaubt)" required className="h-48 font-mono" />
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
                                            <Button size="sm" variant="outline" onClick={() => setEditingPage(page)}>
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button size="sm" variant="destructive">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <form action={deleteLegalPageAction}>
                                                        <input type="hidden" name="pageId" value={page.id} />
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Sind Sie sicher?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Diese Aktion kann nicht rückgängig gemacht werden. Die Seite /{page.id} wird dauerhaft gelöscht.
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
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
            {editingPage && (
                <EditLegalPageDialog 
                    page={editingPage}
                    open={!!editingPage}
                    onOpenChange={(open) => !open && setEditingPage(null)}
                />
            )}
        </div>
    )
}

export function AdminDashboard({
    initialProducts,
    initialLegalPages,
}: {
    initialProducts: Product[];
    initialLegalPages: LegalPage[];
}) {
    return (
        <Tabs defaultValue="leads" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="leads">Leads / Bestellungen</TabsTrigger>
                <TabsTrigger value="products">Produkte</TabsTrigger>
                <TabsTrigger value="legal">Dynamische LPs</TabsTrigger>
            </TabsList>
            <TabsContent value="leads" className="mt-6">
                <LeadsTable />
            </TabsContent>
            <TabsContent value="products" className="mt-6">
                <ProductsManager initialProducts={initialProducts} />
            </TabsContent>
            <TabsContent value="legal" className="mt-6">
                <LegalPagesManager initialPages={initialLegalPages} />
            </TabsContent>
        </Tabs>
    )
}