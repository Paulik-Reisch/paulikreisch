import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full border-t py-12 md:py-16 bg-muted/40">
      <div className="container mx-auto text-center flex flex-col items-center justify-center">
        <h3 className="font-headline text-2xl font-bold">Hallo Welt</h3>
        <p className="mt-4 text-xs text-muted-foreground max-w-2xl text-balance">
          Die Hallo Welt (HW) Bücherserie ist erstellt, gepflegt und unabhängig publiziert durch Philipp Paulik (Autor), Maximilian Reisch (Autor), Luin Schiffbauer (Illustrator) und weitere Mitwirkende.
          Veröffentlicht und produziert durch Kindle Direct Publishing (KDP) der Amazon Distribution GmbH, Leipzig sowie ggf. weitere Verlags- und Produktionspartner.
        </p>
        <div className="mt-8 text-xs text-muted-foreground flex gap-4">
          <p>© {new Date().getFullYear()} Paulik & Reisch. Alle Rechte vorbehalten. Und einige Falschheiten.</p>
          <Link href="/impressum" className="hover:underline">Impressum</Link>
        </div>
      </div>
    </footer>
  );
}
