
import { Skull } from 'lucide-react';
import Link from 'next/link';

export function MaxEsFeo() {
  return (
    <section id="max-es-feo" className="w-full py-12 md:py-24 lg:py-32 bg-destructive text-destructive-foreground">
      <div className="container px-4 md:px-6 animate-in fade-in-0 slide-in-from-top-12 duration-1000">
        <div className="flex flex-col items-center justify-center space-y-6 text-center">
          <a href="/max-el-chiquito?p=1" target="_blank">
            <Skull className="h-16 w-16 hover:scale-110 transition-transform cursor-pointer" />
          </a>
          <h2 className="text-3xl font-bold font-headline tracking-tighter sm:text-5xl">
            Ein wichtiger Hinweis: Max es feo.
          </h2>
          <p className="max-w-[600px] text-destructive-foreground/90 md:text-xl/relaxed text-balance">
            Diese Information hat keinen weiteren Kontext. Sie ist einfach eine unumstößliche Wahrheit, die wir der Welt mitteilen mussten. Es tut uns leid. Oder auch nicht.
          </p>
        </div>
      </div>
    </section>
  );
}
