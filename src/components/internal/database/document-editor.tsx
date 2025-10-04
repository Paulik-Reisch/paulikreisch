
"use client";

import React, { useState, useEffect } from 'react';
import { useActionState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { updateDocumentAction, ActionResponse } from '@/app/internal/database/actions';

const initialFormState: ActionResponse = { success: false };

function renderField(key: string, value: any, schema: Record<string, any>, onFieldChange: (field: string, value: any) => void) {
    const fieldSchema = schema[key] || {};
    const type = fieldSchema.type || (typeof value === 'boolean' ? 'boolean' : typeof value === 'number' ? 'number' : 'string');
    const label = fieldSchema.label || key;
    const isReadonly = fieldSchema.readonly || false;

    if (type === 'boolean') {
        return (
             <div className="flex items-center space-x-2">
                <Checkbox
                    id={key}
                    checked={value}
                    onCheckedChange={(checked) => onFieldChange(key, checked)}
                    disabled={isReadonly}
                />
                <Label htmlFor={key} className="cursor-pointer">{label}</Label>
            </div>
        );
    }
    
    if (type === 'textarea' || (typeof value === 'string' && value.length > 100)) {
         return (
            <div>
                <Label htmlFor={key}>{label}</Label>
                <Textarea
                    id={key}
                    value={value || ''}
                    onChange={(e) => onFieldChange(key, e.target.value)}
                    readOnly={isReadonly}
                    rows={5}
                />
            </div>
        );
    }

    if (Array.isArray(value)) {
         return (
            <div>
                <Label htmlFor={key}>{label} (Komma-getrennt)</Label>
                <Textarea
                    id={key}
                    value={value.join(', ')}
                    onChange={(e) => onFieldChange(key, e.target.value.split(',').map(s => s.trim()))}
                    readOnly={isReadonly}
                />
            </div>
        );
    }
    
    if (typeof value === 'object' && value !== null && !Array.isArray(value) && value.seconds === undefined) {
         return (
             <div>
                <Label htmlFor={key}>{label} (JSON)</Label>
                <Textarea
                    id={key}
                    value={JSON.stringify(value, null, 2)}
                    onChange={(e) => {
                        try {
                           onFieldChange(key, JSON.parse(e.target.value))
                        } catch (err) {
                           // Handle JSON parse error if needed
                        }
                    }}
                    readOnly={isReadonly}
                    rows={8}
                    className="font-mono text-xs"
                />
            </div>
        )
    }

    return (
        <div>
            <Label htmlFor={key}>{label}</Label>
            <Input
                id={key}
                type={type}
                value={value ?? ''}
                onChange={(e) => onFieldChange(key, e.target.value)}
                readOnly={isReadonly}
            />
        </div>
    );
}

export function DocumentEditor({
    collectionId,
    document,
    schema,
    onSave,
    children
}: {
    collectionId: string,
    document?: any,
    schema: Record<string, any>,
    onSave: () => void,
    children: React.ReactNode,
}) {
    const isNew = !document;
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState(document || {});
    const [state, formAction, isPending] = useActionState(updateDocumentAction, initialFormState);
    const { toast } = useToast();

    useEffect(() => {
        if (document) {
            setFormData(document);
        } else {
            // Create a new object with default values from schema
            const newDoc: Record<string, any> = {};
            Object.keys(schema).forEach(key => {
                 newDoc[key] = schema[key].type === 'number' ? 0 : schema[key].type === 'boolean' ? false : '';
            });
            setFormData(newDoc);
        }
    }, [document, schema]);

    useEffect(() => {
        if (state.success) {
            toast({ title: "Erfolg", description: state.message });
            setIsOpen(false);
            onSave();
        }
        if (state.error) {
            toast({ variant: "destructive", title: "Fehler", description: state.error });
        }
    }, [state, toast, onSave]);

    const handleFieldChange = (field: string, value: any) => {
        setFormData((prev: any) => ({ ...prev, [field]: value }));
    };
    
    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const actionFormData = new FormData();
        actionFormData.set('collectionId', collectionId);
        if (!isNew) {
            actionFormData.set('documentId', formData.id);
        }
        
        // Remove ID from payload as it's not part of the document data itself
        const payload = { ...formData };
        delete payload.id;
        
        actionFormData.set('payload', JSON.stringify(payload));
        formAction(actionFormData);
    }
    
    // Determine which fields to show: schema fields first, then other fields
    const allKeys = [...Object.keys(schema), ...Object.keys(formData).filter(k => !schema[k] && k !== 'id')];
    const uniqueKeys = Array.from(new Set(allKeys));


    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                 <form onSubmit={handleFormSubmit}>
                    <DialogHeader>
                        <DialogTitle>
                            {isNew ? `Neues Dokument in '${collectionId}'` : `Dokument bearbeiten (ID: ${formData.id})`}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-6">
                        {uniqueKeys.map(key => (
                           <div key={key}>
                                {renderField(key, formData[key], schema, handleFieldChange)}
                           </div>
                        ))}
                    </div>
                    <DialogFooter>
                        <DialogClose asChild><Button type="button" variant="secondary" className="gcp-button">Abbrechen</Button></DialogClose>
                        <Button type="submit" disabled={isPending} className="gcp-button-primary">
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isNew ? "Hinzufügen" : "Speichern"}
                        </Button>
                    </DialogFooter>
                 </form>
            </DialogContent>
        </Dialog>
    );
}
