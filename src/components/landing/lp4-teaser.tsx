import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Feather } from 'lucide-react';

export function LP4Teaser() {
  return (
    <section id="teaser-lp4" className="w-full py-20 md:py-32 lg:py-40" style={{ backgroundColor: 'hsl(var(--color-bg-tan))' }}>
      <div className="container px-4 md:px-6 animate-in fade-in-0 slide-in-from-top-12 duration-1000">
        <div className="flex flex-col items-center justify-center space-y-6 text-center">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold font-headline tracking-tighter sm:text-6xl text-balance">
              Schreibe mit uns!
            </h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed text-balance">
              Du hast eine Idee für das nächste Kapitel? Werde selbst zum Autor und schreibe mit unserem HalloWeltGPT ein Stück literarische Anarchie.
            </p>
          </div>
          <Link href="/lp4">
            <Button size="lg">
              Kapitel jetzt starten <Feather className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
