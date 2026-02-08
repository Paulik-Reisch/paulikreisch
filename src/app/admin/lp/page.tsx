
import { getLandingPages } from "@/lib/firestore";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { LandingPageActions } from "./landing-page-actions-client";

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
                                    <LandingPageActions page={page} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
