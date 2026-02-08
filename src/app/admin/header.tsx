import { Button } from "@/components/ui/button";
import { logoutAction } from "./actions";
import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { LogOut, Home, Newspaper, BarChart3, Presentation, Sparkles } from "lucide-react";

export function AdminHeader() {
  return (
    <header className="px-4 lg:px-6 h-14 flex items-center sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
            <Link href="/admin" className="flex items-center justify-center">
              <div className="flex items-center gap-2">
                <Logo className="h-8 w-auto" />
                <span className="font-headline font-semibold text-lg ml-2">Admin</span>
              </div>
            </Link>
            <div className="w-px h-6 bg-border mx-2 hidden sm:block" />
             <nav className="hidden md:flex items-center gap-1">
                <Link href="/admin">
                    <Button variant="ghost">
                        <Newspaper className="mr-2 h-4 w-4" />
                        Artikel
                    </Button>
                </Link>
                <Link href="/admin/lp">
                    <Button variant="ghost">
                        <Presentation className="mr-2 h-4 w-4" />
                        Landing Pages
                    </Button>
                </Link>
                <Link href="/admin/analytics">
                    <Button variant="ghost">
                        <BarChart3 className="mr-2 h-4 w-4" />
                        Analytics
                    </Button>
                </Link>
                 <Link href="/admin/seo">
                    <Button variant="ghost">
                        <Sparkles className="mr-2 h-4 w-4" />
                        SEO
                    </Button>
                </Link>
            </nav>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/">
             <Button variant="ghost" size="sm">
                <Home className="mr-2 h-4 w-4" />
                Zur Hauptseite
             </Button>
          </Link>
          <form action={logoutAction}>
            <Button type="submit" variant="outline" size="sm">
              <LogOut className="mr-2 h-4 w-4" />
              Abmelden
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
}
