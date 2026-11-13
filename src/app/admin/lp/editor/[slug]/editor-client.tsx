
"use client";

import { useState, useEffect, useActionState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { type LandingPage } from "@/lib/firestore";
import { createLandingPageAction, updateLandingPageAction, type LandingPageActionState } from "@/app/admin/lp/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, Code, Eye } from "lucide-react";
import { CodeEditor } from "@/components/admin/code-editor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const initialState: LandingPageActionState = { success: false, error: null };

function generateHtml(page: Partial<LandingPage>) {
    return `
        <!DOCTYPE html>
        <html lang="de">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${page.title || ''}</title>
            <style>${page.cssContent || ''}</style>
        </head>
        <body>
            ${page.htmlContent || ''}
            <script>${page.jsContent || ''}<\/script>
        </body>
        </html>
    `;
}

export function LpEditorClient({ page }: { page?: LandingPage }) {
    const { toast } = useToast();
    const isNew = !page;

    const [title, setTitle] = useState(page?.title || '');
    const [slug, setSlug] = useState(page?.slug || '');
    const [htmlContent, setHtmlContent] = useState(page?.htmlContent || '');
    const [cssContent, setCssContent] = useState(page?.cssContent || '');
    const [jsContent, setJsContent] = useState(page?.jsContent || '');
    const [previewSrcDoc, setPreviewSrcDoc] = useState('');

    useEffect(() => {
        setPreviewSrcDoc(generateHtml({ title, htmlContent, cssContent, jsContent }));
    }, [title, htmlContent, cssContent, jsContent]);

    const action = isNew ? createLandingPageAction : updateLandingPageAction;
    const [state, formAction, isPending] = useActionState(action, initialState);

    useEffect(() => {
        if (state.success) {
            toast({ title: "Erfolg!", description: state.message });
            
            const timer = setTimeout(() => {
                if (isNew && state.newSlug) {
                    window.location.href = `/lp/editor/${state.newSlug}`;
                } else {
                    window.location.href = '/lp';
                }
            }, 500);
            
            return () => clearTimeout(timer);
        }
        if (state.error) {
            toast({ variant: "destructive", title: "Fehler", description: state.error });
        }
    }, [state, isNew]);

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTitle = e.target.value;
        setTitle(newTitle);
        if (isNew) {
            const newSlug = newTitle.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
            setSlug(newSlug);
        }
    };

    return (
        <form action={formAction}>
            {!isNew && <input type="hidden" name="originalSlug" value={page.slug} />}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                    <Label htmlFor="title">Titel</Label>
                    <Input id="title" name="title" value={title} onChange={handleTitleChange} required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="slug">Slug (URL-Pfad unter /lp/)</Label>
                    <Input id="slug" name="slug" value={slug} onChange={(e) => setSlug(e.target.value)} required readOnly={!isNew}/>
                </div>
            </div>

            <Tabs defaultValue="html" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="html"><Code className="mr-2 h-4 w-4" />HTML</TabsTrigger>
                    <TabsTrigger value="css"><Code className="mr-2 h-4 w-4" />CSS</TabsTrigger>
                    <TabsTrigger value="js"><Code className="mr-2 h-4 w-4" />JavaScript</TabsTrigger>
                    <TabsTrigger value="preview"><Eye className="mr-2 h-4 w-4"/>Vorschau</TabsTrigger>
                </TabsList>
                <TabsContent value="html" className="mt-4">
                    <div className="h-[500px]">
                        <CodeEditor value={htmlContent} onChange={setHtmlContent} />
                        <input type="hidden" name="htmlContent" value={htmlContent} />
                    </div>
                </TabsContent>
                <TabsContent value="css" className="mt-4">
                    <div className="h-[500px]">
                        <CodeEditor value={cssContent} onChange={setCssContent} />
                        <input type="hidden" name="cssContent" value={cssContent} />
                    </div>
                </TabsContent>
                <TabsContent value="js" className="mt-4">
                    <div className="h-[500px]">
                        <CodeEditor value={jsContent} onChange={setJsContent} />
                        <input type="hidden" name="jsContent" value={jsContent} />
                    </div>
                </TabsContent>
                 <TabsContent value="preview" className="mt-4">
                    <div className="aspect-video bg-white border rounded-md h-[500px]">
                        <iframe
                            srcDoc={previewSrcDoc}
                            title="Landing Page Preview"
                            sandbox="allow-scripts allow-same-origin"
                            className="w-full h-full"
                        />
                    </div>
                </TabsContent>
            </Tabs>

            <div className="flex justify-end gap-4 mt-6">
                <Link href="/lp">
                    <Button type="button" variant="outline">Abbrechen</Button>
                </Link>
                <Button type="submit" disabled={isPending}>
                    {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    {isNew ? "Landing Page erstellen" : "Änderungen speichern"}
                </Button>
            </div>
        </form>
    );
}
