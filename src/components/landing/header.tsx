import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Logo } from "../ui/logo";
import { PremiumBanner } from "./premium-banner";

export function Header() {
  return (
    <header className="px-4 lg:px-6 h-14 flex items-center sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto flex items-center justify-between">
        <a className="flex items-center justify-center" href="/">
          <div className="flex items-center gap-2">
            <Logo className="h-8 w-auto" />
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
