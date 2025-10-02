
import { getPublishedExcerpts } from "@/lib/firestore";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default async function ExcerptsPage() {
  const excerpts = await getPublishedExcerpts();

  return (
    <div className="flex flex-col min-h-[100dvh] bg-background text-foreground">
      <Header />
      <main className="flex-1 py-12 md:py-24">
        <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
                <Badge>Leseproben</Badge>
                <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-6xl mt-4 text-balance">
                    Einblicke in den Wahnsinn
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl mt-4 text-balance">
                    Stöbern Sie durch eine Sammlung veröffentlichter Kapitel und Leseproben aus dem "Hallo Welt"-Universum.
                </p>
            </div>
            
            {excerpts.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {excerpts.map((excerpt) => (
                        <Card key={excerpt.id} className="flex flex-col">
                            <CardHeader>
                                <CardTitle className="font-headline text-2xl">{excerpt.title}</CardTitle>
                                <CardDescription>Kapitel {excerpt.chapterNumber}</CardDescription>
                            </CardHeader>
                            <CardFooter className="mt-auto">
                                <Link href={`/exzerpt/${excerpt.slug}`} className="w-full">
                                    <Button className="w-full">
                                        Lesen <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 text-muted-foreground border-2 border-dashed rounded-lg">
                    <BookOpen className="mx-auto h-12 w-12 mb-4"/>
                    <h3 className="text-xl font-semibold">Noch nichts zu lesen hier</h3>
                    <p>Die Autoren sind wahrscheinlich noch beim Kaffeetrinken. Schauen Sie später wieder vorbei.</p>
                </div>
            )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
