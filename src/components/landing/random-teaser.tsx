import { RandomPageButton } from './random-page-button';

export function RandomTeaser() {
  return (
    <section id="random-teaser" className="w-full py-20 md:py-32 lg:py-40" style={{ backgroundColor: 'hsl(var(--color-bg-light-pink))' }}>
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-6 text-center">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold font-headline tracking-tighter sm:text-6xl text-balance">
              Lust auf pures Chaos?
            </h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed text-balance">
              Keine Ahnung, wo du anfangen sollst? Klicke auf den Button und lass dich zu einer zufälligen Ecke unseres satirischen Universums entführen.
            </p>
          </div>
          <RandomPageButton />
        </div>
      </div>
    </section>
  );
}
