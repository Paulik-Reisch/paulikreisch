

"use client";

import { useState, useEffect, useActionState, useTransition } from "react";
import Link from "next/link";
import { LegalPage, PageComponent } from "@/lib/firestore";
import { updateLegalPageAction, correctHtmlAction } from "@/app/admin/actions";
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
  Eye,
  Code,
  Sparkles,
  Minus,
  AlignCenter,
  AlignLeft,
  AlignRight,
  Columns,
  AlignVerticalJustifyStart,
  AlignVerticalJustifyCenter,
  AlignVerticalJustifyEnd
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
import { CodeEditor } from "@/components/admin/code-editor";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";

function generatePageHtml(components: PageComponent[]): string {
    return components.map(component => {
        const props = component.props || {};
        
        switch(component.type) {
            case 'heading': {
                const align = props.alignment || 'left';
                const alignClasses: {[key: string]: string} = {
                    left: "text-left",
                    center: "text-center",
                    right: "text-right",
                }
                const Tag = props.level || 'h1';
                const defaultHeadingClasses: {[key:string]: string} = {
                    h1: "text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl",
                    h2: "text-3xl font-bold tracking-tight",
                    h3: "text-2xl font-semibold",
                    h4: "text-xl font-semibold",
                };
                const classes = cn(defaultHeadingClasses[Tag], alignClasses[align], props.className);
                return `<${Tag} class="${classes}">${props.text || ''}</${Tag}>`;
            }
            case 'text': {
                const align = props.alignment || 'left';
                 const alignClasses: {[key: string]: string} = {
                    left: "text-left",
                    center: "text-center",
                    right: "text-right",
                }
                const textClasses = cn('leading-relaxed text-muted-foreground', alignClasses[align], props.className);
                return `<p class="${textClasses}">${(props.text || '').replace(/\n/g, '<br />')}</p>`;
            }
            case 'button': {
                const align = props.alignment || 'left';
                const justifyClasses: {[key: string]: string} = {
                    left: "justify-start",
                    center: "justify-center",
                    right: "justify-end",
                }
                 const buttonContainerClasses = cn("my-6 flex", justifyClasses[align]);
                 return `<div class="${buttonContainerClasses}"><a href="${props.href || '#'}" class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 shadow-md transform active:scale-95 border h-11 px-8 bg-primary text-primary-foreground hover:bg-primary/90">${props.text || 'Klick'}</a></div>`;
            }
            case 'image': {
                const align = props.alignment || 'left';
                 const justifyClasses: {[key: string]: string} = {
                    left: "justify-start",
                    center: "justify-center",
                    right: "justify-end",
                }
                 const imageContainerClasses = cn("my-6 flex", justifyClasses[align]);
                 return `<div class="${imageContainerClasses}"><img src="${props.src || 'https://placehold.co/800x450'}" alt="${props.alt || ''}" style="max-width: ${props.width || '100%'};" class="h-auto rounded-lg shadow-md" /></div>`;
            }
            case 'spacer':
                 return `<div style="height: ${props.height || '2rem'}"></div>`;
            case 'separator': {
                const color = props.color || 'hsl(var(--border))';
                const thickness = props.thickness || '1px';
                const style = props.style || 'solid';
                return `<hr style="border: none; border-top: ${thickness} ${style} ${color}; margin: 2rem 0;" />`;
            }
            case 'columns': {
                const numColumns = props.numColumns || 2;
                const gap = props.gap || '1rem';
                const verticalAlignment = props.verticalAlignment || 'start';
                
                const columnClasses = `grid grid-cols-1 md:grid-cols-${numColumns} items-${verticalAlignment}`;
                
                const columnsHtml = (props.columns || []).map((col: any) => {
                    const colBg = col.bgColor ? `background-color: ${col.bgColor};` : '';
                    const colPadding = col.padding || '1rem';
                    const colBorderRadius = col.borderRadius || '0.5rem';
                    const content = col.content || '';
                    return `<div style="${colBg} padding: ${colPadding}; border-radius: ${colBorderRadius};">${content}</div>`;
                }).join('\n');

                return `<div class="${columnClasses} my-6" style="gap: ${gap};">${columnsHtml}</div>`
            }
            case 'customHtml': {
                return props.html || '';
            }
            default:
                return '';
        }
    }).join('\n');
}

