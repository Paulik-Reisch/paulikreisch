"use client";

import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function HeroLP2() {
  const router = useRouter();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Hier könnte man die E-Mail-Adresse noch verarbeiten, z.B. an einen Newsletter-Service senden.
    // Danach wird weitergeleitet.
    router.push('/excerpt-6');
  };

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-6 text-center">
          <div className="space-y-4">
            <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-6xl xl:text-8xl/none text-balance animate-in fade-in slide-in-from-top-12 duration-1000">
              HALLO WELT 2 WIRD NOCH KRASSER ALS HALLO WELT 1
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl animate-in fade-in slide-in-from-top-16 duration-1000">
              Sie dachten, es geht nicht schlimmer? Oh, doch. Seien Sie der Erste, der einen exklusiven Auszug liest. Geben Sie einfach Ihre E-Mail-Adresse ein und bereiten Sie sich mental vor.
            </p>
          </div>
          <div className="w-full max-w-md space-y-2 animate-in fade-in slide-in-from-top-20 duration-1000">
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <Input
                className="max-w-lg flex-1"
                placeholder="Ihre E-Mail-Adresse"
                type="email"
                required
              />
              <Button type="submit" size="lg">
                EXCERPT LESEN
              </Button>
            </form>
            <p className="text-xs text-muted-foreground">
              Wir schicken Ihnen den Auszug und vielleicht den ein oder anderen schlechten Witz. Abmeldung jederzeit möglich (emotional vielleicht nicht).
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
