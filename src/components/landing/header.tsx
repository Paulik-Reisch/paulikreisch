import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ImageWithLoader as Image } from "@/components/ui/image-with-loader";

export function Header() {
  return (
    <header className="px-4 lg:px-6 h-14 flex items-center sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto flex items-center justify-between">
        <a className="flex items-center justify-center" href="/">
          <div className="flex items-center gap-2">
            <Image
              src="https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/pr_logo_Vector.svg?alt=media&token=e94a9702-b86e-4fc7-b540-e1e215697188"
              alt="Paulik & Reisch Logo"
              width={32}
              height={32}
            />
            <span className="font-headline font-semibold text-lg ml-2 hidden sm:inline">Paulik & Reisch</span>
          </div>
        </a>
        
        <Link href="/buchhandlung-paulik-reisch">
            <Button size="sm" variant="secondary">
                Buch kaufen
            </Button>
        </Link>

      </div>
    </header>
  );
}
