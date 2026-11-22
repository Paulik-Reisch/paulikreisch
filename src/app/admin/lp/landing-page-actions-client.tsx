'use client';

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
import { Edit, MoreHorizontal, Trash2 } from "lucide-react";
import Link from "next/link";
import { useActionState } from 'react';
import { deleteLandingPageAction } from "./actions";
import type { LandingPage } from "@/lib/firestore";

export function LandingPageActions({ page }: { page: LandingPage }) {
  const [state, action, pending] = useActionState(deleteLandingPageAction, { success: false, error: null });
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={`Aktionen für ${page.title}`}>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <Link href={`/lp/editor/${page.slug}`}>
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
            <form action={action}>
              {state.error && <p role="alert">{state.error}</p>}
              <input type="hidden" name="slug" value={page.slug} />
              <AlertDialogHeader>
                <AlertDialogTitle>Sind Sie sicher?</AlertDialogTitle>
                <AlertDialogDescription>
                  Möchten Sie die Landing Page "{page.title}" wirklich endgültig löschen? Diese Aktion kann nicht rückgängig gemacht werden.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                <Button type="submit" variant="destructive" disabled={pending}>Löschen</Button>
              </AlertDialogFooter>
            </form>
          </AlertDialogContent>
        </AlertDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
