import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';

const topics = [
    {
        title: "Schule = Straflager",
        description: "Die Lernvollzugsanstalt hat wieder geöffnet. Freistunden als Fluchtversuch, Lehrer als Wärter.",
        link: "/lp-schule-straflager",
        image: "https://placehold.co/600x400.png",
        aiHint: "prison school"
    },
    {
        title: "Lehrer sind auch nur Menschen (leider)",
        description: "Ein Kapitel über inkompetente Lehrer. Ein Hoch auf den Beamtenroboter mit Kaffeetasse.",
        link: "/lp-lehrer-roboter",
        image: "https://placehold.co/600x400.png",
        aiHint: "robot teacher"
    },
    {
        title: "Mensa = Todesfalle",
        description: "Ekelhumor vom Feinsten. Das Essen als Bio-Waffe. Lies das Menü der Hölle.",
        link: "/lp-mensa-todesfalle",
        image: "https://placehold.co/600x400.png",
        aiHint: "disgusting food"
    },
    {
        title: "Busfahren = Mutprobe",
        description: "Der tägliche Nahverkehr als Gladiatorenkampf. Hol dir den 'Survival Guide'.",
        link: "/lp-busfahren-mutprobe",
        image: "https://placehold.co/600x400.png",
        aiHint: "crowded bus"
    },
    {
        title: "Sport ist Mord",
        description: "Ein tiefgründiger Blick in die Abgründe der Sporthalle. Design wie ein Fitness-Werbeplakat – nur mit Knochenbrüchen.",
        link: "/lp-sport-ist-mord",
        image: "https://placehold.co/600x400.png",
        aiHint: "sports accident"
    },
    {
        title: "Schulzeiten = Genickbruch",
        description: "Warum Frühaufstehen ein Staatsverbrechen ist. Der Wecker ist der wahre Feind der Menschheit.",
        link: "/lp-schulzeiten-genickbruch",
        image: "https://placehold.co/600x400.png",
        aiHint: "alarm clock"
    },
    {
        title: "Corona für Schüler erklärt",
        description: "Eine satirische Aufarbeitung von Tests & Quarantäne. Nasenbohrer willkommen!",
        link: "/lp-corona-satire",
        image: "https://placehold.co/600x400.png",
        aiHint: "medical test"
    }
];

export function TopicLPs() {
  return (
    <section id="topic-lps" className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold font-headline tracking-tighter sm:text-5xl">Was dich interessieren könnte:</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed text-balance">
              Unser Buch hat viele Facetten. Welche spricht dich am meisten an? Finde es heraus!
            </p>
          </div>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-12">
          {topics.map((topic) => (
            <Link href={topic.link} key={topic.link} className="group">
                <Card className="h-full overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                    <CardHeader className="p-0">
                         <Image
                            alt={topic.title}
                            className="aspect-video w-full object-cover"
                            height="225"
                            src={topic.image}
                            data-ai-hint={topic.aiHint}
                            width="400"
                        />
                    </CardHeader>
                    <CardContent className="p-6">
                        <CardTitle className="font-headline text-xl mb-2">{topic.title}</CardTitle>
                        <CardDescription className="mb-4 text-sm">{topic.description}</CardDescription>
                        <div className="flex items-center text-primary font-semibold text-sm group-hover:underline">
                            Mehr erfahren <ArrowRight className="ml-2 h-4 w-4" />
                        </div>
                    </CardContent>
                </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
