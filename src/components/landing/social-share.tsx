"use client";
import { Button } from "@/components/ui/button";
import { Twitter, Facebook, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function SocialShare() {
  const { toast } = useToast();
  const shareUrl = "https://www.amazon.de/-/de/Hallo-Welt-Erhebliche-Bildungsgang-Lernvollzugsanstalt/dp/B0CVXT9X4J";
  const shareText = "Ich habe gerade mit der KI ein neues Kapitel für das satirische Meisterwerk 'Hallo Welt' geschrieben! Du musst das ausprobieren und das Buch lesen! #HalloWeltBuch #KI";

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
    toast({
        title: "Kopiert!",
        description: "Der Text zum Teilen wurde in die Zwischenablage kopiert.",
    })
  }

  return (
    <section id="social-share" className="w-full py-12 md:py-24 lg:py-32" style={{ backgroundColor: 'hsl(var(--color-bg-light-pink))' }}>
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold font-headline tracking-tighter sm:text-5xl">Verbreite das Chaos!</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed text-balance">
              Dein frisch geschriebenes Kapitel ist zu gut, um es für dich zu behalten. Teile es mit der Welt (und sorge für maximale Verwirrung).
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
            <a 
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Button size="lg" variant="outline">
                <Twitter className="mr-2 h-5 w-5" /> Teilen auf X
              </Button>
            </a>
            <a 
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
                <Button size="lg" variant="outline">
                    <Facebook className="mr-2 h-5 w-5" /> Facebook
                </Button>
            </a>
            <Button size="lg" variant="outline" onClick={handleCopyToClipboard}>
                <Copy className="mr-2 h-5 w-5" /> Text kopieren
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
