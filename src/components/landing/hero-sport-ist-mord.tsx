
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export function HeroSportIstMord() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32" style={{backgroundColor: 'hsl(var(--color-bg-tan))'}}>
        <div className="container grid items-center gap-6 px-4 md:px-6 lg:grid-cols-2 lg:gap-10">
            <div className="space-y-4">
            <div className="inline-block rounded-lg bg-primary text-primary-foreground px-3 py-1 text-sm">Fitness-Hölle</div>
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl font-headline">Sport ist Mord.</h1>
            <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed">
                Willkommen in der Sporthalle: Ein Ort voller Schweiß, Tränen und gelegentlicher Knochenbrüche. Entdecken Sie, warum Völkerball mehr mit Krieg zu tun hat als mit Sport.
            </p>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button size="lg">Trainingsplan für Desaster anfordern</Button>
            </div>
            </div>
            <div className="relative">
                <Image
                    alt="Fitness-Werbeplakat mit Knochenbrüchen"
                    className="mx-auto aspect-square overflow-hidden rounded-xl object-contain sm:w-full"
                    data-ai-hint="fitness poster parody"
                    height="550"
                    src="https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/sport.png?alt=media&token=81c3dfa8-3b76-4b30-a0d3-96ff219145ce"
                    width="550"
                />
                 <p className="absolute bottom-7 right-4 bg-destructive text-destructive-foreground p-2 rounded-md transform -rotate-6 font-bold shadow-lg">JETZT MIT NOCH MEHR GENICKBRÜCHEN!</p>
            </div>
        </div>
    </section>
  );
}
