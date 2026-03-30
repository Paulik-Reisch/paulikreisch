
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { WorthaftIcon } from '@/components/ui/icons/worthaft-icon';

export function WorthaftTeaser() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <WorthaftIcon className="mx-auto h-16 w-16 mb-4 text-primary" />
          <div className="space-y-2">
            <h2 className="text-3xl font-bold font-headline tracking-tighter sm:text-4xl md:text-5xl">Testen Sie Ihren Wortschatz</h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed text-balance">
              Sie kennen sich mit der deutschen Sprache aus? Beweisen Sie es und erraten das tägliche Wort!
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link href="/worthaft">
              <Button size="lg">Jetzt spielen</Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
