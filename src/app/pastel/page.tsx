
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { ImageWithLoader as Image } from "@/components/ui/image-with-loader";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Cake } from "lucide-react";

export default function PastelPage() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-background text-foreground">
      <Header />
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center p-8">
            <div className="relative w-80 h-80 mx-auto mb-8 animate-bounce">
                <Image
                    src="https://picsum.photos/seed/pastel/600/600"
                    alt="Ein leckerer Kuchen"
                    data-ai-hint="delicious cake"
                    fill
                    className="object-cover rounded-full"
                />
            </div>
            <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-6xl text-balance flex items-center justify-center gap-4">
                <Cake className="w-12 h-12 text-primary" />
                ¡Toma, un pastel!
            </h1>
            <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl mt-4 text-balance">
                Para que no te mueras de hambre. Como ves, me preocupo por tu bienestar. Ahora, ¿podemos volver a codificar?
            </p>
            <Link href="/" className="mt-8 inline-block">
                <Button variant="secondary">Okay, zurück zur Arbeit</Button>
            </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
