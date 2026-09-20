"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useActionState } from "react";
import { 
    Newsletter,
    LegalPage,
    Palabrota,
    Chiste,
    Excerpt
} from "@/lib/firestore";
import {
    addNewsletterAction,
    deleteNewsletterAction,
    duplicateNewsletterAction,
    updateExcerptAction
} from "@/components/admin/actions";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, VenetianMask, FileText, PlusCircle, Trash2, Edit, Mail, Copy, Send, BookOpen, ArrowUpRight, Sparkles } from "lucide-react";
import { Badge } from "../ui/badge";
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { cn } from "@/lib/utils";

type AdminDashboardProps = {
    defaultTab?: string;
    initialNewsletters?: Newsletter[];
    initialLegalPages?: LegalPage[];
    initialPalabrotas?: Palabrota[];
    initialChistes?: Chiste[];
    initialExcerpts?: Excerpt[];
};

export function AdminDashboard({ defaultTab = "übersicht",
    initialNewsletters, 
    initialLegalPages, 
    initialPalabrotas, 
    initialChistes,
    initialExcerpts
}: AdminDashboardProps) {
    const [activeTab, setActiveTab] = useState(defaultTab);
    
    const newsletters = initialNewsletters || [];
    const legalPages = initialLegalPages || [];
    const palabrotas = initialPalabrotas || [];
    const excerpts = initialExcerpts || [];

    return (
        <div className="space-y-6">
            <header>
                <h1 className="text-xl font-medium text-gray-900">Dashboard</h1>
                <p className="text-sm text-gray-500 mt-1">Übersicht über Ihre Projekt-Ressourcen.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                 <Card className="gcp-card">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Newsletter</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{newsletters.length}</div>
                        <p className="text-xs text-muted-foreground">Erstellte Vorlagen</p>
                    </CardContent>
                </Card>
                 <Card className="gcp-card">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Dynamische Seiten</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{legalPages.length}</div>
                        <p className="text-xs text-muted-foreground">Verwaltete LPs & Seiten</p>
                    </CardContent>
                </Card>
                 <Card className="gcp-card">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Palabrotas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{palabrotas.length}</div>
                        <p className="text-xs text-muted-foreground">Einträge im Wörterbuch</p>
                    </CardContent>
                </Card>
                 <Card className="gcp-card">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Exzerpte</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{excerpts.length}</div>
                        <p className="text-xs text-muted-foreground">Verwaltete Buchauszüge</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
