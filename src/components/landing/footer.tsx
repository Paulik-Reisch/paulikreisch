import Link from 'next/link';

const mainLinks = [
    { href: "/lp2", text: "Vorgeschmack auf Teil 2" },
    { href: "/lp3", text: "Das Buch ist da!" },
    { href: "/lp4", text: "Schreib mit uns" },
    { href: "/excerpt-6", text: "Exklusiver Leseauszug" },
]

const topicLinks = [
    { href: "/lp-schule-straflager", text: "Schule als Straflager" },
    { href: "/lp-lehrer-roboter", text: "Lehrer als Roboter" },
    { href: "/lp-mensa-todesfalle", text: "Mensa als Todesfalle" },
    { href: "/lp-busfahren-mutprobe", text: "Busfahren als Mutprobe" },
    { href: "/lp-sport-ist-mord", text: "Sport ist Mord" },
    { href: "/lp-schulzeiten-genickbruch", text: "Gegen den Wecker" },
    { href: "/lp-corona-satire", text: "Corona-Satire" },
]

const hw2Links = [
    { href: "/lp-buerokratie-simulator", text: "Bürokratie-Simulator" },
    { href: "/lp-internet-deutschland", text: "Deutsches Internet" },
    { href: "/lp-mietenwahnsinn", text: "Mietenwahnsinn" },
]


export function Footer() {
  return (
    <footer className="w-full border-t py-12 md:py-16">
      <div className="container mx-auto text-center">
        <h3 className="font-headline text-2xl font-bold">Tschüss Welt, dies ist das Ende der Seite.</h3>
        <p className="mt-2 text-muted-foreground">Du willst noch mehr? Haben wir uns gedacht:</p>
        <nav className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2">
          {mainLinks.map(link => (
             <Link key={link.href} href={link.href} className="text-sm font-medium text-primary hover:underline underline-offset-4">
                {link.text}
             </Link>
          ))}
           {topicLinks.map(link => (
             <Link key={link.href} href={link.href} className="text-sm font-medium text-primary hover:underline underline-offset-4">
                {link.text}
             </Link>
          ))}
          {hw2Links.map(link => (
                <Link key={link.href} href={link.href} className="text-sm font-medium text-primary hover:underline underline-offset-4">
                    {link.text}
                </Link>
            ))}
        </nav>
        <p className="mt-8 text-xs text-muted-foreground">
          © {new Date().getFullYear()} Paulik & Reisch. Alle Rechte vorbehalten. Und einige Falschheiten.
        </p>
      </div>
    </footer>
  );
}
