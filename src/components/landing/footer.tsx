
"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";

export function Footer() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleThemeChange = (checked: boolean) => {
    setTheme(checked ? 'dark' : 'light');
  }
  
  const currentLabel = theme === 'dark' ? 'Darkmode' : 'Whitemode';

  if (!mounted) {
    return (
        <footer className="w-full border-t py-6 md:py-8 bg-muted/40">
        <div className="container mx-auto text-center flex flex-col items-center justify-center">
            <h3 className="font-headline text-2xl font-bold">Hallo Welt – Die Bücherserie</h3>
            <p className="mt-2 text-xs text-muted-foreground max-w-2xl text-balance">
            Die satirische "Hallo Welt"-Bücherserie ist eine Idee und Kreation von Philipp Paulik (Autor), Maximilian Reisch (Autor), Luin Schiffbauer (Illustrator) und weiteren Mitwirkenden.
            Veröffentlicht und produziert durch Kindle Direct Publishing (KDP) der Amazon Distribution GmbH, Leipzig sowie ggf. weiteren Verlags- und Produktionspartnern.
            </p>
             <div className="mt-6 text-xs text-muted-foreground max-w-4xl text-balance border-t pt-4">
                <p>Amazon Media EU S.à r.l. (registrierter Verkäufer von digitalen Inhalten, die mit „Verkauf durch Amazon Media EU SARL“ gekennzeichnet sind und Betrieb des Amazon Luna Spiele-Streaming-Dienstes):</p>
                <p>Amazon Media EU S.à r.l. (Société à responsabilité limitée), 38 avenue John F. Kennedy, L-1855 Luxemburg (Stammkapital: 50.000 EUR; registriert beim RCS Luxemburg; Registernummer: 112767; Gewebescheinnummer: 110001; USt-IdNr.: LU 20944528). Das Unternehmen wird gesetzlich vertreten durch Eric King.</p>
            </div>
            <div className="mt-6 text-xs text-muted-foreground flex flex-wrap gap-x-4 gap-y-2 justify-center items-center">
            <p>© {new Date().getFullYear()} Paulik & Reisch. Alle Rechte vorbehalten.</p>
            <Link href="/impressum" className="hover:underline">Impressum</Link>
            <Link href="/datenschutz" className="hover:underline">Datenschutz</Link>
            <Link href="/cookie-richtlinie" className="hover:underline">Cookie-Richtlinie</Link>
            <Link href="/agb" className="hover:underline">AGB</Link>
            
            <div className="flex items-center space-x-1">
                <Label htmlFor="theme-toggle" className="cursor-pointer text-xs w-[75px] text-right">
                    Whitemode
                </Label>
                <Switch
                id="theme-toggle"
                disabled={true}
                className="h-4 w-7 [&>span]:h-3 [&>span]:w-3 [&>span]:data-[state=checked]:translate-x-3"
                />
            </div>
            </div>
        </div>
        </footer>
    );
  }

  return (
    <footer className="w-full border-t py-6 md:py-8 bg-muted/40">
      <div className="container mx-auto text-center flex flex-col items-center justify-center">
        <h3 className="font-headline text-2xl font-bold">Hallo Welt – Die Bücherserie</h3>
        <p className="mt-2 text-xs text-muted-foreground max-w-2xl text-balance">
          Die satirische "Hallo Welt"-Bücherserie ist eine Idee und Kreation von Philipp Paulik (Autor), Maximilian Reisch (Autor), Luin Schiffbauer (Illustrator) und weiteren Mitwirkenden.
          Veröffentlicht und produziert durch Kindle Direct Publishing (KDP) der Amazon Distribution GmbH, Leipzig sowie ggf. weiteren Verlags- und Produktionspartnern.
        </p>
         <div className="mt-6 text-xs text-muted-foreground max-w-4xl text-balance">
            <p>Amazon Media EU S.à r.l. (registrierter Verkäufer von digitalen Inhalten, die mit „Verkauf durch Amazon Media EU SARL“ gekennzeichnet sind und Betrieb des Amazon Luna Spiele-Streaming-Dienstes):</p>
            <p>Amazon Media EU S.à r.l. (Société à responsabilité limitée), 38 avenue John F. Kennedy, L-1855 Luxemburg (Stammkapital: 50.000 EUR; registriert beim RCS Luxemburg; Registernummer: 112767; Gewebescheinnummer: 110001; USt-IdNr.: LU 20944528). Das Unternehmen wird gesetzlich vertreten durch Eric King.</p>
        </div>
        <div className="mt-6 text-xs text-muted-foreground flex flex-wrap gap-x-4 gap-y-2 justify-center items-center border-t pt-4">
          <p>© {new Date().getFullYear()} Paulik & Reisch. Alle Rechte vorbehalten.</p>
          <Link href="/impressum" className="hover:underline">Impressum</Link>
          <Link href="/datenschutz" className="hover:underline">Datenschutz</Link>
          <Link href="/cookie-richtlinie" className="hover:underline">Cookie-Richtlinie</Link>
          <Link href="/agb" className="hover:underline">AGB</Link>
          
           <div className="flex items-center space-x-1">
            <Label htmlFor="theme-toggle" className="cursor-pointer text-xs w-[75px] text-right">
                {currentLabel}
            </Label>
            <Switch
              id="theme-toggle"
              checked={theme === 'dark'}
              onCheckedChange={handleThemeChange}
              className="h-4 w-7 [&>span]:h-3 [&>span]:w-3 [&>span]:data-[state=checked]:translate-x-3"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
