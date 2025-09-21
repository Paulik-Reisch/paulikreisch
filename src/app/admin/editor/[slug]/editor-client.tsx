
"use client";

import { useState, useEffect } from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { LegalPage, PageComponent } from "@/lib/firestore";
import { updateLegalPageAction } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Loader2,
  Save,
  ArrowLeft,
  Type,
  Pilcrow,
  Image as ImageIcon,
  Link as LinkIcon,
  Rows,
  Trash2,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";


function generatePageHtml(components: PageComponent[]): string {
    const componentHtml = components.map(component => {
        const props = component.props;
        switch(component.type) {
            case 'heading':
                const Tag = props.level || 'h1';
                return `<${Tag} class="${props.className || ''}">${props.text || ''}</${Tag}>`;
            case 'text':
                return `<p class="${props.className || ''}">${(props.text || '').replace(/\n/g, '<br />')}</p>`;
            case 'button':
                return `<div class="my-6 text-center"><a href="${props.href || '#'}" class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 shadow-md transform active:scale-95 border h-11 px-8 bg-primary text-primary-foreground hover:bg-primary/90">${props.text || 'Klick'}</a></div>`;
            case 'image':
                return `<div class="my-6 text-center"><img src="${props.src || 'https://placehold.co/800x450'}" alt="${props.alt || ''}" style="max-width: ${props.width || '100%'}; margin: auto;" class="h-auto rounded-lg shadow-md inline-block" /></div>`;
            case 'spacer':
                 return `<div style="height: ${props.height || '2rem'}"></div>`;
            default:
                return '';
        }
    }).join('\n');

    return `
        <div class="space-y-6">
            ${componentHtml}
        </div>
    `;
}

type AdminLegalPageState = {
  success: boolean;
  error: string | null;
  message?: string;
};
const initialLegalPageState: AdminLegalPageState = { success: false, error: null };

