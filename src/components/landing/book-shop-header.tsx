import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ImageWithLoader as Image } from "@/components/ui/image-with-loader";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";


export function BookShopHeader() {
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
        
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button size="sm" variant="secondary">
                    Bücher
                    <ChevronDown className="ml-2 h-4 w-4"/>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Wählen Sie ein Buch</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link href="/">
                    <DropdownMenuItem>
                        Mehr zu "Hallo Welt 1" erfahren
                    </DropdownMenuItem>
                </Link>
                <Link href="/lp2">
                    <DropdownMenuItem>
                        Mehr zu "Hallo Welt 2" erfahren
                    </DropdownMenuItem>
                </Link>
            </DropdownMenuContent>
        </DropdownMenu>

      </div>
    </header>
  );
}
