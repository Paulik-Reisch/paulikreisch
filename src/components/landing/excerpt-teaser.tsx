import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function ExcerptTeaser() {
  return (
    <section id="excerpt-teaser" className="w-full py-20 md:py-32 lg:py-40" style={{ backgroundColor: 'hsl(var(--color-bg-light-orange))' }}>
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-6 text-center">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold font-headline tracking-tighter sm:text-6xl text-balance">
              Lust auf eine Kostprobe?
            </h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed text-balance">
              Lesen Sie einen exklusiven Auszug aus Kapitel 6 und finden Sie heraus, warum dieses Buch eine Gefahr für die öffentliche Ordnung ist.
            </p>
          </div>
          <Link href="/excerpt-6">
            <Button size="lg">
              Zum Auszug <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