function PageComponentEditor({ component, onUpdate, onDelete, onMove }: { component: PageComponent, onUpdate: (id: string, props: any) => void, onDelete: (id: string) => void, onMove: (id: string, direction: 'up' | 'down') => void }) {
    
    const updateProp = (propName: string, value: string) => {
        onUpdate(component.id, { ...component.props, [propName]: value });
    };

    const renderField = (propName: string, label: string, type: string = 'text', placeholder?: string) => (
         <div key={propName}>
            <Label htmlFor={`${component.id}-${propName}`} className="text-xs">{label}</Label>
            <Input 
                id={`${component.id}-${propName}`} 
                type={type}
                value={component.props[propName] || ''} 
                onChange={(e) => updateProp(propName, e.target.value)}
                className="h-8"
                placeholder={placeholder}
            />
        </div>
    );

     const renderTextarea = (propName: string, label: string) => (
         <div key={propName}>
            <Label htmlFor={`${component.id}-${propName}`} className="text-xs">{label}</Label>
            <Textarea 
                id={`${component.id}-${propName}`} 
                value={component.props[propName] || ''} 
                onChange={(e) => updateProp(propName, e.target.value)}
                className="text-xs"
                rows={4}
            />
        </div>
    );

    const renderContent = () => {
        switch(component.type) {
            case 'heading': return (
                <div className="space-y-4">
                    {renderField('text', 'Überschrift')}
                    <div>
                        <Label htmlFor={`${component.id}-level`} className="text-xs">Ebene</Label>
                        <Select onValueChange={(v) => updateProp('level', v)} defaultValue={component.props.level || 'h1'}>
                            <SelectTrigger className="h-8">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="h1">H1 (Hauptüberschrift)</SelectItem>
                                <SelectItem value="h2">H2 (Unterüberschrift)</SelectItem>
                                <SelectItem value="h3">H3</SelectItem>
                                <SelectItem value="h4">H4</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    {renderField('className', 'Zusätzliche CSS-Klassen (Tailwind)')}
                </div>
            );
            case 'text': return (
                <div className="space-y-4">
                    {renderTextarea('text', 'Text (unterstützt Zeilenumbrüche)')}
                    {renderField('className', 'Zusätzliche CSS-Klassen (Tailwind)')}
                </div>
            );
            case 'button': return (
                <div className="space-y-4">
                    {renderField('text', 'Button-Text')}
                    {renderField('href', 'Button-Link (URL)')}
                </div>
            );
            case 'image': return (
                <div className="space-y-4">
                    {renderField('src', 'Bild-URL')}
                    {renderField('alt', 'Alternativtext')}
                    {renderField('width', 'Maximale Breite (z.B. 500px, 80%)', 'text', '100%')}
                </div>
            );
            case 'spacer': return (
                <div className="space-y-4">
                    {renderField('height', 'Höhe (z.B. 2rem, 32px)')}
                </div>
            );
            default: return <p>Unbekannter Komponententyp</p>
        }
    }

    const typeIcons: {[key: string]: React.ReactNode} = {
        heading: <Type className="h-4 w-4" />,
        text: <Pilcrow className="h-4 w-4" />,
        button: <LinkIcon className="h-4 w-4" />,
        image: <ImageIcon className="h-4 w-4" />,
        spacer: <Rows className="h-4 w-4" />,
    }

    return (
        <AccordionItem value={component.id} className="bg-background">
            <AccordionTrigger className="hover:no-underline p-2 rounded-t-md border">
                <div className="flex items-center gap-2 text-sm font-semibold w-full">
                    {typeIcons[component.type]}
                    <span className="capitalize flex-grow text-left">{component.type}</span>
                    <Button type="button" size="icon" variant="ghost" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); onMove(component.id, 'up'); }}><ArrowUp className="h-4 w-4"/></Button>
                    <Button type="button" size="icon" variant="ghost" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); onMove(component.id, 'down'); }}><ArrowDown className="h-4 w-4"/></Button>
                    <Button type="button" size="icon" variant="ghost" className="h-6 w-6 text-destructive hover:text-destructive" onClick={(e) => { e.stopPropagation(); onDelete(component.id); }}><Trash2 className="h-4 w-4"/></Button>
                </div>
            </AccordionTrigger>
            <AccordionContent className="p-4 border border-t-0 rounded-b-md">
                {renderContent()}
            </AccordionContent>
        </AccordionItem>
    )
}

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} className="w-full">
            {pending ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Wird gespeichert...
                </>
            ) : (
                <>
                    <Save className="mr-2 h-4 w-4" />
                    Seite speichern
                </>
            )}
        </Button>
    )
}

