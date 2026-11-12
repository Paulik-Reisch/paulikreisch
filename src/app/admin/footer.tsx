import { ThemeToggle } from '@/components/theme-toggle';

export function AdminFooter() {
  return (
    <footer className="border-t px-4 py-5 text-sm text-muted-foreground">
      <div className="container flex flex-wrap items-center justify-between gap-4">
        <nav aria-label="Rechtliche Informationen" className="flex gap-4">
          <a href="https://paulikreisch.de/impressum">Impressum</a>
          <a href="https://paulikreisch.de/datenschutz">Datenschutz</a>
        </nav>
        <div className="flex items-center gap-2"><span>Dunkelmodus</span><ThemeToggle /></div>
      </div>
    </footer>
  );
}
