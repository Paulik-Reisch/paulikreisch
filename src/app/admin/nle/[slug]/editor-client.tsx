

"use client";

import { useState, useEffect, useTransition } from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { Newsletter, NewsletterComponent } from "@/lib/firestore";
import { updateNewsletterAction, toggleNewsletterLiveStatusAction } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, ArrowLeft, Eye, Code, PlusCircle, Trash2, ArrowUp, ArrowDown, Type, Image as ImageIcon, Link as LinkIcon, AlignLeft, AlignCenter, AlignRight, Copy, Rows, Columns, Minus, GalleryHorizontal, Settings, Box, Radio } from "lucide-react";
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
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


function generateComponentHTML(component: NewsletterComponent): string {
    const props = component.props;
    const align = props.alignment as 'left' | 'center' | 'right' || 'left';

    switch(component.type) {
        case 'heading':
            return `
                <tr>
                    <td align="${align}" style="padding: 10px 20px; text-align: ${align};">
                        <h1 style="font-family: Arial, sans-serif; font-size: ${props.fontSize || '24px'}; color: ${props.color || '#000000'}; margin: 0;">${props.text || ''}</h1>
                    </td>
                </tr>
            `;
        case 'text':
             return `
                 <tr>
                    <td align="${align}" style="padding: 10px 20px; text-align: ${align};">
                        <p style="font-family: Arial, sans-serif; font-size: ${props.fontSize || '16px'}; color: ${props.color || '#333333'}; margin: 0; line-height: 1.5;">${(props.text || '').replace(/\n/g, '<br />')}</p>
                    </td>
                </tr>
            `;
        case 'button':
            return `
                <tr>
                    <td align="${align}" style="padding: 20px; text-align: ${align};">
                      <table border="0" cellspacing="0" cellpadding="0" role="presentation" align="${align}" style="margin-left: ${align === 'center' ? 'auto' : '0'}; margin-right: ${align === 'center' ? 'auto' : '0'};">
                        <tr>
                          <td align="center" style="background-color:${props.backgroundColor || '#007bff'};" bgcolor="${props.backgroundColor || '#007bff'}">
                            <a href="${props.href || '#'}" target="_blank" style="font-size: ${props.fontSize || '16px'}; font-family: Arial, sans-serif; color: ${props.color || '#ffffff'}; text-decoration: none; padding: 10px 25px; border: 1px solid ${props.backgroundColor || '#007bff'}; display: inline-block; font-weight: bold;">
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
                        <table border="0" cellpadding="0" cellspacing="0" role="presentation" align="${align}" style="max-width: 100%; margin-left: ${align === 'center' ? 'auto' : '0'}; margin-right: ${align === 'center' ? 'auto' : '0'};">
                            <tr>
                                <td>
                                    <img src="${props.src || 'https://placehold.co/600x400'}" alt="${props.alt || ''}" style="width: 100%; height: auto; display: block; max-width: ${width}px;" width="${width}" />
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            `;
        case 'separator':
            return `
                <tr>
                    <td style="padding: ${props.padding || 10}px 20px;">
                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                            <tr>
                                <td height="1" style="border-bottom: ${props.thickness || 1}px ${props.style || 'solid'} ${props.color || '#cccccc'};"></td>
                            </tr>
                        </table>
                    </td>
                </tr>
            `;
        case 'spacer':
            return `
                <tr>
                    <td style="height: ${props.height || 20}px; line-height: ${props.height || 20}px; font-size: 1px;">&nbsp;</td>
                </tr>
            `;
        case 'two-columns':
            return `
                <tr>
                    <td style="padding: 10px 20px;">
                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                            <tr>
                                <td valign="top" width="50%" style="padding-right: 10px;">
                                    <p style="font-family: Arial, sans-serif; font-size: 14px; color: #333333; margin: 0; line-height: 1.5;">${(props.text1 || '').replace(/\n/g, '<br />')}</p>
                                </td>
                                <td valign="top" width="50%" style="padding-left: 10px;">
                                    <p style="font-family: Arial, sans-serif; font-size: 14px; color: #333333; margin: 0; line-height: 1.5;">${(props.text2 || '').replace(/\n/g, '<br />')}</p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            `;
        case 'image-text':
            const imageOrder = props.layout === 'image-right' ? 2 : 1;
            const textOrder = props.layout === 'image-right' ? 1 : 2;
            const widths = (props.columnWidth || '50/50').split('/');
            const imageWidthPercent = widths[imageOrder - 1];
            const textWidthPercent = widths[textOrder - 1];
            
            const imageContent = `
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                        <td align="center" style="padding: 5px;">
                             <img src="${props.src || 'https://placehold.co/300x200'}" alt="${props.alt || ''}" style="width: 100%; height: auto; display: block;" width="100%" />
                        </td>
                    </tr>
                </table>`;

            const textContent = `
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                        <td align="left" style="padding: 5px;">
                            <p style="font-family: Arial, sans-serif; font-size: 14px; color: #333333; margin: 0; line-height: 1.5;">${(props.text || '').replace(/\n/g, '<br />')}</p>
                        </td>
                    </tr>
                </table>`;

            return `
                <tr>
                    <td style="padding: 10px;">
                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                            <tr>
                                <td valign="top" width="${imageWidthPercent}%" style="${textOrder === 1 ? 'padding-right:10px;' : 'padding-left:10px;'}">
                                    ${imageOrder === 1 ? imageContent : textContent}
                                </td>
                                <td valign="top" width="${textWidthPercent}%" style="${imageOrder === 1 ? 'padding-left:10px;' : 'padding-right:10px;'}">
                                    ${textOrder === 2 ? textContent : imageContent}
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            `;
        case 'customHtml':
            return props.html || '';
        default:
            return '';
    }
}

