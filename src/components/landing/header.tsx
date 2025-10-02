import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export function Header() {
  return (
    <header className="px-4 lg:px-6 h-14 flex items-center sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto flex items-center justify-between">
        <a className="flex items-center justify-center gap-2" href="/">
           <Image 
            src="https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/p_und_r-logo.png?alt=media&token=e1b7c172-fa61-47f4-a4e4-f92fe0ffa522"
            alt="Hallo Welt Logo"
            width={28}
            height={28}
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