export function EditorClient({ page }: { page: LegalPage }) {
  const [title, setTitle] = useState(page.title);
  const [components, setComponents] = useState<PageComponent[]>(page.components || []);
  const [generatedHtml, setGeneratedHtml] = useState('');
  const [formattedDate, setFormattedDate] = useState<string | null>(null);

  const [updateState, updateFormAction] = useActionState(updateLegalPageAction, initialLegalPageState);
  const { toast } = useToast();

  useEffect(() => {
    // This effect runs only on the client, after hydration
    setFormattedDate(new Date(page.lastUpdated).toLocaleString('de-DE'));
  }, [page.lastUpdated]);

  useEffect(() => {
      setGeneratedHtml(generatePageHtml(components));
  }, [components]);

  useEffect(() => {
    if (updateState.success) {
      toast({ title: "Erfolg", description: updateState.message });
    }
    if (updateState.error) {
      toast({ variant: "destructive", title: "Fehler", description: updateState.error });
    }
  }, [updateState, toast]);

  const handleFormSubmit = (formData: FormData) => {
    formData.set('pageId', page.id);
    formData.set('title', title);
    formData.set('components', JSON.stringify(components));
    formData.set('content', generatedHtml);
    updateFormAction(formData);
  };
  
  const addComponent = (type: PageComponent['type']) => {
      const newComponent: PageComponent = {
          id: `${type}-${Date.now()}`,
          type: type,
          props: {}
      };
      setComponents(prev => [...prev, newComponent]);
  };

  const updateComponent = (id: string, props: any) => {
      setComponents(prev => prev.map(c => c.id === id ? { ...c, props } : c));
  };
  
  const deleteComponent = (id: string) => {
      setComponents(prev => prev.filter(c => c.id !== id));
  };

  const moveComponent = (id: string, direction: 'up' | 'down') => {
      const index = components.findIndex(c => c.id === id);
      if (index === -1) return;
      
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= components.length) return;

      const newComponents = [...components];
      const [movedComponent] = newComponents.splice(index, 1);
      newComponents.splice(newIndex, 0, movedComponent);
      setComponents(newComponents);
  }

  return (
    <div className="grid md:grid-cols-[380px_1fr] h-full gap-6">
        {/* Sidebar */}
        <div className="flex flex-col bg-background border rounded-lg h-full">
            <div className="p-4 border-b flex items-center justify-between">
                 <Link href="/admin">
                    <Button variant="outline" size="sm">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Zurück
                    </Button>
                </Link>
                <h1 className="text-lg font-bold font-headline">Editor: /{page.id}</h1>
            </div>
            <div className="p-4 space-y-4 flex-grow overflow-y-auto">
                 <div>
                    <Label htmlFor="title">Seitentitel</Label>
                    <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                 <div className="text-sm text-muted-foreground">
                    Zuletzt aktualisiert: {formattedDate || <Skeleton className="h-4 w-32 inline-block" />}
                </div>
                <div>
                    <h3 className="text-sm font-medium mb-2">Komponenten</h3>
                    <Accordion type="single" collapsible className="w-full space-y-2">
                        {components.map((comp) => (
                           <PageComponentEditor 
                                key={comp.id} 
                                component={comp} 
                                onUpdate={updateComponent}
                                onDelete={deleteComponent}
                                onMove={moveComponent}
                            />
                        ))}
                    </Accordion>
                </div>
            </div>
            <div className="p-4 border-t space-y-2">
                 <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" onClick={() => addComponent('heading')}><Type className="mr-2 h-4 w-4"/>Überschrift</Button>
                    <Button variant="outline" onClick={() => addComponent('text')}><Pilcrow className="mr-2 h-4 w-4"/>Text</Button>
                    <Button variant="outline" onClick={() => addComponent('button')}><LinkIcon className="mr-2 h-4 w-4"/>Button</Button>
                    <Button variant="outline" onClick={() => addComponent('image')}><ImageIcon className="mr-2 h-4 w-4"/>Bild</Button>
                    <Button variant="outline" onClick={() => addComponent('spacer')}><Rows className="mr-2 h-4 w-4"/>Abstand</Button>
                </div>
                <form action={handleFormSubmit}>
                    <SubmitButton />
                </form>
            </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 flex flex-col p-4 md:p-6 overflow-y-auto h-full bg-background border rounded-lg">
             <Tabs defaultValue="preview" className="w-full h-full flex flex-col">
                <TabsList className="grid w-full grid-cols-1">
                    <TabsTrigger value="preview">Live-Vorschau</TabsTrigger>
                </TabsList>
                <TabsContent value="preview" className="mt-4 flex-grow bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
                     <iframe
                        srcDoc={`<html><head><link href="/globals.css" rel="stylesheet"><script src="https://cdn.tailwindcss.com"></script></head><body class="bg-background text-foreground"><div class="prose dark:prose-invert max-w-none">${generatedHtml}</div></body></html>`}
                        title="Seiten-Vorschau"
                        className="w-full h-full border bg-white"
                    />
                </TabsContent>
            </Tabs>
        </main>
    </div>
  );
}