type AdminLegalPageState = {
  success: boolean;
  error: string | null;
  message?: string;
};
const initialLegalPageState: AdminLegalPageState = { success: false, error: null };

function PageComponentEditor({ component, onUpdate, onDelete, onMove }: { component: PageComponent, onUpdate: (id: string, props: any) => void, onDelete: (id: string) => void, onMove: (id: string, direction: 'up' | 'down') => void }) {
    
    const updateProp = (propName: string, value: any) => {
        onUpdate(component.id, { ...component.props, [propName]: value });
    };

    const updateColumnProp = (index: number, propName: string, value: any) => {
        const newColumns = [...(component.props.columns || [])];
        newColumns[index] = { ...newColumns[index], [propName]: value };
        onUpdate(component.id, { ...component.props, columns: newColumns });
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

     const renderTextarea = (propName: string, label: string, rows = 4) => (
         <div key={propName}>
            <Label htmlFor={`${component.id}-${propName}`} className="text-xs">{label}</Label>
            <Textarea 
                id={`${component.id}-${propName}`} 
                value={component.props[propName] || ''} 
                onChange={(e) => updateProp(propName, e.target.value)}
                className="text-xs"
                rows={rows}
            />
        </div>
    );
    
    const renderAlignmentSelector = () => (
         <div>
            <Label className="text-xs">Ausrichtung</Label>
            <div className="flex gap-1 mt-1">
                {(['left', 'center', 'right'] as const).map(align => (
                     <Button key={align} size="icon" variant={component.props.alignment === align ? "secondary" : "ghost"} className="h-8 w-8" onClick={() => updateProp('alignment', align)}>
                        {align === 'left' && <AlignLeft className="h-4 w-4" />}
                        {align === 'center' && <AlignCenter className="h-4 w-4" />}
                        {align === 'right' && <AlignRight className="h-4 w-4" />}
                    </Button>
                ))}
            </div>
        </div>
    );

    const renderContent = () => {
        switch(component.type) {
            case 'heading': return (
                <div className="space-y-4">
                    {renderField('text', 'Überschrift')}
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <Label htmlFor={`${component.id}-level`} className="text-xs">Ebene</Label>
                            <Select onValueChange={(v) => updateProp('level', v)} defaultValue={component.props.level || 'h1'}>
                                <SelectTrigger className="h-8">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="h1">H1</SelectItem>
                                    <SelectItem value="h2">H2</SelectItem>
                                    <SelectItem value="h3">H3</SelectItem>
                                    <SelectItem value="h4">H4</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex-1">
                            {renderAlignmentSelector()}
                        </div>
                    </div>
                    {renderField('className', 'Zusätzliche CSS-Klassen (Tailwind)', 'text', 'z.B. text-primary')}
                </div>
            );
            case 'text': return (
                <div className="space-y-4">
                    {renderTextarea('text', 'Text (unterstützt Zeilenumbrüche)')}
                    {renderAlignmentSelector()}
                    {renderField('className', 'Zusätzliche CSS-Klassen (Tailwind)', 'text', 'z.B. text-lg')}
                </div>
            );
            case 'button': return (
                <div className="space-y-4">
                    {renderField('text', 'Button-Text')}
                    {renderField('href', 'Button-Link (URL)')}
                    {renderAlignmentSelector()}
                </div>
            );
            case 'image': return (
                <div className="space-y-4">
                    {renderField('src', 'Bild-URL')}
                    {renderField('alt', 'Alternativtext')}
                    {renderField('width', 'Maximale Breite (z.B. 500px, 80%)', 'text', '100%')}
                    {renderAlignmentSelector()}
                </div>
            );
            case 'spacer': return (
                <div className="space-y-4">
                    {renderField('height', 'Höhe (z.B. 2rem, 32px)')}
                </div>
            );
            case 'separator': return (
                 <div className="space-y-4">
                    <div className="flex gap-2 items-end">
                        {renderColorInput('color', 'Farbe', '#cccccc')}
                        <div className="flex-1">
                            <Label htmlFor={`${component.id}-thickness`} className="text-xs">Dicke (px)</Label>
                            <Input id={`${component.id}-thickness`} type="number" value={component.props.thickness ? parseInt(component.props.thickness) : 1} onChange={(e) => updateProp('thickness', e.target.value + 'px')} className="h-8"/>
                        </div>
                    </div>
                     <div className="flex-1">
                        <Label htmlFor={`${component.id}-style`} className="text-xs">Stil</Label>
                         <Select onValueChange={(v) => updateProp('style', v)} defaultValue={component.props.style || 'solid'}>
                            <SelectTrigger className="h-8">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="solid">Durchgezogen</SelectItem>
                                <SelectItem value="dashed">Gestrichelt</SelectItem>
                                <SelectItem value="dotted">Gepunktet</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            );
            case 'columns': return (
                 <div className="space-y-4">
                    <div className="flex gap-4">
                        <div className="flex-1">
                             <Label htmlFor={`${component.id}-numColumns`} className="text-xs">Anzahl Spalten</Label>
                            <Select onValueChange={(v) => updateProp('numColumns', parseInt(v))} defaultValue={String(component.props.numColumns || 2)}>
                                <SelectTrigger className="h-8">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="2">2</SelectItem>
                                    <SelectItem value="3">3</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                         <div className="flex-1">
                            {renderField('gap', 'Abstand (z.B. 1rem)', 'text', '1rem')}
                        </div>
                    </div>
                    <div>
                        <Label className="text-xs">Vertikale Ausrichtung</Label>
                        <div className="flex gap-1 mt-1">
                            {(['start', 'center', 'end'] as const).map(align => (
                                <Button key={align} size="icon" variant={component.props.verticalAlignment === align ? "secondary" : "ghost"} className="h-8 w-8" onClick={() => updateProp('verticalAlignment', align)}>
                                    {align === 'start' && <AlignVerticalJustifyStart className="h-4 w-4" />}
                                    {align === 'center' && <AlignVerticalJustifyCenter className="h-4 w-4" />}
                                    {align === 'end' && <AlignVerticalJustifyEnd className="h-4 w-4" />}
                                </Button>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-4">
                        {Array.from({ length: component.props.numColumns || 2 }).map((_, index) => (
                            <div key={index} className="p-3 border rounded-md bg-muted/50 space-y-2">
                                <h4 className="text-xs font-semibold">Spalte {index + 1}</h4>
                                <div>
                                    <Label htmlFor={`${component.id}-col-${index}-content`} className="text-xs">Inhalt (HTML)</Label>
                                    <Textarea
                                        id={`${component.id}-col-${index}-content`}
                                        value={component.props.columns?.[index]?.content || ''}
                                        onChange={(e) => updateColumnProp(index, 'content', e.target.value)}
                                        className="text-xs font-mono"
                                        rows={6}
                                    />
                                </div>
                            </div>
                        ))}
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
        text: <Pilcrow className="h-4 w-4" />,
        button: <LinkIcon className="h-4 w-4" />,
        image: <ImageIcon className="h-4 w-4" />,
        spacer: <Rows className="h-4 w-4" />,
        separator: <Minus className="h-4 w-4" />,
        columns: <Columns className="h-4 w-4" />,
        customHtml: <Code className="h-4 w-4" />,
    }

    return (
        <AccordionItem value={component.id} className="bg-background">
            <AccordionTrigger className="hover:no-underline p-2 rounded-t-md border">
                <div className="flex items-center gap-2 text-sm font-semibold w-full">
                    {typeIcons[component.type]}
                    <span className="capitalize flex-grow text-left">{component.type}</span>
                    <Button type="button" size="icon" variant="ghost" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); onMove(component.id, 'up'); }}><ArrowUp className="h-4 w-4"/></Button>
                    <Button type="button" size="icon" variant="ghost" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); onMove(component.id, 'down'); }}><ArrowDown className="h-4 w-4"/></Button>
                    <Button type="button" size="icon" variant="destructive" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); onDelete(component.id); }}><Trash2 className="h-4 w-4"/></Button>
                </div>
            </AccordionTrigger>
            <AccordionContent className="p-4 border border-t-0 rounded-b-md">
                {renderContent()}
            </AccordionContent>
        </AccordionItem>
    )
}

