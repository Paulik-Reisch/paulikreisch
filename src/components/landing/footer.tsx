"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { ImageWithLoader as Image } from "@/components/ui/image-with-loader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { subscribeToNewsletterAction } from "@/app/actions";
import { Loader2 } from "lucide-react";
import { Logo } from "../ui/logo";
import { createTrackedUrl } from "@/lib/utils";

const initialNewsletterState = { success: undefined, error: undefined, message: undefined };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="bg-[#0070c0] hover:bg-[#0070d9] text-white rounded-sm px-6 py-3 self-start">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        </>
      ) : (
        "Anmelden"
      )}
    </Button>
  );
}

export function Footer() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useActionState(subscribeToNewsletterAction, initialNewsletterState);
  const { toast } = useToast();

  const premiumUrl = createTrackedUrl(
    'https://premium.paulik-reisch.de/',
    'premium-footer-link',
    'organic_footer',
    'footer_main_website'
  );

  useEffect(() => {
    if (state.success) {
      toast({ title: "Fast geschafft!", description: state.message });
      formRef.current?.reset();
    }
    if (state.error) {
      toast({ variant: "destructive", title: "Fehler", description: state.error });
    }
  }, [state, toast]);
  
  return (
    <div className="text-[#555] leading-relaxed">
      {/* Top Section */}
      <footer className="bg-white py-16 px-5 border-t">
        <div className="container mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1fr_1fr_1.5fr_1.5fr] gap-10">
          
          {/* Brand Column */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <Logo className="w-36 h-auto mb-5 text-black" />
            <p className="font-bold">Paulik und Reisch</p>
          </div>

          {/* Navigation Column */}
          <div className="text-center md:text-left">
            <h3 className="text-sm font-bold uppercase text-gray-500 mb-5 tracking-wider">Entdecken</h3>
            <ul className="space-y-3">
              <li><a href={premiumUrl} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-[#f08e6c] text-[15px]">Premium Satire</a></li>
              <li><Link href="/ueber/autoren" className="text-gray-600 hover:text-[#f08e6c] text-[15px]">Über die Autoren</Link></li>
            </ul>
          </div>

          {/* Contact Column */}
          <div className="text-center md:text-left">
            <h3 className="text-sm font-bold uppercase text-gray-500 mb-5 tracking-wider">Kontakt</h3>
            <div className="text-[15px] text-gray-600 space-y-3">
              <p>
                <a href="mailto:philipp.l.paulik@gmail.com" className="hover:text-[#f08e6c]">Philipp (E-Mail)</a><br/>
                <a href="mailto:maximilian.reisch@t-online.de" className="hover:text-[#f08e6c]">Max (E-Mail)</a>
              </p>
              <p>© Paulik Reisch</p>
              <p>Neunk.-Seelsch., & Wintersch.<br/>Deutschland</p>
            </div>
          </div>

          {/* Newsletter Column */}
          <div className="text-center md:text-left">
            <h3 className="text-sm font-bold uppercase text-gray-500 mb-5 tracking-wider">Stay Connected</h3>
            <p className="text-[15px] text-gray-600 mb-5">
              Werde Teil der Paulik & Reisch Familie und erhalte Updates zu neuen Büchern und Events.
            </p>
            <form ref={formRef} action={formAction} className="flex flex-col gap-2.5 items-center md:items-start">
              <Input type="email" name="email" placeholder="E-Mail eingeben" className="bg-white border-gray-300 rounded-sm" required />
              <input type="hidden" name="source" value="main-footer" />
              <SubmitButton />
            </form>
          </div>

        </div>
      </footer>

      {/* Bottom Section */}
      <div className="bg-muted text-muted-foreground py-10 px-5 text-xs">
        <div className="container mx-auto max-w-7xl flex flex-col md:flex-row justify-between items-center md:items-start gap-10 text-center md:text-left">
          
          <div className="md:flex-2 max-w-3xl opacity-90 leading-relaxed">
            <p>Die satirische "Hallo Welt"-Bücherserie ist eine Idee und Kreation von Philipp Paulik (Autor), Maximilian Reisch (Autor), Luin Schiffbauer (Illustrator) und weiteren Mitwirkenden. Veröffentlicht und produziert durch Kindle Direct Publishing (KDP) der Amazon Distribution GmbH, Leipzig sowie ggf. weitere Verlags- und Produktionspartnern.</p>
            <br/>
            <p>Amazon Media EU S.à r.l. (registrierter Verkäufer von digitalen Inhalten, die mit "Verkauf durch Amazon Media EU SARL" gekennzeichnet sind.<br/>
            Amazon Media EU S.à r.l. (Société à responsabilité limitée)</p>
          </div>

          <div className="flex-1 flex flex-col items-center md:items-end gap-2 min-w-[200px]">
            <span className="opacity-90">© {new Date().getFullYear()} Paulik & Reisch. Alle Rechte vorbehalten.</span>
            <Link href="/impressum" className="opacity-90 hover:opacity-100 hover:underline">Impressum</Link>
            <Link href="/datenschutz" className="opacity-90 hover:opacity-100 hover:underline">Datenschutz</Link>
            <Link href="/cookie-richtlinie" className="opacity-90 hover:opacity-100 hover:underline">Cookie-Richtlinie</Link>
            <Link href="/agb" className="opacity-90 hover:opacity-100 hover:underline">AGB</Link>
          </div>

        </div>
      </div>
    </div>
  );
}
