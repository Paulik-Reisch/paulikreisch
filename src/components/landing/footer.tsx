import { RandomPageButton } from "./random-page-button";

export function Footer() {
  return (
    <footer className="w-full border-t py-12 md:py-16">
      <div className="container mx-auto text-center flex flex-col items-center justify-center">
        <h3 className="font-headline text-2xl font-bold">Tschüss Welt, dies ist das Ende der Seite.</h3>
        <p className="mt-2 text-muted-foreground">Du willst noch mehr? Haben wir uns gedacht:</p>
        <div className="mt-6">
            <RandomPageButton />
        </div>
        <p className="mt-8 text-xs text-muted-foreground">
          © {new Date().getFullYear()} Paulik & Reisch. Alle Rechte vorbehalten. Und einige Falschheiten.
        </p>
      </div>
    </footer>
  );
}
