import { ImageWithLoader as Image } from "@/components/ui/image-with-loader";

export default function AuthPage() {
    return (
        <div>
            <h1 className="text-4xl font-bold font-headline tracking-tighter">Benutzerverwaltung (Firebase Auth)</h1>
            <p className="text-muted-foreground mt-1">Verwalten Sie hier Ihre App-Benutzer.</p>
            {/* Hier kommen die Inhalte für die Auth-Verwaltung hin */}
        </div>
    );
}
