import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function LP2Teaser() {
  return (
    <section id="teaser-lp2" className="w-full py-20 md:py-32 lg:py-40" style={{ backgroundColor: 'hsl(var(--color-bg-light-orange))' }}>
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-6 text-center">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold font-headline tracking-tighter sm:text-6xl text-balance">
              Gierig auf mehr? Hallo Welt 2 kommt.
            </h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Wir legen noch eine Schippe drauf. Mehr Absurdität. Mehr Chaos. Mehr Sätze, die man dreimal lesen muss. Seien Sie unter den Ersten, die einen exklusiven Blick darauf werfen.
            </p>
          </div>
          <Link href="/lp2">
            <Button size="lg" className="animate-pulse">
              Zu Hallo Welt 2 <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
