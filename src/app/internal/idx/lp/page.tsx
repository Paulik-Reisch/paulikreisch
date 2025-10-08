
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getLegalPages, getPublishedExcerpts } from "@/lib/firestore";
import { Edit, PlusCircle } from "lucide-react";
import Link from "next/link";

// This is a simplified representation. In a real app, this might come from a DB or a more complex source.
const staticLPs = [
    { href: '/', title: 'Homepage' },
    { href: '/lp2', title: 'LP2 - Excerpt Gate' },
    { href: '/lp3', title: 'LP3 - Book is Live' },
    { href: '/lp-series', title: 'LP - Buchserie' },
    { href: '/lp-pfeifer', title: 'LP - Pfeifer' },
    { href: '/lp-risitas', title: 'LP - Risitas' },
    { href: '/lp-luin', title: 'LP - Luin' },
    { href: '/lp-mietenwahnsinn', title: 'LP - Mietenwahnsinn' },
];

export default async function LandingPageManager() {
    const dynamicPages = await getLegalPages();
    const excerptPages = await getPublishedExcerpts();

    return (
        <div className="space-y-8">
            <header className="flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-medium text-gray-900">Landing Page Management (IDX-LP)</h1>
                    <p className="text-sm text-gray-500 mt-1">Übersicht und Verwaltung aller Landing Pages.</p>
                </div>
                <Button className="gcp-button-primary">
                    <PlusCircle className="mr-2 h-4 w-4"/>
                    Neue LP erstellen
                </Button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="gcp-card">
                    <CardHeader>
                        <CardTitle>Dynamische Seiten</CardTitle>
                        <CardDescription>Seiten, die über den visuellen Editor verwaltet werden.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                             <TableHeader>
                                <TableRow>
                                    <TableHead>Titel</TableHead>
                                    <TableHead>Pfad</TableHead>
                                    <TableHead className="text-right">Aktion</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {dynamicPages.map(page => (
                                    <TableRow key={page.id}>
                                        <TableCell className="font-medium">{page.title}</TableCell>
                                        <TableCell className="text-muted-foreground font-mono text-xs">/{page.id}</TableCell>
                                        <TableCell className="text-right">
                                            <Link href={`/internal/idx/lp/editor/${page.id}`}>
                                                <Button className="gcp-button" size="sm">
                                                    <Edit className="mr-2 h-3 w-3"/> Bearbeiten
                                                </Button>
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
                 <Card className="gcp-card">
                    <CardHeader>
                        <CardTitle>Statische & Vorlagen-Seiten</CardTitle>
                        <CardDescription>Feste Seiten, die direkt im Code definiert sind.</CardDescription>
                    </CardHeader>
                    <CardContent>
                       <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Titel</TableHead>
                                    <TableHead>Pfad</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {staticLPs.map(page => (
                                     <TableRow key={page.href}>
                                        <TableCell className="font-medium">{page.title}</TableCell>
                                        <TableCell className="text-muted-foreground font-mono text-xs">{page.href}</TableCell>
                                    </TableRow>
                                ))}
                                {excerptPages.map(page => (
                                     <TableRow key={page.id}>
                                        <TableCell className="font-medium">{page.title} (Exzerpt)</TableCell>
                                        <TableCell className="text-muted-foreground font-mono text-xs">/exzerpt/{page.slug}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
