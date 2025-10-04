import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Database, HardDrive, Cloud, ExternalLink, ArrowRight } from "lucide-react";
import Link from "next/link";

const dashboardLinks = [
    {
        title: "Google Cloud Console",
        description: "Verwalten Sie Ihr Projekt, APIs und Berechtigungen direkt in der Google Cloud Console.",
        href: "https://console.cloud.google.com/",
        icon: Cloud,
        isExternal: true,
    },
    {
        title: "Firestore Database",
        description: "Sehen und verwalten Sie Ihre NoSQL-Datenbank, Indizes und Abfragen.",
        href: "/internal/database",
        icon: Database,
        isExternal: false,
    },
    {
        title: "Cloud Storage",
        description: "Verwalten Sie Ihre hochgeladenen Dateien, Bilder und andere binäre Daten.",
        href: "/internal/storage",
        icon: HardDrive,
        isExternal: false,
    }
];

export function InternalDashboard() {
  return (
    <div>
        <header className="mb-8">
            <h1 className="text-4xl font-bold font-headline tracking-tighter">IDS Manager Dashboard</h1>
            <p className="text-muted-foreground mt-1">Übersicht über Ihre Backend-Ressourcen.</p>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dashboardLinks.map(link => (
                <Card key={link.title} className="flex flex-col">
                    <CardHeader>
                        <div className="flex items-center gap-4">
                            <div className="bg-primary/10 text-primary p-3 rounded-lg">
                                <link.icon className="h-6 w-6"/>
                            </div>
                            <CardTitle>{link.title}</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <CardDescription>{link.description}</CardDescription>
                    </CardContent>
                    <CardContent>
                         <Link href={link.href} target={link.isExternal ? "_blank" : "_self"} rel={link.isExternal ? "noopener noreferrer" : ""}>
                            <Button className="w-full">
                                Öffnen 
                                {link.isExternal ? <ExternalLink className="ml-2 h-4 w-4"/> : <ArrowRight className="ml-2 h-4 w-4"/>}
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            ))}
        </div>
    </div>
  );
}
