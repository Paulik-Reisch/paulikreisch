import { BookOpen, BrainCircuit, Feather } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function Features() {
  return (
    <section id="features" aria-labelledby="features-heading" className="w-full py-20 md:py-24 lg:py-32 bg-primary text-primary-foreground">
      <div className="container px-4 md:px-6 animate-in fade-in-0 slide-in-from-top-12 duration-1000">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 id="features-heading" className="text-3xl font-bold font-headline tracking-tighter sm:text-5xl">Warum Sie unsere Satire lieben werden</h2>
          </div>
        </div>
        <div className="mx-auto max-w-3xl py-12">
          <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
            <AccordionItem value="item-1" className="bg-white/10 border-white/20 border rounded-lg px-6 mb-4">
              <AccordionTrigger className="hover:no-underline text-xl font-bold font-headline text-left">
                <div className="flex items-center gap-4">
                    <Feather className="h-6 w-6" />
                    <span>Satirisches Genie</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-base text-primary-foreground/80 pt-2 text-left">
                Witzige Kommentare zum modernen Leben, die so scharf sind, dass jede Chili Schote vor Neid erblassen würde.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2" className="bg-white/10 border-white/20 border rounded-lg px-6 mb-4">
              <AccordionTrigger className="hover:no-underline text-xl font-bold font-headline text-left">
                 <div className="flex items-center gap-4">
                    <BookOpen className="h-6 w-6" />
                    <span>Fesselnde Handlung</span>
                 </div>
              </AccordionTrigger>
              <AccordionContent className="text-base text-primary-foreground/80 pt-2 text-left">
                Eine Handlung mit mehr Drehungen und Wendungen als eine Brezelfabrik.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3" className="bg-white/10 border-white/20 border rounded-lg px-6">
              <AccordionTrigger className="hover:no-underline text-xl font-bold font-headline text-left">
                <div className="flex items-center gap-4">
                    <BrainCircuit className="h-6 w-6" />
                    <span>Taktische Geniestreiche</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-base text-primary-foreground/80 pt-2 text-left">
                Lernen Sie, wie man mit Problemen der Schulzeit umgeht – von der Umgehung des Sportunterrichts bis zur Manipulation der Noten.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </section>
  );
}
