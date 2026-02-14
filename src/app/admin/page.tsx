
import { getArticles } from "@/lib/firestore";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircle, ArrowUpRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { ArticleActions } from "./article-actions-client";

export default async function AdminArticlesDashboard() {
    const articles = await getArticles();

    return (
        <div className="space-y-6">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold font-headline">Artikelverwaltung</h1>
                    <p className="text-muted-foreground">Erstellen, bearbeiten und löschen Sie hier Ihre satirischen Meisterwerke.</p>
                </div>
                <Link href="/admin/editor/new">
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Neuer Artikel
                    </Button>
                </Link>
            </header>

            <div className="border rounded-lg bg-background">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Titel</TableHead>
                            <TableHead>Kategorie</TableHead>
                            <TableHead>Veröffentlicht</TableHead>
                            <TableHead className="text-right">Aktionen</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {articles.map((article) => (
                            <TableRow key={article.id}>
                                <TableCell className="font-medium">
                                    <Link href={`/a/${article.slug}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:underline">
                                        {article.title}
                                        <ArrowUpRight className="h-3 w-3 text-muted-foreground" />
                                    </Link>
                                </TableCell>
                                <TableCell><Badge variant="secondary">{article.category}</Badge></TableCell>
                                <TableCell>{format(new Date(article.publishedDate), "dd. MMM yyyy", { locale: de })}</TableCell>
                                <TableCell className="text-right">
                                    <ArticleActions article={article} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
