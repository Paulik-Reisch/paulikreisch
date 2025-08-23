import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export function Authors() {
  return (
    <section id="authors" className="w-full py-12 md:py-24 lg:py-32" style={{ backgroundColor: 'hsl(var(--color-bg-light-pink))' }}>
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold font-headline tracking-tighter sm:text-5xl">Meet the Twisted Minds</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed text-balance">
              Two authors, one questionable sense of humor. They probably wrote this in a basement somewhere.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:max-w-none lg:grid-cols-2 mt-12">
          <Card className="transform transition-transform duration-500 hover:scale-105 hover:-rotate-1 -rotate-2">
            <CardHeader className="text-center">
              <Image
                alt="Author Paulik"
                className="mx-auto mb-4 rounded-full"
                data-ai-hint="author portrait"
                height="120"
                src="https://placehold.co/120x120.png"
                style={{
                  aspectRatio: "120/120",
                  objectFit: "cover",
                }}
                width="120"
              />
              <CardTitle className="font-headline">Paulik</CardTitle>
              <CardDescription>The one with the glasses.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Paulik is a master of syntax and satire. His life's ambition is to write a sentence so confusing it wins a Nobel Prize. He's still trying.
              </p>
            </CardContent>
          </Card>
          <Card className="transform transition-transform duration-500 hover:scale-105 hover:rotate-1 rotate-2">
            <CardHeader className="text-center">
              <Image
                alt="Author Reisch"
                className="mx-auto mb-4 rounded-full"
                data-ai-hint="author portrait"
                height="120"
                src="https://placehold.co/120x120.png"
                style={{
                  aspectRatio: "120/120",
                  objectFit: "cover",
                }}
                width="120"
              />
              <CardTitle className="font-headline">Reisch</CardTitle>
              <CardDescription>The one with the questionable haircut.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Reisch provides the chaos. Fueled by coffee and existential dread, he ensures no plot makes too much sense. He considers it a public service.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
