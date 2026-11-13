
'use client';

import { useActionState, useEffect } from "react";
import Link from "next/link";
import { type SeoMetadata } from "@/lib/firestore";
import { updateSeoMetadataAction, type SeoActionState } from "@/app/admin/seo/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, Sparkles, Globe, Share2, Bot, ArrowLeft } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const initialState: SeoActionState = { success: false, error: null };

function FormField({ name, label, description, children }: { name: string, label: string, description?: string, children: React.ReactNode }) {
    return (
        <div className="space-y-2">
            <Label htmlFor={name}>{label}</Label>
            {children}
            {description && <p className="text-xs text-muted-foreground">{description}</p>}
        </div>
    )
}

export function SeoEditorClient({ slug, metadata }: { slug: string; metadata: SeoMetadata | null }) {
  const { toast } = useToast();
  const [state, formAction, isPending] = useActionState(updateSeoMetadataAction, initialState);

  useEffect(() => {
    if (state.success) {
      toast({ title: "Erfolg!", description: state.message });
    }
    if (state.error) {
      toast({ variant: "destructive", title: "Fehler", description: state.error });
    }
  }, [state, toast]);

  return (
    <form action={formAction}>
      <input type="hidden" name="slug" value={slug} />
      
      <Tabs defaultValue="general">
        <TabsList className="mb-6 grid w-full grid-cols-3">
          <TabsTrigger value="general"><Globe className="mr-2 h-4 w-4" />Allgemein</TabsTrigger>
          <TabsTrigger value="social"><Share2 className="mr-2 h-4 w-4" />Social Media</TabsTrigger>
          <TabsTrigger value="aeo"><Bot className="mr-2 h-4 w-4" />AEO / KI</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Allgemeine SEO-Einstellungen</CardTitle>
              <CardDescription>Diese Daten sind entscheidend für die Sichtbarkeit in Suchmaschinen wie Google.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField name="title" label="Meta-Titel" description="Optimal: 50-60 Zeichen. Wird als Titel in den Suchergebnissen angezeigt.">
                <Input id="title" name="title" defaultValue={metadata?.title} placeholder="Seitentitel für Suchmaschinen" />
              </FormField>
              <FormField name="metaDescription" label="Meta-Beschreibung" description="Optimal: 150-160 Zeichen. Der Teaser-Text in den Suchergebnissen.">
                <Textarea id="metaDescription" name="metaDescription" defaultValue={metadata?.metaDescription} placeholder="Seitenbeschreibung für Suchmaschinen" rows={3}/>
              </FormField>
               <FormField name="keywords" label="Keywords" description="Komma-getrennte Liste von Schlüsselwörtern.">
                <Input id="keywords" name="keywords" defaultValue={metadata?.keywords} placeholder="keyword1, keyword2, keyword3" />
              </FormField>
               <FormField name="canonicalUrl" label="Kanonische URL" description="Die 'bevorzugte' URL für diese Seite, falls es Duplikate gibt (z.B. durch UTM-Parameter).">
                <Input id="canonicalUrl" name="canonicalUrl" defaultValue={metadata?.canonicalUrl} placeholder="/mein-bester-artikel" />
              </FormField>
                <FormField name="robots" label="Robots-Anweisung" description="Anweisungen für Suchmaschinen-Crawler (z.B. 'noindex, nofollow').">
                <Input id="robots" name="robots" defaultValue={metadata?.robots} placeholder="index, follow" />
              </FormField>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                <CardTitle>Open Graph (Facebook etc.)</CardTitle>
                <CardDescription>So wird die Seite auf den meisten sozialen Netzwerken geteilt.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <FormField name="ogTitle" label="OG Titel">
                        <Input id="ogTitle" name="ogTitle" defaultValue={metadata?.ogTitle} placeholder="Titel für Social Media"/>
                    </FormField>
                    <FormField name="ogDescription" label="OG Beschreibung">
                        <Textarea id="ogDescription" name="ogDescription" defaultValue={metadata?.ogDescription} placeholder="Beschreibung für Social Media" rows={2}/>
                    </FormField>
                    <FormField name="ogImage" label="OG Bild-URL">
                        <Input id="ogImage" name="ogImage" defaultValue={metadata?.ogImage} placeholder="https://..."/>
                    </FormField>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                <CardTitle>Twitter Cards</CardTitle>
                <CardDescription>Spezielle Einstellungen für X (Twitter).</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <FormField name="twitterTitle" label="Twitter Titel">
                        <Input id="twitterTitle" name="twitterTitle" defaultValue={metadata?.twitterTitle} placeholder="Titel für Twitter"/>
                    </FormField>
                    <FormField name="twitterDescription" label="Twitter Beschreibung">
                        <Textarea id="twitterDescription" name="twitterDescription" defaultValue={metadata?.twitterDescription} placeholder="Beschreibung für Twitter" rows={2}/>
                    </FormField>
                    <FormField name="twitterImage" label="Twitter Bild-URL">
                        <Input id="twitterImage" name="twitterImage" defaultValue={metadata?.twitterImage} placeholder="https://..."/>
                    </FormField>
                    <FormField name="twitterCard" label="Twitter Card-Typ">
                         <Select name="twitterCard" defaultValue={metadata?.twitterCard || 'summary_large_image'}>
                            <SelectTrigger id="twitterCard">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="summary">Summary</SelectItem>
                                <SelectItem value="summary_large_image">Summary with Large Image</SelectItem>
                            </SelectContent>
                        </Select>
                    </FormField>
                </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="aeo">
            <Card>
                <CardHeader>
                    <CardTitle>Answer Engine Optimization (AEO)</CardTitle>
                    <CardDescription>Strukturierte Daten, um KI-Assistenten und modernen Suchfunktionen die besten Antworten zu liefern.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <FormField name="aiSummary" label="KI-Zusammenfassung" description="Fassen Sie den Inhalt in 1-2 Sätzen für eine KI zusammen.">
                        <Textarea id="aiSummary" name="aiSummary" defaultValue={metadata?.aiSummary} rows={3} />
                    </FormField>
                    <FormField name="aiKeywords" label="Semantische Keywords" description="Komma-getrennte Liste von Konzepten und Entitäten.">
                        <Input id="aiKeywords" name="aiKeywords" defaultValue={metadata?.aiKeywords} placeholder="satirische gesellschaftskritik, bildungssystem deutschland" />
                    </FormField>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-between gap-4 mt-8">
        <Link href="/seo">
            <Button type="button" variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Zurück zur Übersicht
            </Button>
        </Link>
        <Button type="submit" disabled={isPending}>
          {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Änderungen speichern
        </Button>
      </div>
    </form>
  );
}
