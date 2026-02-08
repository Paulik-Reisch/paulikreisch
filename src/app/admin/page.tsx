
import { getArticles } from "@/lib/firestore";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircle, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { de } from "date-fns/locale";
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
import { deleteArticleAction } from "./actions";

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
                                <TableCell className="font-medium">{article.title}</TableCell>
                                <TableCell><Badge variant="secondary">{article.category}</Badge></TableCell>
                                <TableCell>{format(new Date(article.publishedDate), "dd. MMM yyyy", { locale: de })}</TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <Link href={`/admin/editor/${article.slug}`}>
                                                <DropdownMenuItem>
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Bearbeiten
                                                </DropdownMenuItem>
                                            </Link>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Löschen
                                                    </DropdownMenuItem>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <form action={deleteArticleAction}>
                                                        <input type="hidden" name="slug" value={article.slug} />
                                                        <AlertDialogHeader>
                                                        <AlertDialogTitle>Sind Sie sicher?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Möchten Sie den Artikel "{article.title}" wirklich endgültig löschen? Diese Aktion kann nicht rückgängig gemacht werden.
                                                        </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                        <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                                                        <Button type="submit" variant="destructive">Löschen</Button>
                                                        </AlertDialogFooter>
                                                    </form>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
