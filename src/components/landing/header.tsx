
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export function Header() {
  return (
    <header className="px-4 lg:px-6 h-14 flex items-center sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto flex items-center justify-between">
        <a className="flex items-center justify-center" href="/">
          {/* Desktop Logo */}
          <div className="hidden md:flex items-center gap-2">
            <Image
              src="https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/paulik.png?alt=media&token=7d4dfeb1-5f87-4426-9890-868ed2a089bf"
              alt="Avatar Paulik"
              width={28}
              height={28}
              className="rounded-full"
            />
            <Image
              src="https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/reisch.png?alt=media&token=5aa20eee-967e-4912-9bfe-3f0b6861a316"
              alt="Avatar Reisch"
              width={28}
              height={28}
              className="rounded-full"
            />
            <span className="font-headline font-semibold text-lg ml-2">Paulik & Reisch</span>
          </div>

          {/* Mobile Logo */}
          <div className="flex md:hidden items-center gap-2">
            <Image
              src="https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/p_und_r-logo.png?alt=media&token=e1b7c172-fa61-47f4-a4e4-f92fe0ffa522"
              alt="Paulik & Reisch Logo"
              width={32}
              height={32}
              className="rounded-full"
            />
             <span className="font-headline font-semibold text-lg hidden">Paulik & Reisch</span>
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
