import { ThemeToggle } from '@/components/theme-toggle';

export function AdminFooter() {
  return (
    <footer className="admin-footer border-t px-4 md:px-6 py-5 text-sm text-muted-foreground">
      <div className="container flex flex-wrap items-center justify-end gap-4">
        <div className="flex items-center gap-2"><span>Dunkelmodus</span><ThemeToggle /></div>
      </div>
    </footer>
  );
}
