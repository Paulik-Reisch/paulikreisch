
"use client";

import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center text-center p-4">
            <div className="space-y-4">
                <h1 className="text-8xl font-bold font-mono text-primary">404</h1>
                <h2 className="text-3xl font-bold font-headline tracking-tight">Seite nicht gefunden</h2>
                <p className="text-muted-foreground max-w-sm">
                    Die Seite, die Sie suchen, existiert nicht. Sie wurde vielleicht verschoben oder von einem übereifrigen Praktikanten gelöscht.
                </p>
                <div className="pt-4">
                    <Link href="/">
                        <Button>
                            <Home className="mr-2 h-4 w-4" />
                            Zurück zur Startseite
                        </Button>
                    </Link>
                </div>
            </div>
        </main>
        <Footer />
    </div>
  );
}

    