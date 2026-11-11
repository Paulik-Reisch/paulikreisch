import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { ImageWithLoader as Image } from "@/components/ui/image-with-loader";
import { Badge } from "@/components/ui/badge";
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Maximilian Reisch | Autor & Stratege",
    description: 'Lerne Maximilian Reisch kennen, einen der strategischen Köpfe hinter der satirischen Buchreihe „Hallo Welt“. Entdecke seine Rolle als Autor und Strukturschaffender des Duos.',
    alternates: {
      canonical: '/ueber/max-reisch',
    },
  };
}

export default function MaxReischPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f7f2e7] text-[#1d1a15] dark:bg-[oklch(21%_0.012_85)] dark:text-[oklch(93%_0.01_85)]">
      <Header />
      <main className="relative flex-1 overflow-hidden py-12 md:py-20">
        <div className="relative container mx-auto max-w-5xl px-4">
          <header className="mb-10 text-center md:mb-14">
            <Badge className="inline-flex items-center rounded-[10px] border border-[#1d1a15]/15 bg-white px-3 py-1 text-[0.72rem] font-bold uppercase tracking-[0.12em] text-[#9c2d22] dark:border-white/15 dark:bg-[#2a251e] dark:text-[oklch(68%_0.12_40)] shadow-sm">Autor &amp; Stratege</Badge>
            <h1 className="mt-4 font-[Georgia,_Iowan_Old_Style,_Times_New_Roman,_serif] text-4xl font-bold tracking-[-0.03em] md:text-6xl">
              Maximilian Reisch
            </h1>
          </header>

          <div className="grid items-start gap-8 md:grid-cols-[280px_minmax(0,1fr)] md:gap-12">
            <div className="flex justify-center md:justify-start">
              <div className="overflow-hidden rounded-[0px] border-0 bg-transparent p-0 shadow-none">
                <Image
                  src="/max-reisch.png"
                  alt="Porträt von Maximilian Reisch"
                  width={260}
                  height={260}
                  className="aspect-square w-full rounded-none object-cover"
                />
              </div>
            </div>

            <div className="space-y-5">
              <h2 className="font-[Georgia,_Iowan_Old_Style,_Times_New_Roman,_serif] text-3xl font-bold tracking-[-0.02em] md:text-4xl">
                Über Maximilian
              </h2>
              <article className="space-y-4 text-[1.05rem] leading-relaxed text-[#4d463b] dark:text-[oklch(78%_0.014_78)]">
                <p>
                  Maximilian Reisch ist das strategische Gehirn und die strukturelle Kraft hinter dem satirischen Duo Paulik &amp; Reisch. Während Philipp das Chaos entfesselt, ist es Max, der diesem Chaos eine Form gibt, es in lesbare Sätze fasst und sicherstellt, dass die Pointen nicht nur zünden, sondern auch nachhaltig im Gedächtnis bleiben.
                </p>
                <p>
                  Mit einem scharfen Blick für Details und einer Vorliebe für syntaktische Präzision verwandelt er alltägliche Absurditäten in pointierte Gesellschaftskritik.
                </p>
              </article>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
