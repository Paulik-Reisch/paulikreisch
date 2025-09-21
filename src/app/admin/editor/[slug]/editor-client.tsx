"use client";

import { useState, useEffect } from "react";
import { useActionState } from "react";
import Link from "next/link";
import { LegalPage } from "@/lib/firestore";
import { updateLegalPageAction } from "@/app/admin/actions";
import { CodeEditor } from "@/components/admin/code-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, ArrowLeft } from "lucide-react";
import { useFormStatus } from "react-dom";

type AdminLegalPageState = {
  success: boolean;
  error: string | null;
  message?: string;
};
const initialLegalPageState: AdminLegalPageState = { success: false, error: null };

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Wird gespeichert...
                </>
            ) : (
                <>
                    <Save className="mr-2 h-4 w-4" />
                    Änderungen speichern
                </>
            )}
        </Button>
    )
}

export function EditorClient({ page }: { page: LegalPage }) {
  const [content, setContent] = useState(page.content);
  const [updateState, updateFormAction] = useActionState(updateLegalPageAction, initialLegalPageState);
  const { toast } = useToast();

  useEffect(() => {
    if (updateState.success) {
      toast({ title: "Erfolg", description: updateState.message });
    }
    if (updateState.error) {
      toast({ variant: "destructive", title: "Fehler", description: updateState.error });
    }
  }, [updateState, toast]);

  const handleFormSubmit = (formData: FormData) => {
    formData.set('content', content);
    updateFormAction(formData);
  };

  return (
    <form action={handleFormSubmit} className="flex-1 flex flex-col gap-6">
        <div className="flex items-center justify-between gap-4">
            <Link href="/admin">
                <Button variant="outline" size="sm">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Zurück zum Dashboard
                </Button>
            </Link>
            <h1 className="text-2xl font-bold font-headline">Editor: /{page.id}</h1>
            <SubmitButton />
        </div>
      <input type="hidden" name="pageId" value={page.id} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
            <Label htmlFor="title">Seitentitel</Label>
            <Input id="title" name="title" defaultValue={page.title} required />
        </div>
        <div className="text-sm text-muted-foreground self-end">
            Zuletzt aktualisiert: {new Date(page.lastUpdated).toLocaleString('de-DE')}
        </div>
      </div>
      <div className="flex-1 flex flex-col min-h-0">
        <Label htmlFor="content">Inhalt (HTML & Tailwind CSS)</Label>
        <CodeEditor value={content} onChange={setContent} />
      </div>
    </form>
  );
}
