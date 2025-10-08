
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle } from "lucide-react";

export function PromptingGuide() {
    return (
        <Card className="mt-24 max-w-4xl mx-auto border-2 border-dashed">
            <CardHeader className="text-center">
                <CardTitle className="font-headline text-3xl">Anleitung für präzise Anfragen an eine KI (für Max)</CardTitle>
                <CardDescription>Ein kurzer Leitfaden, um die Zusammenarbeit mit unserem digitalen Assistenten zu optimieren.</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4 p-6 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <h3 className="font-headline text-xl font-bold flex items-center gap-2"><CheckCircle2 className="text-green-600"/> So geht's (Go's)</h3>
                    <ul className="space-y-2 list-disc pl-5 text-muted-foreground">
                        <li>
                            <strong>Sei spezifisch:</strong> Statt "ändere das Layout" sage "ändere die Buch-Karten zu einem 2-Spalten-Layout auf Desktop und 1-Spalte auf Mobil".
                        </li>
                        <li>
                            <strong>Gib Kontext:</strong> Erwähne die Komponente oder den Abschnitt. "Im 'Warum Sie beide Bücher brauchen'-Abschnitt..." ist besser als "da unten".
                        </li>
                        <li>
                            <strong>Schritt für Schritt:</strong> Bei komplexen Änderungen, teile sie in kleinere, klare Anweisungen auf.
                        </li>
                        <li>
                            <strong>Referenziere den Code:</strong> "Ändere in `book-grid.tsx` die Klasse `bg-blue-100` zu `bg-blue-300`" ist perfekt.
                        </li>
                    </ul>
                </div>
                 <div className="space-y-4 p-6 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <h3 className="font-headline text-xl font-bold flex items-center gap-2"><XCircle className="text-red-600"/> So lieber nicht (No-Go's)</h3>
                     <ul className="space-y-2 list-disc pl-5 text-muted-foreground">
                        <li>
                            <strong>Vage Anfragen:</strong> "mach das schöner" oder "sieht komisch aus" sind nicht hilfreich. Was genau ist nicht schön?
                        </li>
                        <li>
                            <strong>Mehrdeutigkeit:</strong> "Ändere den Button" - welcher von den zehn?
                        </li>
                        <li>
                            <strong>Annahmen treffen:</strong> Gehe nicht davon aus, dass die KI weiß, was du "meinst". Formuliere, was du "sagst".
                        </li>
                         <li>
                            <strong>Widersprüchliche Anweisungen:</strong> "Mach es größer und kleiner zugleich."
                        </li>
                    </ul>
                </div>
            </CardContent>
        </Card>
    );
}
