
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { HelpCircle, ChevronDown } from "lucide-react";

const faqs = [
    {
        question: "Ist das Fleisch?",
        answer: "Das ist eine philosophische Frage, die den Rahmen der Nahrungs-Identifikation sprengt. Wir klassifizieren es als \"proteinbasiertes Produkt\"."
    },
    {
        question: "Warum bewegt sich mein Essen?",
        answer: "Das sind \"Frischeindikatoren\". Wenn es aufhört, sich zu bewegen, informieren Sie bitte umgehend das Personal."
    },
    {
        question: "Ist das ein Haar in meiner Suppe?",
        answer: "Nein, das ist eine \"Geschmacksfaser\". Eine Spezialität des Hauses, die für eine einzigartige Textur im Mund sorgt."
    },
    {
        question: "Kann ich eine vegetarische Option haben?",
        answer: "Das Gulasch von gestern war zu 98 % fleischfrei. Was wollen Sie mehr?"
    },
    {
        question: "Woraus besteht die \"grüne Soße\"?",
        answer: "Aus grünen Sachen."
    }
]

export function MensaFAQ() {
  return (
    <section className="w-full py-8 md:py-12 bg-background">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
            <h2 className="text-3xl font-bold font-headline tracking-tighter sm:text-5xl">
              Häufig gestellte Fragen (FAQ)
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed text-balance">
              Fragen, die sich niemand zu stellen traut. Wir beantworten sie trotzdem.
            </p>
        </div>

        <div className="max-w-3xl mx-auto mt-12">
            <Accordion type="single" collapsible className="w-full space-y-4">
                {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`} className="bg-muted/40 border rounded-lg">
                        <AccordionTrigger className="text-left font-semibold px-6 hover:no-underline group">
                            <div className="flex items-center gap-3">
                                <HelpCircle className="h-5 w-5 text-primary shrink-0"/>
                                <span>{faq.question}</span>
                            </div>
                             <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                        </AccordionTrigger>
                        <AccordionContent className="px-6 text-base">
                            <p className="text-muted-foreground">{faq.answer}</p>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
      </div>
    </section>
  );
}
