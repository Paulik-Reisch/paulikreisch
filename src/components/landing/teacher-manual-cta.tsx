
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function TeacherManualCta() {
  return (
    <section className="w-full py-12 md:py-16 bg-primary text-primary-foreground">
      <div className="container px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4 text-center md:text-left">
            <h2 className="text-3xl font-bold font-headline tracking-tighter sm:text-5xl">
              Sie haben die Diagnose – jetzt brauchen Sie die Lösung.
            </h2>
            <p className="text-lg text-primary-foreground/80">
              "Hallo Welt" ist das unverzichtbare Handbuch für den Umgang mit dem modernen Lehrkörper.
            </p>
            <Link href="/buchhandlung-paulik-reisch">
                <Button size="lg" variant="secondary" className="mt-4">
                    Zum Handbuch
                </Button>
            </Link>
          </div>
          <div className="relative flex justify-center">
            <Image 
                alt="Hallo Welt Buchcover als Handbuch"
                src="https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/cover-mockup-1.png?alt=media&token=c82b73e5-76bd-490d-a65f-008a3bfac00b"
                width={300}
                height={450}
                className="rounded-lg transform transition-transform duration-500 hover:scale-105 -rotate-3"
                data-ai-hint="book cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
