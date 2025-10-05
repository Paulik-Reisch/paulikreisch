import { Button } from "@/components/ui/button";
import Link from "next/link";

export function BookShopHeader() {
  return (
    <header className="px-4 lg:px-6 h-14 flex items-center sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto flex items-center justify-between">
        <a className="flex items-center justify-center" href="/">
          <span className="font-headline font-semibold text-lg">Hallo Welt | Buchhandlung Paulik & Reisch</span>
        </a>
      </div>
    </header>
  );
}