export function EditorClient({ page }: { page: LegalPage }) {
  const [title, setTitle] = useState(page.title);
  const [components, setComponents] = useState<PageComponent[]>(page.components || []);
  const [generatedHtml, setGeneratedHtml] = useState(page.content || '');
  const [hasManuallyEditedHtml, setHasManuallyEditedHtml] = useState(false);
  const [formattedDate, setFormattedDate] = useState<string | null>(null);
  const [showTitle, setShowTitle] = useState(page.showTitle !== false);
  const [showDate, setShowDate] = useState(page.showDate !== false);


  const [updateState, updateFormAction] = useActionState(updateLegalPageAction, initialLegalPageState);
  const [correctState, correctFormAction] = useActionState(correctHtmlAction, { correctedHtml: undefined, error: undefined });

  const { toast } = useToast();
  const [isSaving, startSavingTransition] = useTransition();
  const [isCorrecting, startCorrectingTransition] = useTransition();

  useEffect(() => {
    // This effect runs only on the client, after hydration
    setFormattedDate(new Date(page.lastUpdated).toLocaleString('de-DE'));
    
    // Initial HTML generation
    if (page.components && page.components.length > 0 && !page.content) {
        setGeneratedHtml(generatePageHtml(page.components));
    } else if (page.content) {
        setHasManuallyEditedHtml(true);
    }
  }, [page.lastUpdated, page.components, page.content]);

  useEffect(() => {
      if (!hasManuallyEditedHtml) {
        setGeneratedHtml(generatePageHtml(components));
      }
  }, [components, hasManuallyEditedHtml]);

  useEffect(() => {
    if (updateState.success) {
      toast({ title: "Erfolg", description: updateState.message });
      setHasManuallyEditedHtml(false);
    }
    if (updateState.error) {
      toast({ variant: "destructive", title: "Fehler", description: updateState.error });
    }
  }, [updateState, toast]);

   useEffect(() => {
    if (correctState.correctedHtml) {
        setGeneratedHtml(correctState.correctedHtml);
        setHasManuallyEditedHtml(true);
        toast({ title: "KI-Korrektur", description: "Der HTML-Code wurde von der KI optimiert." });
    }
    if (correctState.error) {
        toast({ variant: "destructive", title: "Fehler", description: correctState.error });
    }
  }, [correctState, toast]);


  const handleFormSubmit = (formData: FormData) => {
    startSavingTransition(() => {
        formData.set('pageId', page.id);
        formData.set('title', title);
        formData.set('showTitle', String(showTitle));
        formData.set('showDate', String(showDate));
        
        if(hasManuallyEditedHtml) {
            formData.set('content', generatedHtml);
            formData.set('components', JSON.stringify([])); // Clear components if HTML was manually edited
        } else {
            const freshHtml = generatePageHtml(components);
            formData.set('content', freshHtml);
            formData.set('components', JSON.stringify(components));
        }
        updateFormAction(formData);
    });
  };

  const handleCorrectHtml = () => {
    startCorrectingTransition(() => {
        const formData = new FormData();
        formData.set('html', generatedHtml);
        correctFormAction(formData);
    });
  };
  
  const addComponent = (type: PageComponent['type']) => {
      let props = {};
      if (type === 'columns') {
        props = { numColumns: 2, columns: Array.from({length: 2}, () => ({ content: ''})), gap: '1rem', verticalAlignment: 'start' }
      }
      const newComponent: PageComponent = {
          id: `${type}-${Date.now()}`,
          type: type,
          props
      };
      setComponents(prev => [...prev, newComponent]);
      setHasManuallyEditedHtml(false);
  };

  const updateComponent = (id: string, props: any) => {
      const oldComponent = components.find(c => c.id === id);
      if (oldComponent?.type === 'columns' && props.numColumns !== oldComponent.props.numColumns) {
          props.columns = Array.from({ length: props.numColumns }, (_, i) => props.columns[i] || { content: '' });
      }
      setComponents(prev => prev.map(c => c.id === id ? { ...c, props } : c));
      setHasManuallyEditedHtml(false);
  };
  
  const deleteComponent = (id: string) => {
      setComponents(prev => prev.filter(c => c.id !== id));
      setHasManuallyEditedHtml(false);
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

  const handleHtmlChange = (value: string) => {
    setHasManuallyEditedHtml(true);
    setGeneratedHtml(value);
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

                <div className="space-y-4">
                    <div className="flex items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                            <Label>Titel anzeigen</Label>
                            <p className="text-xs text-muted-foreground">
                                Zeigt den Titel auf der Live-Seite an.
                            </p>
                        </div>
                        <Switch checked={showTitle} onCheckedChange={setShowTitle} />
                    </div>
                     <div className="flex items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                            <Label>Datum anzeigen</Label>
                            <p className="text-xs text-muted-foreground">
                                Zeigt das "Zuletzt aktualisiert"-Datum an.
                            </p>
                        </div>
                        <Switch checked={showDate} onCheckedChange={setShowDate} />
                    </div>
                </div>

                <div>
                    <h3 className="text-sm font-medium mb-2">Komponenten</h3>
                     {hasManuallyEditedHtml && (
                        <div className="p-2 mb-2 text-xs bg-yellow-100 border border-yellow-300 rounded-md text-yellow-800">
                           HTML wurde manuell bearbeitet. Der Komponenten-Editor ist deaktiviert. Änderungen im Code haben Priorität.
                        </div>
                    )}
                    <Accordion type="single" collapsible className="w-full space-y-2" disabled={hasManuallyEditedHtml}>
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
                    <Button variant="outline" onClick={() => addComponent('heading')} disabled={hasManuallyEditedHtml}><Type className="mr-2 h-4 w-4"/>Überschrift</Button>
                    <Button variant="outline" onClick={() => addComponent('text')} disabled={hasManuallyEditedHtml}><Pilcrow className="mr-2 h-4 w-4"/>Text</Button>
                    <Button variant="outline" onClick={() => addComponent('button')} disabled={hasManuallyEditedHtml}><LinkIcon className="mr-2 h-4 w-4"/>Button</Button>
                    <Button variant="outline" onClick={() => addComponent('image')} disabled={hasManuallyEditedHtml}><ImageIcon className="mr-2 h-4 w-4"/>Bild</Button>
                    <Button variant="outline" onClick={() => addComponent('spacer')} disabled={hasManuallyEditedHtml}><Rows className="mr-2 h-4 w-4"/>Abstand</Button>
                    <Button variant="outline" onClick={() => addComponent('separator')} disabled={hasManuallyEditedHtml}><Minus className="mr-2 h-4 w-4"/>Trennlinie</Button>
                    <Button variant="outline" onClick={() => addComponent('columns')} disabled={hasManuallyEditedHtml}><Columns className="mr-2 h-4 w-4"/>Spalten</Button>
                    <Button variant="outline" onClick={() => addComponent('customHtml')} disabled={hasManuallyEditedHtml}><Code className="mr-2 h-4 w-4"/>Custom HTML</Button>
                </div>
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
                                Seite speichern
                            </>
                        )}
                    </Button>
                </form>
            </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 flex flex-col p-4 md:p-6 overflow-y-auto h-full bg-background border rounded-lg">
             <Tabs defaultValue="preview" className="w-full h-full flex flex-col">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="preview"><Eye className="mr-2 h-4 w-4"/>Live-Vorschau</TabsTrigger>
                     <TabsTrigger value="code"><Code className="mr-2 h-4 w-4"/>HTML-Code</TabsTrigger>
                </TabsList>
                <TabsContent value="preview" className="mt-4 flex-grow bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
                     <iframe
                        srcDoc={`<html><head><link href="/globals.css" rel="stylesheet"><script src="https://cdn.tailwindcss.com"></script></head><body class="bg-background text-foreground"><div class="p-4 space-y-6">${generatedHtml}</div></body></html>`}
                        title="Seiten-Vorschau"
                        className="w-full h-full border bg-white"
                    />
                </TabsContent>
                <TabsContent value="code" className="mt-4 flex-grow flex flex-col min-h-0">
                    <div className="flex-grow min-h-0">
                         <CodeEditor 
                            value={generatedHtml}
                            onChange={handleHtmlChange}
                        />
                    </div>
                    <div className="pt-2 flex justify-end">
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm" disabled={isCorrecting}>
                                {isCorrecting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                                KI-Korrektur
                                </Button>
                            </AlertDialogTrigger>
                             <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>HTML mit KI korrigieren?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Diese Aktion analysiert den aktuellen HTML-Code und versucht, ihn zu bereinigen und zu verbessern, ohne den Inhalt zu verändern. Bestehende Komponenten-Struktur geht verloren. Fortfahren?
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                                <AlertDialogAction onClick={handleCorrectHtml}>Ja, korrigieren</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </TabsContent>
            </Tabs>
        </main>
    </div>
  );
}
