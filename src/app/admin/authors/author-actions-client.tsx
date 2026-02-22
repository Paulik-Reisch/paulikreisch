
'use client';

import { useActionState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogCancel
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit, MoreHorizontal, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";
import { deleteAuthorAction } from "./actions";
import type { Author } from "@/lib/firestore";
import { useToast } from "@/hooks/use-toast";


export function AuthorActions({ author }: { author: Author }) {
  const { toast } = useToast();
  const [state, formAction, isPending] = useActionState(deleteAuthorAction, { success: false, error: null });

  useEffect(() => {
    if (state.success) {
      toast({ title: "Erfolg!", description: "Autor wurde gelöscht." });
    }
    if (state.error) {
      toast({ variant: "destructive", title: "Fehler", description: state.error });
    }
  }, [state, toast]);

  return (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
            <Link href={`/admin/authors/editor/${author.slug}`}>
                <DropdownMenuItem>
                    <Edit className="mr-2 h-4 w-4" />
                    Bearbeiten
                </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Löschen
                    </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <form action={formAction}>
                        <input type="hidden" name="slug" value={author.slug} />
                        <AlertDialogHeader>
                        <AlertDialogTitle>Sind Sie sicher?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Möchten Sie den Autor "{author.firstName} {author.lastName}" wirklich endgültig löschen? Diese Aktion kann nicht rückgängig gemacht werden.
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                        <Button type="submit" variant="destructive" disabled={isPending}>
                            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
                            Löschen
                        </Button>
                        </AlertDialogFooter>
                    </form>
                </AlertDialogContent>
            </AlertDialog>
        </DropdownMenuContent>
    </DropdownMenu>
  );
}