function generateEmailHTML(components: NewsletterComponent[], subject: string, previewUrl: string, useWrapper: boolean): string {
    const body = components.map(generateComponentHTML).join('');

    if (!useWrapper) {
        return body;
    }

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
                                    E-Mail wird nicht korrekt angezeigt? <a href="${previewUrl}" target="_blank" style="color: #888888; text-decoration: underline;">Online ansehen</a>
                                </td>
                            </tr>
                            <tr>
                                <td align="center" valign="top" style="background-color: #ffffff;">
                                    <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%">
                                        ${body}
                                    </table>
                                </td>
                            </tr>
                             <!-- Footer -->
                            <tr>
                                <td align="center" style="padding:20px; background-color:#f4f4f4; font-size:12px; line-height:18px; color:#666666; font-family: Arial, sans-serif;">
                                    <p style="margin:0 0 8px 0;">Die satirische "Hallo Welt"-Bücherserie ist eine Idee und Kreation von Philipp Paulik (Autor), Maximilian Reisch (Autor), Luin Schiffbauer (Illustrator) und weiteren Mitwirkenden. Veröffentlicht und produziert durch Kindle Direct Publishing (KDP) der Amazon Distribution GmbH, Leipzig sowie ggf. weitere Verlags- und Produktionspartner.
                                    </p>
                                    <p style="margin:0 0 8px 0;">Du möchtest keine weiteren E‑Mails erhalten?
                                    <a href="/nl/unsubscribe" target="_blank" style="color:#0A5EBF; text-decoration:underline;">Hier abmelden</a>.
                                    </p>
                                    <p style="margin:0;">&copy; ${new Date().getFullYear()} Hallo Welt – Philipp Paulik & Maximilian Reisch</p>
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
  isLive?: boolean;
};
const initialEditorState: EditorState = { success: false, error: null };

function SubmitButton({ isLive }: { isLive: boolean }) {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending || isLive} className="w-full">
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

