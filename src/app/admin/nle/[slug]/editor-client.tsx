"use client";

import { useState, useEffect } from "react";
import { useActionState } from "react";
import Link from "next/link";
import { Newsletter, NewsletterComponent } from "@/lib/firestore";
import { updateNewsletterAction } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, ArrowLeft, Eye, Code, PlusCircle, Trash2, ArrowUp, ArrowDown, Type, Image as ImageIcon, Link as LinkIcon } from "lucide-react";
import { useFormStatus } from "react-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"


function generateComponentHTML(component: NewsletterComponent): string {
    switch(component.type) {
        case 'heading':
            return `
                <tr>
                    <td style="padding: 10px 20px;">
                        <h1 style="font-family: Arial, sans-serif; font-size: 24px; margin: 0;">${component.props.text || ''}</h1>
                    </td>
                </tr>
            `;
        case 'text':
            return `
                 <tr>
                    <td style="padding: 10px 20px;">
                        <p style="font-family: Arial, sans-serif; font-size: 16px; margin: 0; line-height: 1.5;">${component.props.text || ''}</p>
                    </td>
                </tr>
            `;
        case 'button':
            return `
                <tr>
                    <td style="padding: 20px;">
                        <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:separate;line-height:100%;">
                            <tr>
                                <td align="center" bgcolor="#007bff" role="presentation" style="border:none;border-radius:3px;cursor:auto;padding:10px 25px;" valign="middle">
                                    <a href="${component.props.href || '#'}" style="background:#007bff;color:#ffffff;font-family:Arial, sans-serif;font-size:16px;font-weight:bold;line-height:120%;margin:0;text-decoration:none;text-transform:none;" target="_blank">
                                        ${component.props.text || ''}
                                    </a>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            `;
        case 'image':
            return `
                <tr>
                    <td style="padding: 10px 20px;">
                        <img src="${component.props.src || 'https://placehold.co/600x400'}" alt="${component.props.alt || ''}" style="width: 100%; height: auto; max-width: 600px; display: block;" width="600" />
                    </td>
                </tr>
            `;
        default:
            return '';
    }
}

