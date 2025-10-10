"use client";

import { useState, useEffect, useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { SeoMetadata } from "@/lib/firestore";
import { updateSeoMetadataAction } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Loader2,
  Save,
  ArrowLeft,
  Search,
  Share2,
  Bot,
  Code2,
  Cog,
  Brain,
  Twitter,
  Globe,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const seoConfig = {
    tabs: [
      { name: "Basic SEO", icon: Search, fields: [ "title", "metaDescription", "canonicalUrl", "keywords" ], description: "Grundlegende Suchmaschinenoptimierung" },
      { name: "Social Media", icon: Share2, fields: [ "ogTitle", "ogDescription", "ogImage", "ogImageAlt", "ogType", "ogSiteName" ], description: "Open Graph für Facebook, LinkedIn, etc." },
      { name: "Twitter/X", icon: Twitter, fields: [ "twitterCard", "twitterSite", "twitterCreator", "twitterTitle", "twitterDescription", "twitterImage" ], description: "Twitter Cards für X" },
      { name: "KI-Optimierung", icon: Bot, fields: [ "aiSummary", "aiKeywords", "aiEntities", "aiContext", "aiQuestions", "contentStructure" ], description: "Optimierung für ChatGPT, Claude & Co." },
      { name: "Schema.org", icon: Code2, fields: [ "schemaType", "articleType", "authorName", "publisher", "datePublished", "dateModified" ], description: "Strukturierte Daten für Rich Snippets" },
      { name: "Technisch", icon: Cog, fields: [ "robots", "language", "geoTargeting" ], description: "Technische SEO-Einstellungen" },
      { name: "Erweiterte KI", icon: Brain, fields: [ "answerSnippets", "contentChunks", "semanticRelations", "citationData" ], description: "Fortgeschrittene AI Search Optimization" },
    ],
};

const fieldDescriptions: Record<string, string> = {
    title: "HTML Title Tag. 50-60 Zeichen.",
    metaDescription: "Vorschautext in Suchergebnissen. 150-160 Zeichen.",
    canonicalUrl: "Eindeutige URL zur Vermeidung von Duplicate Content.",
    keywords: "3-5 Haupt-Keywords, Komma-getrennt.",
    ogTitle: "Titel für Social Media Shares. Emotionaler & ansprechender.",
    ogDescription: "Beschreibung für Social Media. 100-160 Zeichen.",
    ogImage: "Vorschaubild (URL). Ideal: 1200x630px.",
    ogImageAlt: "Alternativtext für das Vorschaubild.",
    ogType: "Art des Inhalts (z.B. article, website).",
    ogSiteName: "Name der Website (z.B. Paulik & Reisch).",
    twitterCard: "Card-Typ (z.B. summary_large_image).",
    twitterSite: "Twitter Handle der Website (@username).",
    twitterCreator: "Twitter Handle des Autors (@username).",
    twitterTitle: "Twitter-spezifischer Titel (unter 70 Zeichen).",
    twitterDescription: "Twitter-spezifische Beschreibung (unter 200 Zeichen).",
    twitterImage: "Twitter-spezifisches Bild (URL).",
    aiSummary: "Kurze, faktische Zusammenfassung für KIs (2-3 Sätze).",
    aiKeywords: "Semantische Begriffe und Synonyme für KI-Verständnis.",
    aiEntities: "Benannte Entitäten (Personen, Orte, Organisationen).",
    aiContext: "Kontext (Genre, Zielgruppe, Intention).",
    aiQuestions: "Fragen, die der Inhalt beantwortet (FAQ-Format).",
    contentStructure: "Strukturelle Hinweise (z.B. Charakteranalyse, Anekdoten).",
    schemaType: "Haupt-Schema.org Typ (z.B. Article, Product).",
    articleType: "Spezifischer Artikel-Typ (z.B. SatiricalArticle).",
    authorName: "Autor(en) des Inhalts.",
    publisher: "Herausgeber/Organisation.",
    datePublished: "Veröffentlichungsdatum (YYYY-MM-DD).",
    dateModified: "Letztes Änderungsdatum (YYYY-MM-DD).",
    robots: "Anweisungen für Crawler (z.B. index, follow).",
    language: "Sprache des Inhalts (ISO 639-1 Code, z.B. de).",
    geoTargeting: "Geografische Zielgruppe (ISO 3166-1 Code, z.B. DE).",
    answerSnippets: "Direkte Antworten für AI-Suchanfragen (JSON-Array).",
    contentChunks: "Modulare Inhaltsblöcke für AI-Parsing (JSON-Array).",
    semanticRelations: "Semantische Verbindungen zu anderen Inhalten (JSON-Array).",
    citationData: "Faktische, überprüfbare Aussagen für Zitate (JSON-Array)."
};


type SeoEditorClientProps = {
  initialData: Partial<SeoMetadata>;
  pageTitle: string;
  pageSlug: string;
};

const initialFormState = { success: false, error: null, message: '' };

function SaveButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} className="w-full">
            {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Speichern
        </Button>
    )
}

