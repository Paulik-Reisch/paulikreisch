import { Button } from "@/components/ui/button";
import { LogoutButton } from "./logout-button";
import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { Home, BarChart3, Presentation, Sparkles, Users, BookOpen } from "lucide-react";

export function AdminHeader({showUploads=false}:{showUploads?:boolean}) {
  return (
    <header className="px-4 lg:px-6 min-h-14 py-2 flex items-center sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto flex flex-wrap items-center justify-between gap-y-2">
        <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/authors" className="flex items-center justify-center">
              <div className="flex items-center gap-2">
                <Logo className="h-8 w-auto" />
                <span className="hidden sm:inline font-headline font-semibold text-lg ml-2">Admin</span>
              </div>
            </Link>

        </div>
             <nav aria-label="Verwaltung" className="order-last flex w-full flex-wrap items-center gap-1 xl:order-none xl:w-auto">
                 <Link href="/authors">
                    <Button variant="ghost">
                        <Users className="mr-2 h-4 w-4" />
                        Autoren
                    </Button>
                </Link>
                <Link href="/lp">
                    <Button variant="ghost">
                        <Presentation className="mr-2 h-4 w-4" />
                        Landing Pages
                    </Button>
                </Link>
                <Link href="https://analytics.paulikreisch.de/">
                    <Button variant="ghost">
                        <BarChart3 className="mr-2 h-4 w-4" />
                        Analytics
                    </Button>
                </Link>
                 {showUploads&&<Link href="/upload"><Button variant="ghost">Dateien</Button></Link>}
                 <Link href="/worthaft"><Button variant="ghost"><BookOpen className="mr-2 h-4 w-4" />Worthaft</Button></Link>
                 <Link href="/seo">
                    <Button variant="ghost">
                        <Sparkles className="mr-2 h-4 w-4" />
                        SEO
                    </Button>
                </Link>
            </nav>
        <div className="flex items-center gap-2 sm:gap-4">
          <Link href="https://paulikreisch.de/" aria-label="Zur Hauptseite">
             <Button variant="ghost" size="sm">
                <Home className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Zur Hauptseite</span>
             </Button>
          </Link>
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
