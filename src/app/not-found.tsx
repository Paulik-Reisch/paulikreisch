
"use client";

import { MorphingText } from "@/components/ui/morphing-text";

export default function NotFound() {
  const texts = ["404", "Seite nicht gefunden"];
  return (
    <div className="flex flex-col min-h-[100dvh] items-center justify-center bg-background text-foreground relative overflow-hidden">
      <MorphingText texts={texts} />
    </div>
  );
}