function ComponentEditor({ component, onUpdate, onDelete, onMove, isLive }: { component: NewsletterComponent, onUpdate: (id: string, props: any) => void, onDelete: (id: string) => void, onMove: (id: string, direction: 'up' | 'down') => void, isLive: boolean }) {
    
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
                disabled={isLive}
            />
        </div>
    );

     const renderTextarea = (propName: string, label: string, rows = 4) => (
         <div key={propName}>
            <Label htmlFor={`${component.id}-${propName}`} className="text-xs">{label}</Label>
            <Textarea 
                id={`${component.id}-${propName}`} 
                value={component.props[propName] || ''} 
                onChange={(e) => updateProp(propName, e.target.value)}
                className="text-xs font-mono"
                rows={rows}
                disabled={isLive}
            />
        </div>
    );
    
    const renderAlignmentSelector = () => (
         <div>
            <Label className="text-xs">Ausrichtung</Label>
            <div className="flex gap-1 mt-1">
                {(['left', 'center', 'right'] as const).map(align => (
                     <Button key={align} size="icon" variant={component.props.alignment === align ? "secondary" : "outline"} className="h-8 w-8" onClick={() => updateProp('alignment', align)} disabled={isLive}>
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
                disabled={isLive}
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
                    disabled={isLive}
                />
                <Input type="color" value={component.props[propName] || defaultValue} onChange={e => updateProp(propName, e.target.value)} className="w-8 h-8 p-1" disabled={isLive}/>
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
                    {renderTextarea('text', 'Text', 6)}
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
                    {renderField('width', 'Max. Breite (z.B. 600)', 'text', '600')}
                    {renderAlignmentSelector()}
                </div>
            );
            case 'separator': return (
                <div className="space-y-4">
                    <div className="flex gap-2 items-end">
                        {renderColorInput('color', 'Farbe', '#cccccc')}
                        <div className="flex-1">
                            <Label htmlFor={`${component.id}-thickness`} className="text-xs">Dicke (px)</Label>
                            <Input id={`${component.id}-thickness`} type="number" value={component.props.thickness || '1'} onChange={(e) => updateProp('thickness', e.target.value)} className="h-8" disabled={isLive}/>
                        </div>
                    </div>
                     <div className="flex-1">
                        <Label htmlFor={`${component.id}-style`} className="text-xs">Stil</Label>
                         <Select onValueChange={(v) => updateProp('style', v)} defaultValue={component.props.style || 'solid'} disabled={isLive}>
                            <SelectTrigger className="h-8">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="solid">Solid</SelectItem>
                                <SelectItem value="dashed">Dashed</SelectItem>
                                <SelectItem value="dotted">Dotted</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex-1">
                        <Label htmlFor={`${component.id}-padding`} className="text-xs">Vertikaler Abstand (px)</Label>
                        <Input id={`${component.id}-padding`} type="number" value={component.props.padding || '10'} onChange={(e) => updateProp('padding', e.target.value)} className="h-8" disabled={isLive}/>
                    </div>
                </div>
            );
            case 'spacer': return (
                <div className="space-y-4">
                     <div className="flex-1">
                        <Label htmlFor={`${component.id}-height`} className="text-xs">Höhe (px)</Label>
                        <Input id={`${component.id}-height`} type="number" value={component.props.height || '20'} onChange={(e) => updateProp('height', e.target.value)} className="h-8" disabled={isLive}/>
                    </div>
                </div>
            );
            case 'two-columns': return (
                 <div className="space-y-4">
                    {renderTextarea('text1', 'Text Spalte 1', 6)}
                    {renderTextarea('text2', 'Text Spalte 2', 6)}
                </div>
            );
            case 'image-text': return (
                <div className="space-y-4">
                    {renderField('src', 'Bild-URL')}
                    {renderField('alt', 'Alternativtext')}
                    {renderTextarea('text', 'Text', 6)}
                    <div>
                        <Label className="text-xs">Layout</Label>
                         <Select onValueChange={(v) => updateProp('layout', v)} defaultValue={component.props.layout || 'image-left'} disabled={isLive}>
                            <SelectTrigger className="h-8">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="image-left">Bild links, Text rechts</SelectItem>
                                <SelectItem value="image-right">Text links, Bild rechts</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label className="text-xs">Spaltenbreite (Bild/Text)</Label>
                         <Select onValueChange={(v) => updateProp('columnWidth', v)} defaultValue={component.props.columnWidth || '50/50'} disabled={isLive}>
                            <SelectTrigger className="h-8">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="50/50">50% / 50%</SelectItem>
                                <SelectItem value="33/67">33% / 67%</SelectItem>
                                <SelectItem value="67/33">67% / 33%</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            );
            case 'customHtml': return (
                <div className="space-y-4">
                    {renderTextarea('html', 'HTML-Code', 10)}
                </div>
            );
            default: return <p>Unbekannter Komponententyp</p>
        }
    }

    const typeIcons: {[key: string]: React.ReactNode} = {
        heading: <Type className="h-4 w-4" />,
        text: <Type className="h-4 w-4" />,
        button: <LinkIcon className="h-4 w-4" />,
        image: <ImageIcon className="h-4 w-4" />,
        separator: <Minus className="h-4 w-4" />,
        spacer: <Rows className="h-4 w-4" />,
        'two-columns': <Columns className="h-4 w-4" />,
        'image-text': <GalleryHorizontal className="h-4 w-4" />,
        customHtml: <Code className="h-4 w-4" />,
    }

    return (
        <AccordionItem value={component.id} disabled={isLive}>
             <div className="flex items-center gap-2 border bg-muted/50 rounded-t-md">
                <AccordionTrigger className="hover:no-underline p-2 flex-grow">
                    <div className="flex items-center gap-2 text-sm font-semibold w-full">
                        {typeIcons[component.type]}
                        <span className="capitalize flex-grow text-left">{component.type.replace('-', ' ')}</span>
                    </div>
                </AccordionTrigger>
                 {!isLive && (
                    <div className="flex items-center pr-2">
                        <Button type="button" size="icon" variant="ghost" className="h-6 w-6" onClick={() => onMove(component.id, 'up')}><ArrowUp className="h-4 w-4"/></Button>
                        <Button type="button" size="icon" variant="ghost" className="h-6 w-6" onClick={() => onMove(component.id, 'down')}><ArrowDown className="h-4 w-4"/></Button>
                        <Button type="button" size="icon" variant="ghost" className="h-6 w-6 text-destructive hover:text-destructive" onClick={() => onDelete(component.id)}><Trash2 className="h-4 w-4"/></Button>
                    </div>
                )}
            </div>
            <AccordionContent className="p-4 border border-t-0 rounded-b-md">
                {renderContent()}
            </AccordionContent>
        </AccordionItem>
    )
}

