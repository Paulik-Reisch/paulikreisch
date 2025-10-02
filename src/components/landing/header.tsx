
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export function Header() {
  return (
    <header className="px-4 lg:px-6 h-14 flex items-center sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto flex items-center justify-between">
        <a className="flex items-center justify-center gap-2" href="/">
          <Image
            src="https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/philipp-avatar.jpg?alt=media&token=ec373eaf-5786-43b9-ac60-b582cb13fac3"
            alt="Avatar Paulik"
            width={28}
            height={28}
            className="rounded-full"
          />
          <span className="font-headline font-semibold text-lg">Hallo Welt</span>
          <Image
            src="https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/max-avatar.jpg?alt=media&token=7d7574a9-0f76-431b-b8d3-b608332e7a20"
            alt="Avatar Reisch"
            width={28}
            height={28}
            className="rounded-full"
          />
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
