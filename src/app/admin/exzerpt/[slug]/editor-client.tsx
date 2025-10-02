
"use client";

import { useState, useEffect, useActionState, useTransition } from "react";
import Link from "next/link";
import { Excerpt } from "@/lib/firestore";
import { updateExcerptAction } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Loader2,
  Save,
  ArrowLeft,
  Eye,
  Code,
  BookOpen
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodeEditor } from "@/components/admin/code-editor";

const initialExcerptState = { success: false, error: null, message: '' };

export function ExcerptEditorClient({ excerpt }: { excerpt: Excerpt }) {
  const [title, setTitle] = useState(excerpt.title);
  const [content, setContent] = useState(excerpt.content);
  
  const [updateState, updateFormAction] = useActionState(updateExcerptAction, initialExcerptState);

  const { toast } = useToast();
  const [isSaving, startSavingTransition] = useTransition();

  useEffect(() => {
    if (updateState.success) {
      toast({ title: "Erfolg", description: updateState.message });
    }
    if (updateState.error) {
      toast({ variant: "destructive", title: "Fehler", description: updateState.error });
    }
  }, [updateState, toast]);

  const handleFormSubmit = (formData: FormData) => {
    startSavingTransition(() => {
        formData.set('slug', excerpt.slug);
        formData.set('title', title);
        formData.set('content', content);
        updateFormAction(formData);
    });
  };

  return (
    <div className="grid md:grid-cols-[380px_1fr] h-full gap-6">
        {/* Sidebar */}
        <div className="flex flex-col bg-background border rounded-lg h-full">
            <div className="p-4 border-b flex items-center justify-between">
                 <Link href="/admin">
                    <Button variant="outline" size="sm">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Zurück zum Dashboard
                    </Button>
                </Link>
            </div>
            <div className="p-4 space-y-4 flex-grow overflow-y-auto">
                 <div>
                    <Label htmlFor="title">Titel</Label>
                    <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                 <div className="text-sm text-muted-foreground">
                    Kapitel-Nummer: {excerpt.chapterNumber}
                </div>
            </div>
            <div className="p-4 border-t">
                <form action={handleFormSubmit}>
                     <Button type="submit" disabled={isSaving} className="w-full">
                        {isSaving ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Wird gespeichert...
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" />
                                Exzerpt speichern
                            </>
                        )}
                    </Button>
                </form>
            </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 flex flex-col p-4 md:p-6 overflow-y-auto h-full bg-background border rounded-lg">
             <Tabs defaultValue="code" className="w-full h-full flex flex-col">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="preview"><Eye className="mr-2 h-4 w-4"/>Vorschau</TabsTrigger>
                     <TabsTrigger value="code"><Code className="mr-2 h-4 w-4"/>HTML-Code</TabsTrigger>
                </TabsList>
                <TabsContent value="preview" className="mt-4 flex-grow bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
                     <iframe
                        srcDoc={`<html><head><link href="/globals.css" rel="stylesheet"><script src="https://cdn.tailwindcss.com"></script></head><body class="bg-background text-foreground"><div class="prose dark:prose-invert max-w-none p-4">${content}</div></body></html>`}
                        title="Vorschau"
                        className="w-full h-full border bg-white"
                    />
                </TabsContent>
                <TabsContent value="code" className="mt-4 flex-grow flex flex-col min-h-0">
                    <div className="flex-grow min-h-0">
                         <CodeEditor 
                            value={content}
                            onChange={setContent}
                        />
                    </div>
                </TabsContent>
            </Tabs>
        </main>
    </div>
  );
}
