
"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { ImageWithLoader as Image } from "@/components/ui/image-with-loader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { subscribeToNewsletterAction, logEventAction } from "@/app/actions";
import { Loader2 } from "lucide-react";
import { Logo } from "../ui/logo";
import { createTrackedUrl } from "@/lib/utils";
import { useUser } from "@/firebase/provider";
import { usePathname } from "next/navigation";
import { AmazonIcon } from '@/components/ui/icons/amazon-icon';
import { GooglePlayIcon } from '@/components/ui/icons/google-play-icon';
import { ElevenReaderIcon } from '@/components/ui/icons/eleven-reader-icon';
import { WorthaftIcon } from "../ui/icons/worthaft-icon";

const initialNewsletterState = { success: undefined, error: undefined, message: undefined };

const amazonLink = "https://amzn.eu/d/0CdFeZ3";
const googlePlayLink = "https://play.google.com/store/books/details?id=HZb3EAAAQBAJ&rdid=book-HZb3EAAAQBAJ&rdot=1&source=gbs_atb&pcampaignid=books_booksearch_atb";
const elevenReaderLink = "https://elevenreader.io/audiobooks/hallo-welt/PNgTk712as4goF7HwxJJ";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button variant="secondary" type="submit" disabled={pending} className="rounded-sm px-6 py-3 self-start">
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
  const { user } = useUser();
  const pathname = usePathname();

  useEffect(() => {
    if (state.success) {
      toast({ title: "Fast geschafft!", description: state.message });
      
      // Log analytics event
      if (user && formRef.current) {
        const formData = new FormData(formRef.current);
        const source = formData.get('source') as string;
        logEventAction('newsletter_subscription', user.uid, pathname, { source });
      }
      formRef.current?.reset();
    }
    if (state.error) {
      toast({ variant: "destructive", title: "Fehler", description: state.error });
    }
  }, [state, toast, user, pathname]);
  
  return (
    <div className="text-[#555] leading-relaxed">
      {/* Top Section */}
      <footer className="bg-white py-16 px-5 border-t">
        <div className="container mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1fr_1fr_1.5fr_1.5fr] gap-10">
          
          {/* Brand Column */}
          <div className="flex flex-col items-start text-left">
            <Logo className="w-36 h-auto mb-5 text-black" />
            <p className="font-bold">Paulik und Reisch</p>
          </div>

          {/* Navigation Column */}
          <div className="text-left">
            <h3 className="text-sm font-bold uppercase text-gray-500 mb-5 tracking-wider">Entdecken</h3>
            <ul className="space-y-3">
              <li><Link href="/ueber/autoren" className="text-gray-600 hover:text-[#f08e6c] text-[15px]">Über die Autoren</Link></li>
              <li>
                <Link href="/worthaft" className="text-gray-600 hover:text-[#f08e6c] text-[15px] inline-flex items-center gap-2">
                    <WorthaftIcon className="h-4 w-4" />
                    <span>Worthaft</span>
                </Link>
              </li>
            </ul>
             <h3 className="text-sm font-bold uppercase text-gray-500 mb-4 mt-8 tracking-wider">Buch kaufen</h3>
              <div className="space-y-2 flex flex-col items-start">
                  <a href={amazonLink} target="_blank" rel="noopener noreferrer" className="w-full max-w-[200px]">
                      <Button variant="secondary" className="w-full justify-start gap-2">
                          <AmazonIcon className="h-4 w-4"/>
                          <span>Amazon</span>
                      </Button>
                  </a>
                  <a href={googlePlayLink} target="_blank" rel="noopener noreferrer" className="w-full max-w-[200px]">
                      <Button variant="outline" className="w-full justify-start gap-2">
                          <GooglePlayIcon className="h-4 w-4"/>
                          <span>Google Play</span>
                      </Button>
                  </a>
                  <a href={elevenReaderLink} target="_blank" rel="noopener noreferrer" className="w-full max-w-[200px]">
                      <Button variant="outline" className="w-full justify-start gap-2">
                          <ElevenReaderIcon className="h-4 w-4"/>
                          <span>11Reader</span>
                      </Button>
                  </a>
              </div>
          </div>

          {/* Contact Column */}
          <div className="text-left">
            <h3 className="text-sm font-bold uppercase text-gray-500 mb-5 tracking-wider">Kontakt</h3>
            <div className="text-[15px] text-gray-600 space-y-3">
              <p>
                <a href="mailto:philipp.l.paulik@gmail.com" className="hover:text-[#f08e6c]">Philipp (E-Mail)</a><br/>
                <a href="mailto:maximilian.reisch@t-online.de" className="hover:text-[#f08e6c]">Max (E-Mail)</a>
              </p>
              <p>© Paulik & Reisch</p>
              <p>Neunk.-Seelsch., & Wintersch.<br/>Deutschland</p>
            </div>
          </div>

          {/* Newsletter Column */}
          <div className="text-left">
            <h3 className="text-sm font-bold uppercase text-gray-500 mb-5 tracking-wider">Stay Connected</h3>
            <p className="text-[15px] text-gray-600 mb-5">
              Zum Newsletter anmelden.
            </p>
            <form ref={formRef} action={formAction} className="flex flex-col gap-2.5 items-start">
              <Input type="email" name="email" placeholder="E-Mail-Adresse eingeben" className="bg-white border-gray-300 rounded-sm" required />
              <input type="hidden" name="source" value="main-footer" />
              <SubmitButton />
            </form>
          </div>

        </div>
      </footer>

      {/* Bottom Section */}
      <div className="bg-muted text-muted-foreground py-10 px-5 text-xs">
        <div className="container mx-auto max-w-7xl flex flex-col md:flex-row justify-between items-center md:items-start gap-10 text-left">
          
          <div className="md:flex-2 max-w-3xl opacity-90 leading-relaxed text-left">
            <p>Die satirische "Hallo Welt"-Bücherserie ist eine Idee und Kreation von Philipp Paulik (Autor), Maximilian Reisch (Autor), Luin Schiffbauer (Illustrator) und weiteren Mitwirkenden. Veröffentlicht und produziert durch Kindle Direct Publishing (KDP) der Amazon Distribution GmbH, Leipzig sowie ggf. weitere Verlags- und Produktionspartnern.</p>
            <br/>
            <p>Amazon Media EU S.à r.l. (registrierter Verkäufer von digitalen Inhalten, die mit "Verkauf durch Amazon Media EU SARL" gekennzeichnet sind.<br/>
            Amazon Media EU S.à r.l. (Société à responsabilité limitée)</p>
            <br/>
            <p>Das Spiel "Worthaft" ist eine unabhängige Hommage und steht in keiner Verbindung zum Original "Wordle" der New York Times. Spieldaten wie Statistiken und Fortschritt werden ausschließlich lokal im Browser des Nutzers gespeichert. Es findet keine serverseitige Erfassung oder Auswertung der Spieldaten statt.</p>
            <br/>
            <p>Die auf dieser Webseite veröffentlichten satirischen Artikel dienen ausschließlich der Unterhaltung. Sie stellen keinen redaktionellen oder informativen Inhalt dar. Dargestellte Informationen können von der Wahrheit abweichen und haben nicht zum Ziel, Personen oder Institutionen zu diffamieren.</p>
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