function generateEmailHTML(components: NewsletterComponent[]): string {
    const body = components.map(generateComponentHTML).join('');

    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
            <title>Email</title>
        </head>
        <body style="margin: 0; padding: 0; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; background-color: #f4f4f4;">
            <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4;">
                <tr>
                    <td align="center">
                        <table width="600" border="0" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%; background-color: #ffffff;">
                            ${body}
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
    `;
}

type EditorState = {
  success: boolean;
  error: string | null;
  message?: string;
};
const initialEditorState: EditorState = { success: false, error: null };

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
                    Newsletter speichern
                </>
            )}
        </Button>
    )
}

function ComponentEditor({ component, onUpdate, onDelete, onMove }: { component: NewsletterComponent, onUpdate: (id: string, props: any) => void, onDelete: (id: string) => void, onMove: (id: string, direction: 'up' | 'down') => void }) {
    const renderField = (propName: string, label: string, type: string = 'text') => (
         <div key={propName}>
            <Label htmlFor={`${component.id}-${propName}`} className="text-xs">{label}</Label>
            <Input 
                id={`${component.id}-${propName}`} 
                type={type}
                value={component.props[propName] || ''} 
                onChange={(e) => onUpdate(component.id, { ...component.props, [propName]: e.target.value })}
                className="h-8"
            />
        </div>
    );
     const renderTextarea = (propName: string, label: string) => (
         <div key={propName}>
            <Label htmlFor={`${component.id}-${propName}`} className="text-xs">{label}</Label>
            <Textarea 
                id={`${component.id}-${propName}`} 
                value={component.props[propName] || ''} 
                onChange={(e) => onUpdate(component.id, { ...component.props, [propName]: e.target.value })}
                className="text-xs"
                rows={3}
            />
        </div>
    );

    const renderContent = () => {
        switch(component.type) {
            case 'heading': return renderField('text', 'Überschrift');
            case 'text': return renderTextarea('text', 'Text');
            case 'button': return <div className="space-y-2">{renderField('text', 'Button-Text')}{renderField('href', 'Button-Link (URL)')}</div>;
            case 'image': return <div className="space-y-2">{renderField('src', 'Bild-URL')}{renderField('alt', 'Alternativtext')}</div>;
            default: return <p>Unbekannter Komponententyp</p>
        }
    }

    const typeIcons = {
        heading: <Type className="h-4 w-4" />,
        text: <Type className="h-4 w-4" />,
        button: <LinkIcon className="h-4 w-4" />,
        image: <ImageIcon className="h-4 w-4" />
    }

    return (
        <AccordionItem value={component.id}>
            <AccordionTrigger className="hover:no-underline p-2 bg-muted/50 rounded-t-md border">
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

export function NewsletterEditorClient({ newsletter }: { newsletter: Newsletter }) {
  const [name, setName] = useState(newsletter.name);
  const [subject, setSubject] = useState(newsletter.subject);
  const [components, setComponents] = useState<NewsletterComponent[]>(newsletter.components);

  const [updateState, updateFormAction] = useActionState(updateNewsletterAction, initialEditorState);
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
    formData.set('id', newsletter.id);
    formData.set('name', name);
    formData.set('subject', subject);
    formData.set('components', JSON.stringify(components));
    updateFormAction(formData);
  };
  
  const addComponent = (type: NewsletterComponent['type']) => {
      const newComponent: NewsletterComponent = {
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

  const generatedHTML = generateEmailHTML(components);

  return (
    <div className="grid md:grid-cols-[350px_1fr] h-full">
        {/* Sidebar */}
        <div className="flex flex-col bg-background border-r h-full">
            <div className="p-4 border-b">
                 <Link href="/admin">
                    <Button variant="outline" size="sm">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Zurück zum Dashboard
                    </Button>
                </Link>
            </div>
            <div className="p-4 space-y-4 flex-grow overflow-y-auto">
                <div>
                    <Label htmlFor="name">Interner Name</Label>
                    <Input id="name" value={name} onChange={e => setName(e.target.value)} />
                </div>
                 <div>
                    <Label htmlFor="subject">Betreff</Label>
                    <Input id="subject" value={subject} onChange={e => setSubject(e.target.value)} />
                </div>
                 <div>
                    <h3 className="text-sm font-medium mb-2">Komponenten</h3>
                    <Accordion type="single" collapsible className="w-full space-y-2">
                        {components.map((comp) => (
                           <ComponentEditor 
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
                    <Button variant="outline" onClick={() => addComponent('text')}><Type className="mr-2 h-4 w-4"/>Text</Button>
                    <Button variant="outline" onClick={() => addComponent('button')}><LinkIcon className="mr-2 h-4 w-4"/>Button</Button>
                    <Button variant="outline" onClick={() => addComponent('image')}><ImageIcon className="mr-2 h-4 w-4"/>Bild</Button>
                </div>
                <form action={handleFormSubmit}>
                    <SubmitButton />
                </form>
            </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 flex flex-col p-4 md:p-6 overflow-y-auto">
            <Tabs defaultValue="preview" className="w-full h-full flex flex-col">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="preview"><Eye className="mr-2 h-4 w-4"/>Vorschau</TabsTrigger>
                    <TabsTrigger value="code"><Code className="mr-2 h-4 w-4"/>HTML-Code</TabsTrigger>
                </TabsList>
                <TabsContent value="preview" className="mt-4 flex-grow bg-gray-200 p-4 rounded-md">
                    <iframe
                        srcDoc={generatedHTML}
                        title="E-Mail Vorschau"
                        className="w-full h-full border bg-white"
                    />
                </TabsContent>
                <TabsContent value="code" className="mt-4 flex-grow">
                    <Textarea 
                        readOnly 
                        value={generatedHTML}
                        className="w-full h-full font-mono text-xs resize-none"
                    />
                </TabsContent>
            </Tabs>
        </main>
    </div>
  );
}
