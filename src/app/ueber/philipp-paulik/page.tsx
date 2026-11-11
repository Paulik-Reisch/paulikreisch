
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { ImageWithLoader as Image } from "@/components/ui/image-with-loader";
import { Badge } from "@/components/ui/badge";
import { createTrackedUrl } from "@/lib/utils";
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Philipp Paulik | Autor & Kreativkopf | Paulik & Reisch",
    description: 'Lernen Sie Philipp Paulik kennen, einen der kreativen Köpfe hinter der satirischen Buchreihe "Hallo Welt". Entdecken Sie seine Arbeit, seinen Werdegang und sein Portfolio.',
    alternates: {
      canonical: '/ueber/philipp-paulik',
    },
  };
}

export default function PhilippPaulikPage() {
  const portfolioUrl = createTrackedUrl(
    'https://philipp-paulik.de/',
    'author_profile_link',
    'organic_crosslink',
    'profile_page_hw_website'
  );

  return (
    <div className="flex min-h-screen flex-col bg-[#f7f2e7] text-[#1d1a15] dark:bg-[oklch(21%_0.012_85)] dark:text-[oklch(93%_0.01_85)]">
      <Header />
      <main className="relative flex-1 overflow-hidden py-12 md:py-20">
        <div className="relative container mx-auto max-w-5xl px-4">
          <header className="mb-10 text-center md:mb-14">
            <Badge className="inline-flex items-center rounded-[10px] border border-[#1d1a15]/15 bg-white px-3 py-1 text-[0.72rem] font-bold uppercase tracking-[0.12em] text-[#9c2d22] dark:border-white/15 dark:bg-[#2a251e] dark:text-[oklch(68%_0.12_40)] shadow-sm">Autor &amp; Kreativkopf</Badge>
            <h1 className="mt-4 font-[Georgia,_Iowan_Old_Style,_Times_New_Roman,_serif] text-4xl font-bold tracking-[-0.03em] md:text-6xl">
              Philipp Paulik
            </h1>
          </header>

          <div className="grid items-start gap-8 md:grid-cols-[280px_minmax(0,1fr)] md:gap-12">
            <div className="flex justify-center md:justify-start">
              <div className="overflow-hidden rounded-[0px] border-0 bg-transparent p-0 shadow-none">
                <Image
                  src="/philipp-paulik.png"
                  alt="Porträt von Philipp Paulik"
                  width={260}
                  height={260}
                  className="aspect-square w-full rounded-none object-cover"
                />
              </div>
            </div>

            <div className="space-y-5">
              <h2 className="font-[Georgia,_Iowan_Old_Style,_Times_New_Roman,_serif] text-3xl font-bold tracking-[-0.02em] md:text-4xl">
                Über Philipp
              </h2>
              <article className="space-y-4 text-[1.05rem] leading-relaxed text-[#4d463b] dark:text-[oklch(78%_0.014_78)]">
                <p>
                  Philipp Paulik ist der Funke, der das satirische Feuer der Hallo Welt-Reihe entfacht. Als einer der beiden Autoren ist er der Meister des kreativen Chaos und der unkonventionellen Ideen. Seine Fähigkeit, die absurdesten Alltagsbeobachtungen in scharfzüngige Kritik zu verwandeln, bildet das Herzstück der Serie.
                </p>
                <p>
                  Getrieben von einer gesunden Portion Zynismus und zu viel Koffein, sorgt Philipp dafür, dass keine Pointe zu gewagt und kein Thema zu heilig ist. Sein Schreiben ist ein direkter Angriff auf die Monotonie des Alltags und eine Einladung, die Welt mit einem Lachen zu hinterfragen.
                </p>
              </article>

              <div className="pt-2">
                <a
                  href={portfolioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-[10px] border-2 border-[#1d1a15] bg-[#ffe14d] px-5 py-3 text-[0.9rem] font-bold text-[#1d1a15] shadow-[0_3px_0_#1d1a15] transition-[transform,box-shadow] hover:-translate-y-[1px] hover:shadow-[0_4px_0_#1d1a15] active:translate-y-[1px] active:shadow-[0_1px_0_#1d1a15] dark:border-[#0f0d0a] dark:shadow-[0_3px_0_#0a0a0a] dark:hover:shadow-[0_4px_0_#0a0a0a] dark:active:shadow-[0_1px_0_#0a0a0a]"
                >
                  Portfolio besuchen
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
