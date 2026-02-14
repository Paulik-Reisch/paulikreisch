"use client";

import { useState, useEffect, useActionState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { type Article } from "@/lib/firestore";
import { createArticleAction, updateArticleAction, type ArticleActionState } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save } from "lucide-react";
import { CodeEditor } from "@/components/admin/code-editor";

const initialState: ArticleActionState = { success: false, error: null };

export function ArticleEditorClient({ article }: { article?: Article }) {
  const router = useRouter();
  const { toast } = useToast();
  const isNew = !article;

  const [slug, setSlug] = useState(article?.slug || '');

  const action = isNew ? createArticleAction : updateArticleAction;
  const [state, formAction, isPending] = useActionState(action, initialState);

  useEffect(() => {
    if (state.success) {
      toast({ title: "Erfolg!", description: state.message });
      
      const timer = setTimeout(() => {
        if (isNew && state.newSlug) {
            router.push(`/admin/editor/${state.newSlug}`);
        } else if (!isNew && state.newSlug) {
            if (article?.slug !== state.newSlug) {
                router.push(`/admin/editor/${state.newSlug}`);
            } else {
                router.refresh();
            }
        } else if (!isNew) {
            router.push('/admin');
            router.refresh();
        }
      }, 500);
      
      return () => clearTimeout(timer);
    }
    if (state.error) {
      toast({ variant: "destructive", title: "Fehler", description: state.error });
    }
  }, [state, isNew, article?.slug, router, toast]);
  
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isNew) {
        const newTitle = e.target.value;
        const newSlug = newTitle.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        setSlug(newSlug);
    }
  }

  return (
    <form action={formAction} className="space-y-6">
      {!isNew && <input type="hidden" name="originalSlug" value={article.slug} />}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="title">Titel</Label>
          <Input id="title" name="title" defaultValue={article?.title} onChange={handleTitleChange} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">Slug (URL-Pfad)</Label>
          <Input id="slug" name="slug" value={slug} onChange={(e) => setSlug(e.target.value)} required />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
            <Label htmlFor="category">Kategorie</Label>
            <Input id="category" name="category" defaultValue={article?.category} required />
        </div>
        <div className="space-y-2">
            <Label htmlFor="readTime">Lesezeit (in Minuten)</Label>
            <Input id="readTime" name="readTime" type="number" defaultValue={article?.readTime} required />
        </div>
      </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <Label htmlFor="imageUrl">Bild-URL</Label>
                <Input id="imageUrl" name="imageUrl" defaultValue={article?.imageUrl} required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="imageAlt">Bild-Alternativtext</Label>
                <Input id="imageAlt" name="imageAlt" defaultValue={article?.imageAlt} required />
            </div>
       </div>

      <div className="space-y-2">
        <Label htmlFor="teaser">Teaser (HTML)</Label>
        <div className="min-h-[150px]">
            <CodeEditor
                value={article?.teaser || ''}
                onChange={(value) => {
                    const teaserInput = document.getElementById('teaser-input') as HTMLInputElement;
                    if(teaserInput) teaserInput.value = value;
                }}
            />
            <input type="hidden" id="teaser-input" name="teaser" defaultValue={article?.teaser || ''} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Inhalt (HTML)</Label>
        <div className="min-h-[400px]">
            <CodeEditor
                value={article?.content || ''}
                onChange={(value) => {
                    // This is a bit tricky with server actions. We need a hidden input.
                    const contentInput = document.getElementById('content-input') as HTMLInputElement;
                    if(contentInput) contentInput.value = value;
                }}
            />
             <input type="hidden" id="content-input" name="content" defaultValue={article?.content || ''} />
        </div>
      </div>

       <div className="flex items-center space-x-2">
        <Checkbox id="isFree" name="isFree" defaultChecked={article?.isFree ?? true} />
        <Label htmlFor="isFree">Dieser Artikel ist für alle frei zugänglich.</Label>
      </div>

      <div className="flex justify-end gap-4">
        <Link href="/admin">
            <Button type="button" variant="outline">Abbrechen</Button>
        </Link>
        <Button type="submit" disabled={isPending}>
          {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          {isNew ? "Artikel erstellen" : "Änderungen speichern"}
        </Button>
      </div>
    </form>
  );
}