export function SeoEditorClient({ initialData, pageTitle, pageSlug }: SeoEditorClientProps) {
  const [formData, setFormData] = useState(initialData);
  const { toast } = useToast();
  const [state, formAction] = useActionState(updateSeoMetadataAction, initialFormState);

  useEffect(() => {
    if (state.success) {
      toast({ title: "Gespeichert!", description: state.message });
    }
    if (state.error) {
      toast({ variant: "destructive", title: "Fehler", description: state.error });
    }
  }, [state]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form action={formAction} className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
        {/* --- Left Sidebar --- */}
        <div className="lg:col-span-1 flex flex-col h-full">
            <header className="p-4 border-b">
                 <Link href="/admin/seo">
                    <Button variant="outline" className="mb-4">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Zurück zur Übersicht
                    </Button>
                </Link>
                <h1 className="font-headline text-2xl font-bold tracking-tight">SEO-Editor</h1>
                <p className="text-muted-foreground text-sm">Seite: <span className="font-semibold">{pageTitle}</span></p>
                <code className="text-xs text-muted-foreground">/{pageSlug}</code>
            </header>
            <div className="p-4 flex-grow overflow-y-auto">
                <Tabs defaultValue="google" orientation="vertical">
                    <TabsContent value="google" className="w-full mt-0">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-base"><Globe className="h-4 w-4"/> Google-Vorschau</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">{`https://paulik-reisch.de/${pageSlug}`}</p>
                                    <h3 className="text-blue-700 text-xl font-medium group-hover:underline">{formData.title || pageTitle}</h3>
                                    <p className="text-sm text-gray-600">{formData.metaDescription || "Keine Meta-Beschreibung vorhanden. Dies kann die Klickrate negativ beeinflussen."}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
            <footer className="p-4 border-t mt-auto">
                 <input type="hidden" name="slug" value={pageSlug} />
                 {Object.entries(formData).map(([key, value]) => {
                     if (key !== 'id') {
                         return <input key={key} type="hidden" name={key} value={value || ''} />
                     }
                     return null;
                 })}
                <SaveButton />
            </footer>
        </div>
        
        {/* --- Main Content --- */}
        <main className="lg:col-span-2 border rounded-lg h-full overflow-hidden flex flex-col">
            <Tabs defaultValue="Basic SEO" className="w-full flex-grow flex flex-col">
                <div className="p-2 border-b">
                    <TabsList className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 h-auto">
                        {seoConfig.tabs.map(tab => (
                            <TabsTrigger key={tab.name} value={tab.name} className="flex flex-col h-auto gap-1 p-2">
                                <tab.icon className="h-5 w-5"/>
                                <span className="text-xs">{tab.name}</span>
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </div>
                <div className="flex-grow overflow-y-auto">
                    {seoConfig.tabs.map(tab => (
                        <TabsContent key={tab.name} value={tab.name} className="m-0 p-6">
                            <div className="space-y-6">
                                {tab.fields.map(fieldName => {
                                    const isTextarea = (fieldDescriptions[fieldName] && fieldDescriptions[fieldName].toLowerCase().includes('json')) || (formData[fieldName as keyof SeoMetadata] as string)?.length > 100;
                                    return (
                                        <div key={fieldName}>
                                            <Label htmlFor={fieldName} className="text-base font-semibold">{fieldName}</Label>
                                            <p className="text-xs text-muted-foreground mb-2">{fieldDescriptions[fieldName]}</p>
                                            {isTextarea ? (
                                                <Textarea
                                                    id={fieldName}
                                                    name={fieldName}
                                                    value={formData[fieldName as keyof SeoMetadata] || ''}
                                                    onChange={handleInputChange}
                                                    rows={5}
                                                    className="font-mono text-sm"
                                                />
                                            ) : (
                                                <Input
                                                    id={fieldName}
                                                    name={fieldName}
                                                    value={formData[fieldName as keyof SeoMetadata] || ''}
                                                    onChange={handleInputChange}
                                                />
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        </TabsContent>
                    ))}
                </div>
            </Tabs>
        </main>
    </form>
  );
}
