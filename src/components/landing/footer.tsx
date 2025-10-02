import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full border-t py-8 md:py-12 bg-muted/40">
      <div className="container mx-auto text-center flex flex-col items-center justify-center">
        <h3 className="font-headline text-2xl font-bold">Hallo Welt – Die Bücherserie</h3>
        <p className="mt-4 text-xs text-muted-foreground max-w-2xl text-balance">
          Die satirische "Hallo Welt"-Bücherserie ist eine Idee und Kreation von Philipp Paulik (Autor), Maximilian Reisch (Autor), Luin Schiffbauer (Illustrator) und weiteren Mitwirkenden.
          Veröffentlicht und produziert durch Kindle Direct Publishing (KDP) der Amazon Distribution GmbH, Leipzig sowie ggf. weitere Verlags- und Produktionspartner.
        </p>
        <div className="mt-8 text-xs text-muted-foreground flex flex-wrap gap-x-4 gap-y-2 justify-center">
          <p>© {new Date().getFullYear()} Paulik & Reisch. Alle Rechte vorbehalten.</p>
          <Link href="/impressum" className="hover:underline">Impressum</Link>
          <Link href="/datenschutz" className="hover:underline">Datenschutz</Link>
          <Link href="/cookie-richtlinie" className="hover:underline">Cookie-Richtlinie</Link>
          <Link href="/agb" className="hover:underline">AGB</Link>
          <Link href="/lizenz" className="hover:underline">Lizenz</Link>
        </div>
      </div>
    </footer>
  );
}
