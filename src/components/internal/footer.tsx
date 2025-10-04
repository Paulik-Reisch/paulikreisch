import Link from "next/link";
import { Circle, GitBranch } from "lucide-react";

export function InternalFooter() {
    return (
        <footer className="hidden sm:flex items-center justify-between gap-4 border-t bg-background px-6 py-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Circle className="h-3 w-3 fill-green-500 text-green-500" />
                <span>Alle Systeme betriebsbereit</span>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <Link href="#" className="hover:text-foreground">Hilfe</Link>
                <Link href="#" className="hover:text-foreground">Datenschutz</Link>
                <div className="flex items-center gap-2">
                    <GitBranch className="h-4 w-4" />
                    <span>v0.1.0-alpha</span>
                </div>
            </div>
        </footer>
    )
}
