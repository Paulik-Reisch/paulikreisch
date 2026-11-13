
"use client";

import { useState, useEffect, useActionState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { type Author } from "@/lib/firestore";
import { createAuthorAction, updateAuthorAction, type AuthorActionState } from "@/app/admin/authors/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save } from "lucide-react";

const initialState: AuthorActionState = { success: false, error: null };

export function AuthorEditorClient({ author }: { author?: Author }) {
  const router = useRouter();
  const { toast } = useToast();
  const isNew = !author;

  const [slug, setSlug] = useState(author?.slug || '');

  const action = isNew ? createAuthorAction : updateAuthorAction;
  const [state, formAction, isPending] = useActionState(action, initialState);

  useEffect(() => {
    if (state.success) {
      toast({ title: "Erfolg!", description: state.message });
      
      const timer = setTimeout(() => {
        if (isNew && state.newSlug) {
            router.push(`/authors/editor/${state.newSlug}`);
        } else {
            router.push('/authors');
            router.refresh();
        }
      }, 500);
      
      return () => clearTimeout(timer);
    }
    if (state.error) {
      toast({ variant: "destructive", title: "Fehler", description: state.error });
    }
  }, [state, isNew, author?.slug, router, toast]);
  
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isNew) {
        const newFirstName = (document.getElementById('firstName') as HTMLInputElement).value;
        const newLastName = (document.getElementById('lastName') as HTMLInputElement).value;
        const newSlug = `${newFirstName} ${newLastName}`.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        setSlug(newSlug);
    }
  }

  return (
    <form action={formAction} className="space-y-6">
      {!isNew && <input type="hidden" name="originalSlug" value={author.slug} />}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="firstName">Vorname</Label>
          <Input id="firstName" name="firstName" defaultValue={author?.firstName} onChange={handleNameChange} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Nachname</Label>
          <Input id="lastName" name="lastName" defaultValue={author?.lastName} onChange={handleNameChange} required />
        </div>
      </div>
      
       <div className="space-y-2">
          <Label htmlFor="slug">Slug (URL-Pfad)</Label>
          <Input id="slug" name="slug" value={slug} onChange={(e) => setSlug(e.target.value)} required />
        </div>
      
       <div className="space-y-2">
            <Label htmlFor="profilePictureUrl">Profilbild-URL</Label>
            <Input id="profilePictureUrl" name="profilePictureUrl" defaultValue={author?.profilePictureUrl || 'https://picsum.photos/seed/author-placeholder/200/200'} required />
        </div>
        <div className="space-y-2">
            <Label htmlFor="websiteUrl">Website-URL (optional)</Label>
            <Input id="websiteUrl" name="websiteUrl" defaultValue={author?.websiteUrl} />
        </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Biografie</Label>
        <Textarea id="bio" name="bio" defaultValue={author?.bio || ''} required rows={5}/>
      </div>

      <div className="flex justify-end gap-4">
        <Link href="/authors">
            <Button type="button" variant="outline">Abbrechen</Button>
        </Link>
        <Button type="submit" disabled={isPending}>
          {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          {isNew ? "Autor erstellen" : "Änderungen speichern"}
        </Button>
      </div>
    </form>
  );
}
