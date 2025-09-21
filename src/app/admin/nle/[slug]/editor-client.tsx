

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
import { Loader2, Save, ArrowLeft, Eye, Code, PlusCircle, Trash2, ArrowUp, ArrowDown, Type, Image as ImageIcon, Link as LinkIcon, AlignLeft, AlignCenter, AlignRight } from "lucide-react";
import { useFormStatus } from "react-dom";
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
import { CodeEditor } from "@/components/admin/code-editor";


function generateComponentHTML(component: NewsletterComponent): string {
    const props = component.props;
    const align = props.alignment as 'left' | 'center' | 'right' || 'left';

    switch(component.type) {
        case 'heading':
            return `
                <tr>
                    <td style="padding: 10px 20px; text-align: ${align};">
                        <h1 style="font-family: Arial, sans-serif; font-size: ${props.fontSize || '24px'}; color: ${props.color || '#000000'}; margin: 0;">${props.text || ''}</h1>
                    </td>
                </tr>
            `;
        case 'text':
             return `
                 <tr>
                    <td style="padding: 10px 20px; text-align: ${align};">
                        <p style="font-family: Arial, sans-serif; font-size: ${props.fontSize || '16px'}; color: ${props.color || '#333333'}; margin: 0; line-height: 1.5;">${(props.text || '').replace(/\n/g, '<br />')}</p>
                    </td>
                </tr>
            `;
        case 'button':
            return `
                <tr>
                    <td style="padding: 20px;" align="${align}">
                        <table border="0" cellpadding="0" cellspacing="0" role="presentation">
                            <tr>
                                <td align="center" bgcolor="${props.backgroundColor || '#007bff'}" role="presentation" style="background:${props.backgroundColor || '#007bff'};border:none;cursor:auto;padding:10px 25px;">
                                    <a href="${props.href || '#'}" style="background:${props.backgroundColor || '#007bff'};color:${props.color || '#ffffff'};font-family:Arial, sans-serif;font-size:${props.fontSize || '16px'};font-weight:bold;line-height:120%;margin:0;text-decoration:none;text-transform:none;" target="_blank">
                                        ${props.text || ''}
                                    </a>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            `;
        case 'image':
            const width = props.width ? parseInt(props.width, 10) : 600;
            return `
                <tr>
                    <td align="${align}" style="padding: 10px 20px;">
                        <table border="0" cellpadding="0" cellspacing="0" role="presentation" align="${align}" style="width: ${width}px; max-width: 100%;">
                            <tr>
                                <td>
                                    <img src="${props.src || 'https://placehold.co/600x400'}" alt="${props.alt || ''}" style="width: 100%; height: auto; display: block;" width="${width}" />
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            `;
        default:
            return '';
    }
}

