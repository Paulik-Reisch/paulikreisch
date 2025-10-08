
import { Button } from '@/components/ui/button';

export function HeroSchuleStraflager() {
  return (
    <section className="w-full py-8 md:py-12 relative bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/50 dark:to-blue-800/50 text-foreground">
      <div className="container px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center space-y-6 text-center">
          <div className="space-y-4">
            <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-6xl xl:text-8xl/none text-balance">
              Die Lernvollzugsanstalt hat wieder geöffnet.
            </h1>
            <p className="mx-auto text-muted-foreground md:text-xl py-4 bg-background/20 rounded-md">
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
