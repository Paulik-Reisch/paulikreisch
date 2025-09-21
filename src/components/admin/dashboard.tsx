"use client";

import { useState, useEffect } from "react";
import { 
    getOrders, 
    getProducts, 
    Order, 
    Product, 
    updateProduct, 
    LegalPage, 
    getLegalPages, 
    updateLegalPage,
    addLegalPage,
    addProduct
} from "@/lib/firestore";
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
import { Loader2, RefreshCw, Save, VenetianMask, FileText, PlusCircle } from "lucide-react";
import { Badge } from "../ui/badge";
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

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
                                        {order.timestamp ? format(order.timestamp.toDate(), "dd.MM.yyyy HH:mm", { locale: de }) : 'N/A'}
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

function ProductsManager() {
    const [products, setProducts] = useState<Product[]>([]);
    const [editingProducts, setEditingProducts] = useState<{ [key: string]: Partial<Product> }>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const { toast } = useToast();

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const fetchedProducts = await getProducts();
            setProducts(fetchedProducts);
        } catch (error) {
            console.error("Error fetching products:", error);
            toast({ variant: "destructive", title: "Fehler", description: "Produkte konnten nicht geladen werden." });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleInputChange = (productId: string, field: keyof Product, value: string | number) => {
        setEditingProducts(prev => ({
            ...prev,
            [productId]: { ...prev[productId], [field]: value }
        }));
    };

    const handleSave = async (productId: string) => {
        const productData = editingProducts[productId];
        if (!productData) return;

        setSaving(true);
        try {
            await updateProduct(productId, productData);
            toast({ title: "Gespeichert", description: "Produkt wurde erfolgreich aktualisiert." });
            setEditingProducts(prev => {
                const newEditing = { ...prev };
                delete newEditing[productId];
                return newEditing;
            });
            await fetchProducts(); // Refresh data
        } catch (error) {
            console.error("Error updating product:", error);
            toast({ variant: "destructive", title: "Fehler", description: "Produkt konnte nicht gespeichert werden." });
        } finally {
            setSaving(false);
        }
    };

    const handleAddProduct = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSaving(true);
        const formData = new FormData(event.currentTarget);
        const newProductData = {
            title: formData.get('title') as string,
            subtitle: formData.get('subtitle') as string,
            price: parseFloat(formData.get('price') as string),
            preorderPrice: parseFloat(formData.get('preorderPrice') as string) || undefined,
            amazonLink: formData.get('amazonLink') as string,
            imageSrc: formData.get('imageSrc') as string,
            aiHint: formData.get('aiHint') as string,
            description: formData.get('description') as string,
        };

        try {
            await addProduct(newProductData);
            toast({ title: "Erstellt", description: "Neues Produkt wurde erfolgreich hinzugefügt." });
            setIsAddDialogOpen(false);
            await fetchProducts();
        } catch (error) {
            console.error("Error adding product:", error);
            toast({ variant: "destructive", title: "Fehler", description: "Produkt konnte nicht hinzugefügt werden." });
        } finally {
            setSaving(false);
        }
    };


    return (
        <div>
             <div className="flex justify-between items-center mb-4">
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline"><PlusCircle className="mr-2 h-4 w-4" /> Neues Produkt</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <form onSubmit={handleAddProduct}>
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
                                <Button type="submit" disabled={saving}>
                                    {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Speichern'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
                <Button onClick={fetchProducts} disabled={loading || saving} variant="outline">
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                    Aktualisieren
                </Button>
            </div>
            <div className="border rounded-lg overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Produkt</TableHead>
                            <TableHead>Preis</TableHead>
                            <TableHead>Vorbestell-Preis</TableHead>
                            <TableHead>Amazon Link</TableHead>
                            <TableHead className="text-right">Aktion</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                             <TableRow>
                                <TableCell colSpan={5} className="text-center py-12">
                                    <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
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
                                        <Button
                                            onClick={() => handleSave(product.id)}
                                            disabled={!editingProducts[product.id] || saving}
                                            size="sm"
                                        >
                                            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Save className="mr-2 h-4 w-4" />}
                                            Speichern
                                        </Button>
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

function LegalPagesManager() {
    const [pages, setPages] = useState<LegalPage[]>([]);
    const [editingPages, setEditingPages] = useState<{ [key: string]: Partial<LegalPage> }>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const { toast } = useToast();

    const fetchPages = async () => {
        setLoading(true);
        try {
            const fetchedPages = await getLegalPages();
            setPages(fetchedPages);
        } catch (error) {
            console.error("Error fetching legal pages:", error);
            toast({ variant: "destructive", title: "Fehler", description: "Rechtstexte konnten nicht geladen werden." });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPages();
    }, []);

    const handleInputChange = (pageId: string, field: keyof LegalPage, value: string) => {
        setEditingPages(prev => ({
            ...prev,
            [pageId]: { ...prev[pageId], [field]: value }
        }));
    };
    
    const handleSave = async (pageId: string) => {
        const pageData = editingPages[pageId];
        if (!pageData || !pageData.title || !pageData.content) {
             toast({ variant: "destructive", title: "Fehler", description: "Titel und Inhalt dürfen nicht leer sein." });
            return;
        };

        setSaving(true);
        try {
            await updateLegalPage(pageId, { title: pageData.title, content: pageData.content });
            toast({ title: "Gespeichert", description: `Seite wurde erfolgreich aktualisiert.` });
            setEditingPages(prev => {
                const newEditing = { ...prev };
                delete newEditing[pageId];
                return newEditing;
            });
            await fetchPages();
        } catch (error) {
            console.error("Error updating legal page:", error);
            toast({ variant: "destructive", title: "Fehler", description: "Seite konnte nicht gespeichert werden." });
        } finally {
            setSaving(false);
        }
    };

    const handleAddPage = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSaving(true);
        const formData = new FormData(event.currentTarget);
        const pageId = formData.get('pageId') as string;
        const title = formData.get('title') as string;
        const content = formData.get('content') as string;

        try {
            await addLegalPage(pageId, { title, content });
            toast({ title: "Erstellt", description: "Neue Seite wurde erfolgreich hinzugefügt." });
            setIsAddDialogOpen(false);
            await fetchPages();
        } catch (error: any) {
            console.error("Error adding page:", error);
            toast({ variant: "destructive", title: "Fehler", description: error.message || "Seite konnte nicht hinzugefügt werden." });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                 <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline"><PlusCircle className="mr-2 h-4 w-4" /> Neue Seite</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <form onSubmit={handleAddPage}>
                            <DialogHeader>
                                <DialogTitle>Neue Rechtstexte-Seite hinzufügen</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <Input name="pageId" placeholder="Seiten-ID (slug, z.B. 'agb')" required />
                                <Input name="title" placeholder="Seitentitel" required />
                                <Textarea name="content" placeholder="Inhalt" required className="h-48" />
                            </div>
                            <DialogFooter>
                                <DialogClose asChild><Button type="button" variant="secondary">Abbrechen</Button></DialogClose>
                                <Button type="submit" disabled={saving}>
                                    {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Speichern'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
                <Button onClick={fetchPages} disabled={loading || saving} variant="outline">
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                    Aktualisieren
                </Button>
            </div>
            {loading ? (
                <div className="text-center py-12">
                    <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            ) : pages.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                    <FileText className="mx-auto h-8 w-8 mb-2" />
                    Keine Rechtstexte gefunden.
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {pages.map((page) => {
                        const currentPage = { ...page, ...editingPages[page.id] };
                        return (
                            <Card key={page.id}>
                                <CardHeader>
                                    <CardTitle>Seite: {page.id}</CardTitle>
                                    <CardDescription>Zuletzt aktualisiert: {page.lastUpdated ? format(page.lastUpdated.toDate(), "dd.MM.yyyy HH:mm", { locale: de }) : 'N/A'}</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                     <div>
                                        <Label htmlFor={`title-${page.id}`}>Seitentitel</Label>
                                        <Input
                                            id={`title-${page.id}`}
                                            value={currentPage.title ?? ''}
                                            onChange={(e) => handleInputChange(page.id, 'title', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor={`content-${page.id}`}>Inhalt (unterstützt Paragraphen via Leerzeile)</Label>
                                         <Textarea
                                            id={`content-${page.id}`}
                                            value={currentPage.content ?? ''}
                                            onChange={(e) => handleInputChange(page.id, 'content', e.target.value)}
                                            className="h-64"
                                            placeholder="Geben Sie hier den Inhalt ein. Absätze werden durch Leerzeilen erzeugt."
                                        />
                                    </div>
                                    <Button
                                        onClick={() => handleSave(page.id)}
                                        disabled={!editingPages[page.id] || saving}
                                        className="w-full"
                                    >
                                        {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Save className="mr-2 h-4 w-4" />}
                                        Änderungen speichern
                                    </Button>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    )
}

export function AdminDashboard() {
    return (
        <Tabs defaultValue="leads" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="leads">Leads / Bestellungen</TabsTrigger>
                <TabsTrigger value="products">Produkte</TabsTrigger>
                <TabsTrigger value="legal">Rechtstexte</TabsTrigger>
            </TabsList>
            <TabsContent value="leads" className="mt-6">
                <LeadsTable />
            </TabsContent>
            <TabsContent value="products" className="mt-6">
                <ProductsManager />
            </TabsContent>
            <TabsContent value="legal" className="mt-6">
                <LegalPagesManager />
            </TabsContent>
        </Tabs>
    )
}
