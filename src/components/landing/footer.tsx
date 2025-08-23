import Link from 'next/link';

export function Footer() {
  return (
    <footer className="w-full border-t py-12 md:py-16">
      <div className="container mx-auto text-center">
        <h3 className="font-headline text-2xl font-bold">Tschüss Welt, dies ist das Ende der Seite.</h3>
        <p className="mt-2 text-muted-foreground">Du willst noch mehr? Haben wir uns gedacht:</p>
        <nav className="mt-6 flex flex-wrap justify-center gap-4 md:gap-6">
          <Link href="/lp2" className="text-sm font-medium text-primary hover:underline underline-offset-4">
            Vorgeschmack auf Teil 2
          </Link>
          <Link href="/lp3" className="text-sm font-medium text-primary hover:underline underline-offset-4">
            Das Buch ist da!
          </Link>
          <Link href="/lp4" className="text-sm font-medium text-primary hover:underline underline-offset-4">
            Schreib mit uns
          </Link>
          <Link href="/excerpt-6" className="text-sm font-medium text-primary hover:underline underline-offset-4">
            Exklusiver Leseauszug
          </Link>
        </nav>
        <p className="mt-8 text-xs text-muted-foreground">
          © {new Date().getFullYear()} Paulik & Reisch. Alle Rechte vorbehalten. Und einige Falschheiten.
        </p>
      </div>
    </footer>
  );
}
