"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { ImageWithLoader as Image } from "@/components/ui/image-with-loader";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { subscribeToNewsletterAction, logEventAction } from "@/app/actions";
import { Loader2 } from "lucide-react";
import { Logo } from "../ui/logo";
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
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center rounded-[10px] border-2 border-[#1d1a15] bg-[#ffe14d] px-5 py-2.5 text-[0.9rem] font-bold text-[#1d1a15] shadow-[0_2px_0_#1d1a15] hover:translate-y-[-1px] hover:shadow-[0_3px_0_#1d1a15] active:translate-y-[1px] active:shadow-[0_1px_0_#1d1a15] transition-[transform,box-shadow] disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none self-start"
    >
      {pending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Senden…</> : "Anmelden"}
    </button>
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
    <div className="text-[#4d463b] leading-relaxed">
      {/* Top */}
      <footer className="bg-white border-t border-[#e8ddd0] py-14 md:py-16 px-5 relative overflow-hidden">
        {/* subtle dots like landing */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(#1d1a15 1.1px, transparent 1.1px)", backgroundSize: "22px 22px" }} />
        <div className="relative container mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1fr_1fr_1.5fr_1.5fr] gap-10">
          
          {/* Brand */}
          <div className="flex flex-col items-start text-left">
            <Logo className="w-36 h-auto mb-4 text-black" />
            <p className="font-[Georgia,_Iowan_Old_Style,_Times_New_Roman,_serif] font-bold text-[#1d1a15]">Paulik und Reisch</p>
            <p className="mt-2 text-[0.9rem] leading-relaxed text-[#6b6256] max-w-[260px]">Satire, die den Schulwahnsinn ernst nimmt. 106 Seiten. 5,0★.</p>
          </div>

          {/* Entdecken — gelb pill buttons */}
          <div className="text-left">
            <h3 className="text-[0.72rem] font-bold uppercase tracking-[0.12em] text-[#9c2d22] mb-5">Entdecken</h3>
            <ul className="space-y-3">
              <li><Link href="/ueber/autoren" className="text-[#1d1a15] hover:text-[#9c2d22] text-[15px] font-medium hover:underline underline-offset-4 decoration-[#e8ddd0]">Über die Autoren</Link></li>
              <li>
                <Link href="/worthaft" className="inline-flex items-center gap-2 rounded-full border border-[#e8ddd0] bg-white px-3.5 py-1.5 text-[14px] font-semibold text-[#1d1a15] hover:bg-[#f7f2e7] transition-colors">
                  <WorthaftIcon className="h-4 w-4" />
                  <span>Worthaft</span>
                </Link>
              </li>
            </ul>
            <h3 className="text-[0.72rem] font-bold uppercase tracking-[0.12em] text-[#9c2d22] mb-4 mt-8">Buch kaufen</h3>
            <div className="flex flex-col items-start gap-2.5">
              <a href={amazonLink} target="_blank" rel="noopener noreferrer" className="w-full max-w-[220px]">
                <span className="flex w-full items-center justify-start gap-2 rounded-[10px] border-2 border-[#1d1a15] bg-[#ffe14d] px-4 py-2.5 text-[0.9rem] font-bold text-[#1d1a15] shadow-[0_2px_0_#1d1a15] hover:translate-y-[-1px] hover:shadow-[0_3px_0_#1d1a15] active:translate-y-[1px] active:shadow-[0_1px_0_#1d1a15] transition-[transform,box-shadow]">
                  <AmazonIcon className="h-4 w-4"/><span>Amazon</span>
                </span>
              </a>
              <a href={googlePlayLink} target="_blank" rel="noopener noreferrer" className="w-full max-w-[220px]">
                <span className="flex w-full items-center justify-start gap-2 rounded-[10px] border-2 border-[#e8ddd0] bg-white px-4 py-2.5 text-[0.9rem] font-bold text-[#1d1a15] shadow-sm hover:bg-[#f7f2e7] hover:border-[#d9c7a8] transition-colors">
                  <GooglePlayIcon className="h-4 w-4"/><span>Google Play</span>
                </span>
              </a>
              <a href={elevenReaderLink} target="_blank" rel="noopener noreferrer" className="w-full max-w-[220px]">
                <span className="flex w-full items-center justify-start gap-2 rounded-[10px] border-2 border-[#e8ddd0] bg-white px-4 py-2.5 text-[0.9rem] font-bold text-[#1d1a15] shadow-sm hover:bg-[#f7f2e7] hover:border-[#d9c7a8] transition-colors">
                  <ElevenReaderIcon className="h-4 w-4"/><span>11Reader</span>
                </span>
              </a>
            </div>
          </div>

          {/* Kontakt */}
          <div className="text-left">
            <h3 className="text-[0.72rem] font-bold uppercase tracking-[0.12em] text-[#9c2d22] mb-5">Kontakt</h3>
            <div className="text-[15px] text-[#4d463b] space-y-3">
              <p>
                <a href="mailto:philipp.l.paulik@gmail.com" className="font-semibold text-[#1d1a15] hover:text-[#9c2d22] hover:underline underline-offset-4">Philipp</a><br/>
                <a href="mailto:maximilian.reisch@t-online.de" className="font-semibold text-[#1d1a15] hover:text-[#9c2d22] hover:underline underline-offset-4">Max</a>
              </p>
              <p className="text-[#6b6256]">© Paulik & Reisch</p>
              <p className="text-[#6b6256]">Neunk.-Seelsch., Winterscheid<br/>Deutschland</p>
            </div>
          </div>

          {/* Newsletter — gelbe card */}
          <div className="text-left">
            <h3 className="text-[0.72rem] font-bold uppercase tracking-[0.12em] text-[#9c2d22] mb-5">Stay Connected</h3>
            <p className="text-[15px] text-[#4d463b] mb-4">Zum Newsletter anmelden</p>
            <form ref={formRef} action={formAction} className="flex flex-col gap-2.5 items-start">
              <Input type="email" name="email" placeholder="E-Mail-Adresse eingeben" className="bg-white border-2 border-[#e8ddd0] rounded-[10px] focus-visible:border-[#1d1a15] focus-visible:ring-0 h-11" required />
              <input type="hidden" name="source" value="main-footer" />
              <label className="flex items-start gap-2 text-xs text-[#6b6256] leading-snug cursor-pointer">
                <input type="checkbox" name="consent" value="true" required className="mt-0.5 h-3.5 w-3.5 shrink-0 rounded-sm border-[#e8ddd0] accent-[#1d1a15]" />
                <span>
                  Mit dem Klick akzeptiere ich die{' '}
                  <Link href="/datenschutz" className="underline decoration-[#e8ddd0] hover:text-[#1d1a15]">Datenschutzerklärung</Link>
                  {' '}und die{' '}
                  <Link href="/agb" className="underline decoration-[#e8ddd0] hover:text-[#1d1a15]">AGB</Link>
                  {' '}und willige in den Newsletter-Versand ein.
                </span>
              </label>
              <SubmitButton />
            </form>
          </div>

        </div>
      </footer>

      {/* Bottom */}
      <div className="bg-muted text-muted-foreground py-10 px-5 text-xs border-t">
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
            <br/>
            <p>Die vorliegenden Inhalte werden mittels automatisierter Verfahren maschineller Sprachgenerierung (Künstliche Intelligenz) vorverarbeitet, wobei die finale redaktionelle Verantwortung und inhaltliche Prüfung gemäß § 18 Abs. 2 MStV bei der benannten natürlichen Person verbleibt. Eine Offenlegung im Sinne des Art. 50 Abs. 1 der Verordnung (EU) 2024/1689 (KI-Verordnung) erfolgt über die hierfür vorgesehene Transparenzerklärung. Die Nutzung der generierten Vorschläge begründet kein vertrauensschutzähnliches Verhältnis und entfaltet keine rechtliche Bindungswirkung gegenüber dem Anbieter. Etwaige Risiken im Sinne des Anhangs III der KI-Verordnung werden durch geeignete technische und organisatorische Maßnahmen auf ein Minimum reduziert.</p>
          </div>

          <div className="flex-1 flex flex-col items-end gap-2 min-w-[200px] text-right">
            <span className="opacity-90">© {new Date().getFullYear()} Paulik & Reisch. Alle Rechte vorbehalten.</span>
            <Link href="/impressum" className="opacity-90 hover:opacity-100 hover:underline">Impressum</Link>
            <Link href="/datenschutz" className="opacity-90 hover:opacity-100 hover:underline">Datenschutz</Link>
            <Link href="/cookie-richtlinie" className="opacity-90 hover:opacity-100 hover:underline">Cookie-Richtlinie</Link>
            <Link href="/transparenz" className="opacity-90 hover:opacity-100 hover:underline">Transparenzhinweise</Link>
            <Link href="/agb" className="opacity-90 hover:opacity-100 hover:underline">AGB</Link>
            <Link href="/widerruf" className="opacity-90 hover:opacity-100 hover:underline">Widerruf</Link>
            <Link href="/urheberrecht" className="opacity-90 hover:opacity-100 hover:underline">Urheberrecht</Link>
            <Link href="/barrierefreiheit" className="opacity-90 hover:opacity-100 hover:underline">Barrierefreiheit</Link>
          </div>

        </div>
      </div>
    </div>
  );
}
