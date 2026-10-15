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
      <footer className="bg-white border-t border-[#e8ddd0] py-12 md:py-14 px-5 relative overflow-hidden">
        {/* subtle dots like landing */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(#1d1a15 1.1px, transparent 1.1px)", backgroundSize: "22px 22px" }} />
        <div className="relative container mx-auto max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[0.55fr_0.85fr_0.85fr_1.75fr] gap-x-8 gap-y-10">
          <div className="text-left">
            <Link href="/" aria-label="Paulik &amp; Reisch – Startseite" className="inline-flex text-[#1d1a15] transition-colors hover:text-[#9c2d22]">
              <Logo className="w-28 md:w-32" />
            </Link>
            <p className="mt-2 text-[15px] font-bold text-[#1d1a15]">Paulik &amp; Reisch</p>
          </div>

          {/* Entdecken — gelb pill buttons */}
          <div className="text-left">
            <h3 className="text-[0.72rem] font-bold uppercase tracking-[0.12em] text-[#9c2d22] mb-4">Entdecken</h3>
            <ul className="space-y-5">
              <li>
                <Link href="/ueber/autoren" className="text-[15px] font-normal text-[#1d1a15] hover:text-[#9c2d22] hover:underline underline-offset-4 transition-colors">
                  Über die Autoren
                </Link>
              </li>
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
            </div>
          </div>

          {/* Kontakt */}
          <div className="text-left">
            <h3 className="text-[0.72rem] font-bold uppercase tracking-[0.12em] text-[#9c2d22] mb-4">Kontakt</h3>
            <div className="text-[15px] text-[#4d463b] space-y-3">
              <p>
                <a href="mailto:philipp.l.paulik@gmail.com" className="font-semibold text-[#1d1a15] hover:text-[#9c2d22] hover:underline underline-offset-4">Philipp</a><br/>
                <a href="mailto:maximilian.reisch@t-online.de" className="font-semibold text-[#1d1a15] hover:text-[#9c2d22] hover:underline underline-offset-4">Max</a>
              </p>
              <p className="text-[#6b6256]">Neunkirchen-Seelschscheid, Winterscheid<br/>Deutschland</p>
            </div>
          </div>

          {/* Newsletter */}
          <div className="text-left rounded-2xl border border-[#e8ddd0] bg-[#f7f2e7]/70 p-5 md:p-6">
            <h3 className="text-[0.72rem] font-bold uppercase tracking-[0.12em] text-[#9c2d22] mb-5">Newsletter</h3>
            <form ref={formRef} action={formAction} className="flex flex-col gap-3 items-start">
              <Input type="email" name="email" placeholder="E-Mail-Adresse eingeben" className="w-full bg-white border-2 border-[#e8ddd0] rounded-[10px] focus-visible:border-[#1d1a15] focus-visible:ring-0 h-11" required />
              <input type="hidden" name="source" value="main-footer" />
              <label className="flex w-full items-start gap-2 text-xs text-[#6b6256] leading-snug cursor-pointer">
                <input type="checkbox" name="consent" value="true" required className="mt-0.5 h-3.5 w-3.5 shrink-0 rounded-sm border-[#e8ddd0] accent-[#1d1a15]" />
                <span>
                  Ich akzeptiere die{' '}
                  <Link href="/datenschutz" className="underline decoration-[#e8ddd0] hover:text-[#1d1a15]">Datenschutzerklärung</Link>
                  {' '}und die{' '}
                  <Link href="/agb" className="underline decoration-[#e8ddd0] hover:text-[#1d1a15]">AGB</Link>.
                </span>
              </label>
              <SubmitButton />
            </form>
          </div>

        </div>
      </footer>

      {/* Bottom */}
      <div className="border-t bg-muted px-5 py-4 text-xs text-muted-foreground">
        <div className="container mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 sm:flex-row">
          <span className="text-center sm:text-left">
            © {new Date().getFullYear()} Paulik &amp; Reisch. Alle Rechte vorbehalten.
          </span>
          <nav aria-label="Rechtliche Informationen" className="flex flex-wrap justify-center gap-x-4 gap-y-2 sm:justify-end">
            <Link href="/impressum" className="hover:text-foreground hover:underline">Impressum</Link>
            <Link href="/datenschutz" className="hover:text-foreground hover:underline">Datenschutz</Link>
            <Link href="/cookie-richtlinie" className="hover:text-foreground hover:underline">Cookie-Richtlinie</Link>
            <Link href="/transparenz" className="hover:text-foreground hover:underline">Transparenzhinweise</Link>
            <Link href="/agb" className="hover:text-foreground hover:underline">AGB</Link>
            <Link href="/widerruf" className="hover:text-foreground hover:underline">Widerruf</Link>
            <Link href="/urheberrecht" className="hover:text-foreground hover:underline">Urheberrecht</Link>
            <Link href="/barrierefreiheit" className="hover:text-foreground hover:underline">Barrierefreiheit</Link>
          </nav>
        </div>
      </div>
    </div>
  );
}
