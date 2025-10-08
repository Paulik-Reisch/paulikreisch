
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export function HeroSchuleStraflager() {
  return (
    <section className="w-full py-8 md:py-12 relative bg-black text-white">
       <Image
          alt="Schulgebäude als Gefängnis"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
          data-ai-hint="school prison"
          layout="fill"
          src="https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/schule.png?alt=media&token=8d6d2220-8eee-4143-ba1e-8517eec2385f"
        />
      <div className="container px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center space-y-6 text-center">
          <div className="space-y-4">
            <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-6xl xl:text-8xl/none text-balance">
              Die Lernvollzugsanstalt hat wieder geöffnet.
            </h1>
            <p className="mx-auto text-gray-200 md:text-xl py-4 bg-black/50 rounded-md">
              Freistunden sind Fluchtversuche. Lehrer sind Wärter. Der Pausengong ist der Appell.<br />Willkommen zurück im härtesten Straflager von allen: der Schule.
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
