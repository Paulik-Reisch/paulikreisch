import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Database, HardDrive, Cloud, ExternalLink, ArrowRight, Users, BrainCircuit, TestTube2, Palette, Navigation } from "lucide-react";
import Link from "next/link";

const dashboardLinks = [
    {
        title: "Benutzerverwaltung",
        description: "Verwalten Sie App-Benutzer, Rollen und Berechtigungen.",
        href: "/internal/isdm/auth",
        icon: Users,
    },
    {
        title: "Firestore Database",
        description: "Sehen und verwalten Sie Ihre NoSQL-Datenbank, Indizes und Abfragen.",
        href: "/internal/isdm/database",
        icon: Database,
    },
    {
        title: "Cloud Storage",
        description: "Verwalten Sie Ihre hochgeladenen Dateien, Bilder und andere binäre Daten.",
        href: "/internal/isdm/storage",
        icon: HardDrive,
    },
     {
        title: "KI-Flow Monitoring",
        description: "Überwachen und testen Sie die Leistung und Nutzung Ihrer Genkit AI-Flows.",
        href: "/internal/isdm/genkit",
        icon: BrainCircuit,
    },
    {
        title: "Globaler Content",
        description: "Bearbeiten Sie wiederkehrende Textbausteine und Bilder zentral.",
        href: "/internal/fem/content",
        icon: Cloud,
    },
    {
        title: "A/B-Testing",
        description: "Erstellen und analysieren Sie A/B-Tests für Komponenten und Seiten.",
        href: "/internal/fem/ab-testing",
        icon: TestTube2,
    },
    {
        title: "Navigations-Editor",
        description: "Passen Sie die Menüstruktur Ihrer Webseite per Drag & Drop an.",
        href: "/internal/fem/navigation",
        icon: Navigation,
    },
    {
        title: "Theme & Style-Editor",
        description: "Ändern Sie die Farben und das grundlegende Styling Ihrer App.",
        href: "/internal/fem/theme",
        icon: Palette,
    },
];

export function InternalDashboard() {
  return (
    <div>
        <header className="mb-8">
            <h1 className="text-2xl font-medium text-gray-900">Management Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">Übersicht über Ihre Backend- und Frontend-Ressourcen.</p>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {dashboardLinks.map(link => (
                <Card key={link.title} className="gcp-card flex flex-col">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="bg-primary/10 text-primary p-2 rounded-sm">
                                <link.icon className="h-5 w-5"/>
                            </div>
                            <CardTitle className="text-sm font-medium">{link.title}</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <CardDescription className="text-xs">{link.description}</CardDescription>
                    </CardContent>
                    <CardContent>
                         <Link href={link.href}>
                            <Button className="gcp-button w-full justify-start text-left">
                                Öffnen 
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            ))}
        </div>
    </div>
  );
}
