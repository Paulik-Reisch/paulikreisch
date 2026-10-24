
import { getAuthors } from "@/lib/firestore";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AuthorActions } from "./author-actions-client";

export default async function AuthorsAdminPage() {
    const authors = await getAuthors();

    return (
        <div className="space-y-6">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold font-headline">Autorenverwaltung</h1>
                    <p className="text-muted-foreground">Verwalten Sie hier die Autorenprofile.</p>
                </div>
                <Link href="/admin/authors/editor/new">
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Neuen Autor anlegen
                    </Button>
                </Link>
            </header>

            <div className="border rounded-lg bg-background">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Slug</TableHead>
                            <TableHead>Website</TableHead>
                            <TableHead className="text-right">Aktionen</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {authors.map((author) => (
                            <TableRow key={author.id}>
                                <TableCell className="font-medium flex items-center gap-4">
                                    <Avatar>
                                        <AvatarImage src={author.profilePictureUrl} alt={`${author.firstName} ${author.lastName}`} />
                                        <AvatarFallback>{author.firstName.charAt(0)}{author.lastName.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <span>{author.firstName} {author.lastName}</span>
                                </TableCell>
                                <TableCell className="font-mono text-xs">{author.slug}</TableCell>
                                <TableCell>
                                    <a href={author.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                                        {author.websiteUrl}
                                    </a>
                                </TableCell>
                                <TableCell className="text-right">
                                    <AuthorActions author={author} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