function LiveStatusToggle({ id, isLive }: { id: string; isLive: boolean }) {
    const [state, formAction] = useActionState(toggleNewsletterLiveStatusAction, { success: false, error: null });
    const [isPending, startTransition] = useTransition();

    const handleToggle = (checked: boolean) => {
        startTransition(() => {
            const formData = new FormData();
            formData.set('id', id);
            formData.set('isLive', String(checked));
            formAction(formData);
        });
    }

    return (
        <form action={formAction}>
            <input type="hidden" name="id" value={id} />
            <input type="hidden" name="isLive" value={String(!isLive)} />
            <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm bg-destructive/10 border-destructive/50">
                <div className="space-y-0.5">
                    <Label className="font-bold text-destructive">Live schalten</Label>
                    <p className="text-xs text-destructive/80">
                        Sperrt den Newsletter für Bearbeitungen. Nur aktivieren, wenn die Kampagne versendet wurde.
                    </p>
                </div>
                <button type="submit" disabled={isPending}>
                     <Switch 
                        checked={isLive} 
                        // The onCheckedChange is now handled by the form submission
                        disabled={isPending}
                    />
                </button>
            </div>
        </form>
    );
}

export function NewsletterEditorClient({ newsletter }: { newsletter: Newsletter }) {
  const [name, setName] = useState(newsletter.name);
  const [subject, setSubject] = useState(newsletter.subject);
  const [components, setComponents] = useState<NewsletterComponent[]>(newsletter.components);
  const [useWrapper, setUseWrapper] = useState(newsletter.useWrapper !== false);
  const [htmlContent, setHtmlContent] = useState('');
  const [hasManuallyEditedHtml, setHasManuallyEditedHtml] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isLive, setIsLive] = useState(newsletter.isLive || false);

  const [updateState, updateFormAction] = useActionState(updateNewsletterAction, initialEditorState);
  const [liveState, liveFormAction] = useActionState(toggleNewsletterLiveStatusAction, initialEditorState);

  const { toast } = useToast();

  useEffect(() => {
    // This effect runs only on the client
    const origin = window.location.origin;
    const url = `${origin}/nl/preview/${newsletter.id}`;
    setPreviewUrl(url);

    // Only update HTML from components if it hasn't been manually edited.
    if (!hasManuallyEditedHtml) {
        setHtmlContent(generateEmailHTML(components, subject, url, useWrapper));
    }
  }, [components, subject, useWrapper, hasManuallyEditedHtml, newsletter.id]);

  useEffect(() => {
    if (updateState.success) {
      toast({ title: "Erfolg", description: updateState.message });
      setHasManuallyEditedHtml(false); // Reset manual edit state on successful save
    }
    if (updateState.error) {
      toast({ variant: "destructive", title: "Fehler", description: updateState.error });
    }
  }, [updateState, toast]);

    useEffect(() => {
    if (liveState.success) {
      toast({ title: liveState.message, description: `Newsletter ist jetzt ${liveState.isLive ? 'live und gesperrt' : 'wieder ein Entwurf'}.` });
      setIsLive(liveState.isLive || false);
    }
    if (liveState.error) {
      toast({ variant: "destructive", title: "Fehler", description: liveState.error });
    }
  }, [liveState, toast]);

  const handleFormSubmit = (formData: FormData) => {
    if (isLive) return;
    formData.set('id', newsletter.id);
    formData.set('name', name);
    formData.set('subject', subject);
    formData.set('useWrapper', useWrapper.toString());
    formData.set('content', htmlContent);
    if (!hasManuallyEditedHtml) {
      formData.set('components', JSON.stringify(components));
    } else {
      formData.set('components', '[]'); 
    }
    updateFormAction(formData);
  };
  
  const handleHtmlChange = (value: string) => {
    if (isLive) return;
    setHasManuallyEditedHtml(true);
    setHtmlContent(value);
  }

  const addComponent = (type: NewsletterComponent['type']) => {
      if (isLive) return;
      const newComponent: NewsletterComponent = {
          id: `${type}-${Date.now()}`,
          type: type,
          props: {}
      };
      setComponents(prev => [...prev, newComponent]);
      setHasManuallyEditedHtml(false);
  };

  const updateComponent = (id: string, props: any) => {
      if (isLive) return;
      setComponents(prev => prev.map(c => c.id === id ? { ...c, props } : c));
      setHasManuallyEditedHtml(false);
  };
  
  const deleteComponent = (id: string) => {
      if (isLive) return;
      setComponents(prev => prev.filter(c => c.id !== id));
      setHasManuallyEditedHtml(false);
  };

  const moveComponent = (id: string, direction: 'up' | 'down') => {
      if (isLive) return;
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

  const handleCopyPreviewLink = () => {
    navigator.clipboard.writeText(previewUrl);
    toast({
        title: "Kopiert!",
        description: "Der Vorschau-Link wurde in die Zwischenablage kopiert.",
    });
  }

  return (
    <div className="grid md:grid-cols-[350px_1fr] h-full">
        {/* Sidebar */}
        <div className="flex flex-col bg-background border-r h-full">
            <div className="p-4 border-b flex items-center justify-between">
                 <Link href="/admin">
                    <Button variant="outline" size="sm">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Zurück
                    </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={handleCopyPreviewLink}>
                    <Copy className="mr-2 h-4 w-4" /> Link kopieren
                </Button>
            </div>
            <div className="p-4 space-y-4 flex-grow overflow-y-auto">
                {isLive && (
                    <Alert variant="destructive">
                        <Radio className="h-4 w-4"/>
                        <AlertTitle className="font-bold">ON AIR - Live-Modus aktiv</AlertTitle>
                        <AlertDescription>
                            Dieser Newsletter wurde live geschaltet und ist für Bearbeitungen gesperrt, um die Integrität der versendeten Kampagne zu wahren.
                        </AlertDescription>
                    </Alert>
                )}
                <div>
                    <Label htmlFor="name">Interner Name</Label>
                    <Input id="name" value={name} onChange={e => setName(e.target.value)} disabled={isLive}/>
                </div>
                 <div>
                    <Label htmlFor="subject">Betreff</Label>
                    <Input id="subject" value={subject} onChange={e => setSubject(e.target.value)} disabled={isLive}/>
                </div>

                <Accordion type="single" collapsible className="w-full" defaultValue="settings">
                    <AccordionItem value="settings">
                        <AccordionTrigger className="hover:no-underline text-sm font-semibold">
                            <div className="flex items-center gap-2">
                                <Settings className="h-4 w-4" /> Einstellungen
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="p-4 space-y-4">
                            <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                                <div className="space-y-0.5">
                                    <Label>Standard E-Mail Layout</Label>
                                    <p className="text-xs text-muted-foreground">
                                        Aktivieren, um den Inhalt in einen 600px breiten Container mit Header/Footer zu packen.
                                    </p>
                                </div>
                                <Switch checked={useWrapper} onCheckedChange={setUseWrapper} disabled={isLive}/>
                            </div>
                            <LiveStatusToggle id={newsletter.id} isLive={isLive} />
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>


                 <div>
                    <h3 className="text-sm font-medium mb-2 mt-4 flex items-center gap-2"><Box className="h-4 w-4"/>Komponenten</h3>
                    {(hasManuallyEditedHtml && !isLive) && (
                        <div className="p-2 mb-2 text-xs bg-yellow-100 border border-yellow-300 rounded-md text-yellow-800">
                           Sie bearbeiten den HTML-Code manuell. Komponenten-Änderungen werden nicht mehr synchronisiert. Speichern Sie, um die visuellen Komponenten wieder zu aktivieren.
                        </div>
                    )}
                    <Accordion type="single" collapsible className="w-full space-y-2" disabled={isLive}>
                        {components.map((comp) => (
                           <ComponentEditor 
                                key={comp.id} 
                                component={comp} 
                                onUpdate={updateComponent}
                                onDelete={deleteComponent}
                                onMove={moveComponent}
                                isLive={isLive}
                            />
                        ))}
                    </Accordion>
                </div>
            </div>
            <div className="p-4 border-t space-y-2">
                 <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" onClick={() => addComponent('heading')} disabled={isLive}><Type className="mr-2 h-4 w-4"/>Überschrift</Button>
                    <Button variant="outline" onClick={() => addComponent('text')} disabled={isLive}><Type className="mr-2 h-4 w-4"/>Text</Button>
                    <Button variant="outline" onClick={() => addComponent('button')} disabled={isLive}><LinkIcon className="mr-2 h-4 w-4"/>Button</Button>
                    <Button variant="outline" onClick={() => addComponent('image')} disabled={isLive}><ImageIcon className="mr-2 h-4 w-4"/>Bild</Button>
                    <Button variant="outline" onClick={() => addComponent('spacer')} disabled={isLive}><Rows className="mr-2 h-4 w-4"/>Abstand</Button>
                    <Button variant="outline" onClick={() => addComponent('separator')} disabled={isLive}><Minus className="mr-2 h-4 w-4"/>Trenner</Button>
                    <Button variant="outline" onClick={() => addComponent('two-columns')} disabled={isLive}><Columns className="mr-2 h-4 w-4"/>Zwei Spalten</Button>
                    <Button variant="outline" onClick={() => addComponent('image-text')} disabled={isLive}><GalleryHorizontal className="mr-2 h-4 w-4"/>Bild & Text</Button>
                    <Button variant="outline" onClick={() => addComponent('customHtml')} className="col-span-2" disabled={isLive}><Code className="mr-2 h-4 w-4"/>Custom HTML</Button>
                </div>
                <form action={handleFormSubmit}>
                    <SubmitButton isLive={isLive} />
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

    

    