function generateEmailHTML(components: NewsletterComponent[], subject: string): string {
    const body = components.map(generateComponentHTML).join('');

    return `
        <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <html xmlns="http://www.w3.org/1999/xhtml">
        <head>
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            <title>${subject}</title>
            <style type="text/css">
                body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
                table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
                img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
                table { border-collapse: collapse !important; }
                body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; }
            </style>
        </head>
        <body style="margin: 0 !important; padding: 0 !important; background-color: #f4f4f4;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                    <td align="center" style="background-color: #f4f4f4;">
                        <!--[if (gte mso 9)|(IE)]>
                        <table align="center" border="0" cellspacing="0" cellpadding="0" width="600">
                        <tr>
                        <td align="center" valign="top" width="600">
                        <![endif]-->
                        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="max-width: 600px; width: 100%;">
                            <tr>
                                <td align="center" valign="top" style="font-size: 11px; font-family: Arial, sans-serif; color: #888888; padding: 10px;">
                                    E-Mail wird nicht korrekt angezeigt? <a href="#" target="_blank" style="color: #888888; text-decoration: underline;">Online ansehen</a>
                                </td>
                            </tr>
                            <tr>
                                <td align="center" valign="top" style="background-color: #ffffff;">
                                    <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%">
                                        ${body}
                                    </table>
                                </td>
                            </tr>
                             <tr>
                                <td bgcolor="#eae7e1" style="padding:20px; font-family:Arial, sans-serif; font-size:12px; color:#333333; line-height:1.4; text-align:left;">
                                  <b>Impressum:</b><br>
                                  Philipp Paulik und Maximilian Reisch<br>
                                  Mozartstraße 1<br>
                                  53819 Neunkirchen<br>
                                  E-Mail: <a href="mailto:hallowelt@paulik-reisch.de" style="color:#333333; text-decoration:underline;">hallowelt@paulik-reisch.de</a><br><br>

                                  Diese E-Mail wurde automatisch versendet. Falls Sie keine weiteren Nachrichten wünschen, klicken Sie bitte hier: 
                                  <a href="#unsubscribe" target="_blank" style="color:#333333; text-decoration:underline;">Abmelden</a>
                                </td>
                            </tr>
                        </table>
                        <!--[if (gte mso 9)|(IE)]>
                        </td>
                        </tr>
                        </table>
                        <![endif]-->
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
                rows={3}
            />
        </div>
    );
    
    const renderAlignmentSelector = () => (
         <div>
            <Label className="text-xs">Ausrichtung</Label>
            <div className="flex gap-1 mt-1">
                {(['left', 'center', 'right'] as const).map(align => (
                     <Button key={align} size="icon" variant={component.props.alignment === align ? "secondary" : "outline"} className="h-8 w-8" onClick={() => updateProp('alignment', align)}>
                        {align === 'left' && <AlignLeft className="h-4 w-4" />}
                        {align === 'center' && <AlignCenter className="h-4 w-4" />}
                        {align === 'right' && <AlignRight className="h-4 w-4" />}
                    </Button>
                ))}
            </div>
        </div>
    );

    const renderFontSizeSelector = (defaultSize: string) => (
         <div className="flex-1">
            <Label htmlFor={`${component.id}-fontSize`} className="text-xs">Schriftgröße</Label>
            <Input 
                id={`${component.id}-fontSize`} 
                value={component.props.fontSize || ''}
                placeholder={defaultSize}
                onChange={(e) => updateProp('fontSize', e.target.value)}
                className="h-8"
            />
        </div>
    );

    const renderColorInput = (propName: string, label: string, defaultValue: string) => (
        <div className="flex-1">
            <Label htmlFor={`${component.id}-${propName}`} className="text-xs">{label}</Label>
            <div className="flex items-center gap-2">
                 <Input 
                    id={`${component.id}-${propName}`} 
                    value={component.props[propName] || ''}
                    placeholder={defaultValue}
                    onChange={(e) => updateProp(propName, e.target.value)}
                    className="h-8"
                />
                <Input type="color" value={component.props[propName] || defaultValue} onChange={e => updateProp(propName, e.target.value)} className="w-8 h-8 p-1"/>
            </div>
        </div>
    );

    const renderContent = () => {
        switch(component.type) {
            case 'heading': return (
                <div className="space-y-4">
                    {renderField('text', 'Überschrift')}
                    <div className="flex gap-2">
                        {renderFontSizeSelector("24px")}
                        {renderColorInput('color', 'Farbe', '#000000')}
                    </div>
                    {renderAlignmentSelector()}
                </div>
            );
            case 'text': return (
                <div className="space-y-4">
                    {renderTextarea('text', 'Text')}
                     <div className="flex gap-2">
                        {renderFontSizeSelector("16px")}
                        {renderColorInput('color', 'Farbe', '#333333')}
                    </div>
                    {renderAlignmentSelector()}
                </div>
            );
            case 'button': return (
                <div className="space-y-4">
                    {renderField('text', 'Button-Text')}
                    {renderField('href', 'Button-Link (URL)')}
                     <div className="flex gap-2">
                        {renderFontSizeSelector("16px")}
                        {renderColorInput('color', 'Textfarbe', '#FFFFFF')}
                    </div>
                     <div className="flex gap-2">
                        {renderColorInput('backgroundColor', 'Hintergrund', '#007bff')}
                    </div>
                    {renderAlignmentSelector()}
                </div>
            );
            case 'image': return (
                <div className="space-y-4">
                    {renderField('src', 'Bild-URL')}
                    {renderField('alt', 'Alternativtext')}
                    {renderField('width', 'Breite (z.B. 600)', 'text', '600')}
                    {renderAlignmentSelector()}
                </div>
            );
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
  const [htmlContent, setHtmlContent] = useState(() => generateEmailHTML(newsletter.components, newsletter.subject));
  const [hasManuallyEditedHtml, setHasManuallyEditedHtml] = useState(false);

  const [updateState, updateFormAction] = useActionState(updateNewsletterAction, initialEditorState);
  const { toast } = useToast();

  useEffect(() => {
    // Only update HTML from components if it hasn't been manually edited.
    if (!hasManuallyEditedHtml) {
        setHtmlContent(generateEmailHTML(components, subject));
    }
  }, [components, subject, hasManuallyEditedHtml]);

  useEffect(() => {
    if (updateState.success) {
      toast({ title: "Erfolg", description: updateState.message });
      setHasManuallyEditedHtml(false); // Reset manual edit state on successful save
    }
    if (updateState.error) {
      toast({ variant: "destructive", title: "Fehler", description: updateState.error });
    }
  }, [updateState, toast]);

  const handleFormSubmit = (formData: FormData) => {
    formData.set('id', newsletter.id);
    formData.set('name', name);
    formData.set('subject', subject);
    // Always save the latest HTML content from the editor
    formData.set('content', htmlContent);
    // Save components only if HTML was not manually edited
    if (!hasManuallyEditedHtml) {
      formData.set('components', JSON.stringify(components));
    } else {
      // Send empty array to indicate manual edit and to clear old components.
      // The content field is now the source of truth.
      formData.set('components', '[]'); 
    }
    updateFormAction(formData);
  };
  
  const handleHtmlChange = (value: string) => {
    setHasManuallyEditedHtml(true);
    setHtmlContent(value);
  }

  const addComponent = (type: NewsletterComponent['type']) => {
      const newComponent: NewsletterComponent = {
          id: `${type}-${Date.now()}`,
          type: type,
          props: {}
      };
      setComponents(prev => [...prev, newComponent]);
      setHasManuallyEditedHtml(false);
  };

  const updateComponent = (id: string, props: any) => {
      setComponents(prev => prev.map(c => c.id === id ? { ...c, props } : c));
      setHasManuallyEditedHtml(false);
  };
  
  const deleteComponent = (id: string) => {
      setComponents(prev => prev.filter(c => c.id !== id));
      setHasManuallyEditedHtml(false);
  };

  const moveComponent = (id: string, direction: 'up' | 'down') => {
      setHasManuallyEditedHtml(false);
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
                    {hasManuallyEditedHtml && (
                        <div className="p-2 mb-2 text-xs bg-yellow-100 border border-yellow-300 rounded-md text-yellow-800">
                           Sie bearbeiten den HTML-Code manuell. Komponenten-Änderungen werden nicht mehr synchronisiert. Speichern Sie, um die visuellen Komponenten wieder zu aktivieren.
                        </div>
                    )}
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
        <main className="flex-1 flex flex-col p-4 md:p-6 overflow-y-auto h-full">
            <Tabs defaultValue="preview" className="w-full h-full flex flex-col">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="preview"><Eye className="mr-2 h-4 w-4"/>Vorschau</TabsTrigger>
                    <TabsTrigger value="code"><Code className="mr-2 h-4 w-4"/>HTML-Code</TabsTrigger>
                </TabsList>
                <TabsContent value="preview" className="mt-4 flex-grow bg-gray-200 p-4 rounded-md">
                    <iframe
                        srcDoc={htmlContent}
                        title="E-Mail Vorschau"
                        className="w-full h-full border bg-white"
                    />
                </TabsContent>
                <TabsContent value="code" className="mt-4 flex-grow flex flex-col min-h-0">
                    <CodeEditor 
                        value={htmlContent}
                        onChange={handleHtmlChange}
                    />
                </TabsContent>
            </Tabs>
        </main>
    </div>
  );
}
