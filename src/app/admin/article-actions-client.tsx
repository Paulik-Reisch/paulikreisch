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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit, MoreHorizontal, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";
import { deleteArticleAction } from "./actions";
import type { Article } from "@/lib/firestore";
import { useToast } from "@/hooks/use-toast";


export function ArticleActions({ article }: { article: Article }) {
  const { toast } = useToast();
  const [state, formAction, isPending] = useActionState(deleteArticleAction, { success: false, error: null });

  useEffect(() => {
    if (state.success) {
      toast({ title: "Erfolg!", description: "Artikel wurde gelöscht." });
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
                    <form action={formAction}>
                        <input type="hidden" name="slug" value={article.slug} />
                        <AlertDialogHeader>
                        <AlertDialogTitle>Sind Sie sicher?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Möchten Sie den Artikel "{article.title}" wirklich endgültig löschen? Diese Aktion kann nicht rückgängig gemacht werden.
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
