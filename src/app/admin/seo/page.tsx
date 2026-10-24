import { getLandingPages, getLegalPages, type SeoMetadata, getAllSeoMetadata } from "@/lib/firestore";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Sparkles, CheckCircle2, XCircle } from "lucide-react";

// Helper function to create a map of slugs to metadata for quick lookup
const createMetadataMap = (metadata: SeoMetadata[]) => {
    const map = new Map<string, SeoMetadata>();
    metadata.forEach(meta => map.set(meta.id, meta));
    return map;
};

export default async function SeoAdminPage() {
    const [landingPages, legalPages, allSeoData] = await Promise.all([
        getLandingPages(),
        getLegalPages(),
        getAllSeoMetadata()
    ]);
    
    const seoMetaMap = createMetadataMap(allSeoData);

    const staticPages = [
        { href: '/', title: 'Homepage', slug: 'home' },
        { href: '/shop', title: 'Shop', slug: 'shop' },
        { href: '/lp2', title: 'LP2 - Countdown', slug: 'lp2' },
        { href: '/lp3', title: 'LP3 - Buch Live', slug: 'lp3' },
        { href: '/lp-series', title: 'LP - Buchserie', slug: 'lp-series' },
        { href: '/lp-pfeifer', title: 'LP - Pfeifer', slug: 'lp-pfeifer' },
        { href: '/lp-risitas', title: 'LP - Risitas', slug: 'lp-risitas' },
        { href: '/lp-luin', title: 'LP - Luin', slug: 'lp-luin' },
        { href: '/exzerpte', title: 'Leseproben Übersicht', slug: 'exzerpte' },
    ];

    const renderTableRow = (item: {slug: string, title: string, pathPrefix?: string}) => {
        const meta = seoMetaMap.get(item.slug);
        const hasTitle = !!meta?.title;
        const hasDesc = !!meta?.metaDescription;
        const getPath = () => {
            if (item.pathPrefix) return `${item.pathPrefix}${item.slug.replace(/^lp-/, '')}`;
            if (item.slug === 'home') return '/';
            return `/${item.slug}`;
        }
        return (
            <TableRow key={item.slug}>
                <TableCell className="font-medium">{item.title}</TableCell>
                <TableCell className="font-mono text-xs">{getPath()}</TableCell>
                <TableCell>{hasTitle ? <CheckCircle2 className="h-5 w-5 text-green-600"/> : <XCircle className="h-5 w-5 text-amber-600" />}</TableCell>
                <TableCell>{hasDesc ? <CheckCircle2 className="h-5 w-5 text-green-600"/> : <XCircle className="h-5 w-5 text-amber-600" />}</TableCell>
                <TableCell className="text-right">
                    <Link href={`/admin/seo/editor/${item.slug}`}>
                        <Button variant="outline" size="sm">
                            <Edit className="mr-2 h-3 w-3"/> Bearbeiten
                        </Button>
                    </Link>
                </TableCell>
            </TableRow>
        );
    };

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-bold font-headline">SEO &amp; AEO Management</h1>
                <p className="text-muted-foreground">Verwalten Sie die Metadaten, um Ihr Ranking in Suchmaschinen und KI-Assistenten zu optimieren.</p>
            </header>

            <div className="grid grid-cols-1 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Landing Pages (LPM)</CardTitle>
                        <CardDescription>SEO für Ihre maßgeschneiderten Landing Pages.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Titel</TableHead>
                                    <TableHead>Pfad</TableHead>
                                    <TableHead>SEO-Titel</TableHead>
                                    <TableHead>SEO-Beschreibung</TableHead>
                                    <TableHead className="text-right">Aktion</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {landingPages.map(lp => renderTableRow({slug: `lp-${lp.slug}`, title: lp.title, pathPrefix: '/lp/'}))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
                
                 <Card>
                    <CardHeader>
                        <CardTitle>Statische &amp; Rechtliche Seiten</CardTitle>
                        <CardDescription>SEO für die Hauptseiten und rechtliche Hinweise.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Titel</TableHead>
                                    <TableHead>Pfad</TableHead>
                                    <TableHead>SEO-Titel</TableHead>
                                    <TableHead>SEO-Beschreibung</TableHead>
                                    <TableHead className="text-right">Aktion</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {staticPages.map(page => renderTableRow({slug: page.slug, title: page.title}))}
                                {legalPages.map(page => renderTableRow({slug: page.id, title: page.title}))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
