
import { getLandingPages } from "@/lib/firestore";
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
import { format } from "date-fns";
import { de } from "date-fns/locale";

export default async function LandingPagesAdminPage() {
    const landingPages = await getLandingPages();

    return (
        <div className="space-y-6">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold font-headline">Landing Page Manager</h1>
                    <p className="text-muted-foreground">Erstellen, bearbeiten und verwalten Sie hier Ihre Landing Pages.</p>
                </div>
                <Link href="/admin/lp/editor/new">
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Neue Landing Page
                    </Button>
                </Link>
            </header>

            <div className="border rounded-lg bg-background">
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
                        {landingPages.map((page) => (
                            <TableRow key={page.id}>
                                <TableCell className="font-medium">{page.title}</TableCell>
                                <TableCell className="font-mono text-xs">/lp/{page.slug}</TableCell>
                                <TableCell>{format(new Date(page.lastUpdated), "dd. MMM yyyy 'um' HH:mm", { locale: de })}</TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <Link href={`/admin/lp/editor/${page.slug}`}>
                                                <DropdownMenuItem>
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Bearbeiten
                                                </DropdownMenuItem>
                                            </Link>
                                            {/* Delete action will be added later */}
                                            <DropdownMenuItem disabled className="text-destructive focus:text-destructive focus:bg-destructive/10">
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Löschen (demnächst)
                                            </DropdownMenuItem>
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
