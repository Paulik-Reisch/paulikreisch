import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="px-4 lg:px-6 h-14 flex items-center sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto flex items-center justify-between">
        <a className="flex items-center justify-center" href="#">
          <span className="font-headline font-semibold text-lg">Hallo Welt</span>
        </a>
        <a href="https://www.amazon.de/-/de/Hallo-Welt-Erhebliche-Bildungsgang-Lernvollzugsanstalt/dp/B0CVXT9X4J" target="_blank" rel="noopener noreferrer">
          <Button size="sm">Buch kaufen</Button>
        </a>
      </div>
    </header>
  );
}
