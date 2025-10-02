import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export function Header() {
  return (
    <header className="px-4 lg:px-6 h-14 flex items-center sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto flex items-center justify-between">
        <a className="flex items-center justify-center gap-2" href="/">
           <Image 
            src="https://picsum.photos/seed/halloweltlogo/28/28"
            alt="Hallo Welt Logo"
            width={28}
            height={28}
            className="rounded-sm"
          />
          <span className="font-headline font-semibold text-lg">Hallo Welt</span>
        </a>
        <Link href="/buchhandlung-paulik-reisch">
          <Button size="sm" variant="secondary">Buch kaufen</Button>
        </Link>
      </div>
    </header>
  );
}
