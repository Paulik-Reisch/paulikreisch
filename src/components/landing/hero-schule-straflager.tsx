
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export function HeroSchuleStraflager() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 relative">
       <Image
          alt="Schulgebäude als Gefängnis"
          className="absolute inset-0 w-full h-full object-cover opacity-20"
          data-ai-hint="school prison"
          fill
          src="https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.appspot.com/o/schule.png?alt=media&token=8d6d2220-8eee-4143-ba1e-8517eec2385f"
        />
      <div className="container px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center space-y-6 text-center">
          <div className="space-y-4">
            <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-6xl xl:text-8xl/none text-balance">
              Die Lernvollzugsanstalt hat wieder geöffnet.
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Freistunden sind Fluchtversuche. Lehrer sind Wärter. Der Pausengong ist der Appell. Willkommen zurück im härtesten Straflager von allen: der Schule.
            </p>
          </div>
           <a href="/excerpt-6">
                <Button size="lg">Leseprobe: Fluchtversuch</Button>
            </a>
        </div>
      </div>
    </section>
  );
}
