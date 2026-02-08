import { getPalabrotas } from "@/lib/firestore";
import { PalabrotasClient } from "./palabrotas-client";

export default async function PalabrotasAdminPage() {
    const palabrotas = await getPalabrotas();

    return (
        <div className="space-y-6">
            <header>
                <h1 className="text-3xl font-bold font-headline">Palabrotas-Duden</h1>
                <p className="text-muted-foreground">Verwalten Sie hier den essenziellen Wortschatz für den Weltbürger.</p>
            </header>
            <PalabrotasClient initialData={palabrotas} />
        </div>
    );
}
