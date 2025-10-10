

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getLegalPages, getPublishedExcerpts, getAllSeoMetadata, SeoMetadata } from "@/lib/firestore";
import { Edit, PlusCircle, Globe, FileText, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

type PageDefinition = {
  path: string;
  title: string;
  type: 'Statisch' | 'Dynamisch' | 'Exzerpt';
  seoData?: SeoMetadata;
};

// These are the static pages defined in the codebase
const staticLPs = [
    { path: '/', title: 'Homepage' },
    { path: '/buchhandlung-paulik-reisch', title: 'Buchhandlung' },
    { path: '/lp2', title: 'LP2 - Excerpt Gate' },
    { path: '/lp3', title: 'LP3 - Book is Live' },
    { path: '/lp-series', title: 'LP - Buchserie' },
    { path: '/lp-pfeifer', title: 'LP - Pfeifer' },
    { path: '/lp-risitas', title: 'LP - Risitas' },
    { path: '/lp-luin', title: 'LP - Luin' },
    { path: '/los-chipirones', title: 'LP - Los Chipirones' },
];

export default async function SeoDashboardPage() {
    const dynamicPages = await getLegalPages();
    const excerptPages = await getPublishedExcerpts();
    const allSeoData = await getAllSeoMetadata();

    const seoDataMap = new Map(allSeoData.map(data => [data.id, data]));

    const allPages: PageDefinition[] = [
        ...staticLPs.map(p => ({ ...p, type: 'Statisch' as const, seoData: seoDataMap.get(p.path.replace('/', '') || 'home') })),
        ...dynamicPages.map(p => ({ path: `/${p.id}`, title: p.title, type: 'Dynamisch' as const, seoData: seoDataMap.get(p.id) })),
        ...excerptPages.map(p => ({ path: `/exzerpt/${p.slug}`, title: p.title, type: 'Exzerpt' as const, seoData: seoDataMap.get(`exzerpt-${p.slug}`) }))
    ].sort((a,b) => a.path.localeCompare(b.path));

    const getStatus = (seoData?: SeoMetadata) => {
        if (!seoData) return { text: 'Fehlt', variant: 'destructive' as const };
        if (seoData.title && seoData.metaDescription) return { text: 'Optimiert', variant: 'default' as const };
        return { text: 'Unvollständig', variant: 'secondary' as const };
    }

    return (
        <div className="flex flex-col min-h-[100dvh] bg-background text-foreground p-4 md:p-6">
            <header className="flex justify-between items-center mb-8">
                <div className="space-y-1">
                    <h1 className="font-headline text-4xl font-bold tracking-tighter">SEO-Zentrale</h1>
                    <p className="text-muted-foreground">Verwalten Sie hier alle Metadaten für Ihre Seiten.</p>
                </div>
                 <Link href="/admin">
                     <Button variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Zurück zum Dashboard</Button>
                </Link>
            </header>
            
             <Card>
                <CardHeader>
                    <CardTitle>Seiten-Übersicht</CardTitle>
                    <CardDescription>Hier finden Sie alle indexierbaren Seiten Ihrer Webpräsenz. Klicken Sie auf "Bearbeiten", um die SEO-Daten zu verwalten.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Seitentitel</TableHead>
                                <TableHead>URL-Pfad</TableHead>
                                <TableHead>Typ</TableHead>
                                <TableHead>SEO-Status</TableHead>
                                <TableHead className="text-right">Aktion</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {allPages.map(page => {
                                const status = getStatus(page.seoData);
                                const slug = page.path.startsWith('/exzerpt/') 
                                    ? `exzerpt-${page.path.split('/')[2]}`
                                    : page.path.replace('/', '') || 'home';
                                return (
                                    <TableRow key={page.path}>
                                        <TableCell className="font-medium">{page.title}</TableCell>
                                        <TableCell><code className="text-sm text-muted-foreground">{page.path}</code></TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{page.type}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={status.variant}>{status.text}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Link href={`/admin/seo/editor/${slug}`}>
                                                <Button size="sm">
                                                    <Edit className="mr-2 h-4 w-4"/> Bearbeiten
                                                </Button>
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

        </div>
    );
}
