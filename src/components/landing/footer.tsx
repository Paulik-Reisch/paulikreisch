"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { subscribeToNewsletterAction, logEventAction } from "@/app/actions";
import { LibraryBig, Loader2 } from "lucide-react";
import { Logo } from "../ui/logo";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { getBrowserAnalyticsId, OPEN_CONSENT } from '@/lib/analytics-consent';
import { usePathname } from "next/navigation";
import { AmazonIcon } from '@/components/ui/icons/amazon-icon';
import { ThemeToggle } from '@/components/theme-toggle';
import { WorthaftIcon } from "../ui/icons/worthaft-icon";

const initialNewsletterState = { success: undefined, error: undefined, message: undefined };

const amazonLink = "https://amzn.eu/d/0CdFeZ3";
const googlePlayLink = "https://play.google.com/store/books/details?id=HZb3EAAAQBAJ&rdid=book-HZb3EAAAQBAJ&rdot=1&source=gbs_atb&pcampaignid=books_booksearch_atb";
const elevenReaderLink = "https://elevenreader.io/audiobooks/hallo-welt/PNgTk712as4goF7HwxJJ";

const moreButtonClass = "cursor-pointer text-xs text-inherit hover:text-foreground hover:underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2268ff] focus-visible:ring-offset-2";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center rounded-[10px] border-2 border-[#1d1a15] bg-[#ffe14d] px-5 py-2.5 text-[0.9rem] font-bold text-[#1d1a15] shadow-[0_2px_0_#1d1a15] hover:translate-y-[-1px] hover:shadow-[0_3px_0_#1d1a15] active:translate-y-[1px] active:shadow-[0_1px_0_#1d1a15] transition-[transform,box-shadow] disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none self-start dark:border-[#bfa100] dark:shadow-[0_2px_0_#6b5700] dark:hover:shadow-[0_3px_0_#6b5700] dark:active:shadow-[0_1px_0_#6b5700]"
    >
      {pending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Senden…</> : "Anmelden"}
    </button>
  );
}

export function Footer() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useActionState(subscribeToNewsletterAction, initialNewsletterState);
  const { toast } = useToast();
  const pathname = usePathname();
  const handledNewsletterState = useRef<typeof state | null>(null);
  const cool = pathname === '/worthaft';
  const tBar = cool ? 'dark:bg-[hsl(240_4%_12%)]' : 'dark:bg-[#211d17]';
  const tPanel = cool ? 'dark:bg-[hsl(240_4%_18%)]' : 'dark:bg-[#2a251e]';
  const tPanelHover = cool ? 'dark:hover:bg-[hsl(240_4%_25%)]' : 'dark:hover:bg-[#332d24]';
  const tLine = cool ? 'dark:border-[hsl(240_4%_25%)]' : 'dark:border-[#3a352d]';
  const tEdgeWorthaft = cool ? 'dark:border-[hsl(240_5%_45%)]' : 'dark:border-[#6b6353]';
  const darkShadowBlack = 'dark:shadow-[0_3px_0_#000000] dark:hover:shadow-[0_4px_0_#000000] dark:active:shadow-[0_1px_0_#000000]';
  const darkTonalYellow = 'dark:border-[#bfa100] dark:shadow-[0_3px_0_#6b5700] dark:hover:shadow-[0_4px_0_#6b5700] dark:active:shadow-[0_1px_0_#6b5700]';
  const darkTonalBlue = 'dark:border-[#1a5aa8] dark:shadow-[0_3px_0_#0e3563] dark:hover:shadow-[0_4px_0_#0e3563] dark:active:shadow-[0_1px_0_#0e3563]';
  const tInk = cool ? 'dark:text-[hsl(0_0%_98%)]' : 'dark:text-[#f2ede3]';
  const tMuted = cool ? 'dark:text-[hsl(240_5%_65%)]' : 'dark:text-[#b6ad9c]';
  const tMuted2 = cool ? 'dark:text-[hsl(240_5%_65%)]' : 'dark:text-[#a89f8f]';
  const tAccent = cool ? 'dark:text-[hsl(220_85%_68%)]' : 'dark:text-[#e8836f]';
  const tAccentHover = cool ? 'dark:hover:text-[hsl(220_85%_68%)]' : 'dark:hover:text-[#e8836f]';
  const tDeco = cool ? 'dark:decoration-[hsl(240_4%_25%)]' : 'dark:decoration-[#3a352d]';
  const tFocusEdge = cool ? 'dark:focus-visible:border-[hsl(240_5%_88%)]' : 'dark:focus-visible:border-[#e8e2d4]';
  const actionClass = `inline-flex h-12 items-center justify-start gap-2 rounded-[10px] border-2 border-[#1d1a15] px-4 text-[0.9rem] font-semibold text-[#1d1a15] shadow-[0_3px_0_#1d1a15] hover:translate-y-[-1px] hover:shadow-[0_4px_0_#1d1a15] active:translate-y-[1px] active:shadow-[0_1px_0_#1d1a15] transition-[transform,box-shadow,background-color]`;
  const moreTriggerRef = useRef<HTMLButtonElement>(null);
  const desktopMoreTriggerRef = useRef<HTMLButtonElement>(null);
  const [moreOpen, setMoreOpen] = useState(false);
  const [desktopMoreOpen, setDesktopMoreOpen] = useState(false);
  const [moreMenuHovered, setMoreMenuHovered] = useState(false);

  const openCookieSettings = () => {
    const trigger = desktopMoreOpen ? desktopMoreTriggerRef.current : moreTriggerRef.current;
    setMoreOpen(false);
    setDesktopMoreOpen(false);
    // Let the menu close and restore trigger focus before opening the dialog.
    requestAnimationFrame(() => {
      trigger?.focus({ preventScroll: true });
      window.dispatchEvent(new Event(OPEN_CONSENT));
    });
  };

  useEffect(() => {
    if (state.success && handledNewsletterState.current !== state) {
      handledNewsletterState.current = state;
      toast({ title: "Fast geschafft!", description: state.message });
      const analyticsId = getBrowserAnalyticsId();
      if (analyticsId && formRef.current) {
        const formData = new FormData(formRef.current);
        const source = formData.get('source') as string;
        void logEventAction('newsletter_subscription', analyticsId, pathname, { source }).catch(() => {});
      }
      formRef.current?.reset();
    }
    if (state.error) {
      toast({ variant: "destructive", title: "Fehler", description: state.error });
    }
  }, [state, toast, pathname]);

  useEffect(() => {
    if ((!moreOpen && !desktopMoreOpen) || moreMenuHovered) return;
    const timeoutId = window.setTimeout(() => {
      setMoreOpen(false);
      setDesktopMoreOpen(false);
    }, 5000);
    return () => window.clearTimeout(timeoutId);
  }, [moreOpen, desktopMoreOpen, moreMenuHovered]);
  
  return (
    <div className={`text-[#4d463b] leading-relaxed ${tMuted}`}>
      {/* Top */}
      <footer className={`bg-white border-t border-[#e8ddd0] py-12 md:py-14 px-5 relative overflow-hidden ${tBar} ${tLine}`}>
        <div className="relative container mx-auto max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">
          <div className="text-left">
            <Link href="/" aria-label="Paulik &amp; Reisch – Startseite" className={`inline-flex text-[#1d1a15] transition-colors hover:text-[#9c2d22] ${tInk} ${tAccentHover}`}>
              <Logo className="w-28 md:w-32" />
            </Link>
            <p className={`mt-2 text-[15px] font-bold text-[#1d1a15] ${tInk}`}>Paulik &amp; Reisch</p>
          </div>

          {/* Entdecken — gelb pill buttons */}
          <div className="flex flex-col gap-4 text-left">
            <h3 className={`text-[0.72rem] font-bold uppercase tracking-[0.12em] text-[#9c2d22] ${tAccent}`}>Entdecken</h3>
            <ul className="flex w-full flex-col gap-3">
              <li className="flex">
                <a href={amazonLink} target="_blank" rel="noopener noreferrer" className={`${actionClass} w-[125px] self-start bg-[#ffe14d] ${darkTonalYellow}`}>
                  <AmazonIcon className="h-4 w-4 shrink-0" />
                  <span>Amazon</span>
                </a>
              </li>
              <li className="flex">
                <Link href="/worthaft" className={`${actionClass} w-[125px] self-start bg-white hover:bg-[#f7f2e7] ${tPanel} ${tInk} ${tPanelHover} ${tEdgeWorthaft} ${darkShadowBlack}`}>
                  <span className="worthaft-icon-shimmer shrink-0">
                    <WorthaftIcon className="h-4 w-4" />
                  </span>
                  Worthaft
                </Link>
              </li>
              <li className="flex">
                <Link href="/ratgeber" className={`${actionClass} w-[125px] self-start bg-[#2275d3] text-white ${darkTonalBlue}`}>
                  <LibraryBig className="h-4 w-4 shrink-0" aria-hidden="true" />
                  Ratgeber
                </Link>
              </li>
            </ul>
          </div>

          {/* Kontakt */}
          <div className="flex flex-col gap-3 text-left">
            <h3 className={`text-[0.72rem] font-bold uppercase tracking-[0.12em] text-[#9c2d22] ${tAccent}`}>Kontakt</h3>
            <div className="flex flex-col gap-2.5 text-[15px] text-[#4d463b]">
              <div className="flex flex-col gap-2">
                <a href="mailto:philipp.l.paulik@gmail.com" className={`font-semibold text-[#1d1a15] hover:text-[#9c2d22] hover:underline underline-offset-4 ${tInk} ${tAccentHover}`}>Philipp</a>
                <a href="mailto:maximilian.reisch@t-online.de" className={`font-semibold text-[#1d1a15] hover:text-[#9c2d22] hover:underline underline-offset-4 ${tInk} ${tAccentHover}`}>Max</a>
              </div>
              <Link href="/ueber/autoren" className={`text-[#6b6256] hover:text-[#9c2d22] hover:underline underline-offset-4 ${tMuted2} ${tAccentHover}`}>
                Über die Autoren
              </Link>
            </div>
          </div>

          {/* Newsletter */}
          <div className="flex min-w-0 flex-col gap-4 text-left">
            <h3 className={`text-[0.72rem] font-bold uppercase tracking-[0.12em] text-[#9c2d22] ${tAccent}`}>Newsletter</h3>
            <form ref={formRef} action={formAction} className="flex w-full flex-col gap-3">
              <div className="grid w-full grid-cols-[0px_minmax(0,1fr)]">
                <Input type="email" name="email" placeholder="E-Mail-Adresse eingeben" className={`col-start-2 w-full bg-white border-2 border-[#e8ddd0] rounded-[10px] focus-visible:border-[#1d1a15] focus-visible:ring-0 h-11 ${tPanel} ${tLine} ${tInk} ${tFocusEdge}`} required />
              </div>
              <input type="hidden" name="source" value="main-footer" />
              <label className={`grid w-full grid-cols-[14px_minmax(0,1fr)] items-start gap-2 text-[11px] text-[#6b6256] leading-snug cursor-pointer ${tMuted2}`}>
                <input type="checkbox" name="consent" value="true" required className={`mt-0.5 h-3.5 w-3.5 shrink-0 rounded-sm border-[#e8ddd0] accent-[#1d1a15] ${tLine} dark:accent-[#ffe14d]`} />
                <span className="block w-full min-w-0">
                  Ich habe die{' '}
                  <Link href="/datenschutz" className={`underline decoration-[#e8ddd0] hover:text-[#1d1a15] ${tDeco} dark:hover:text-[#f2ede3]`}>Datenschutzerklärung</Link>
                  {' '}gelesen und möchte den Newsletter per E-Mail erhalten (ca. einmal pro Woche, jederzeit abbestellbar).
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
          <div className="relative flex items-center gap-2 sm:gap-4">
            <nav aria-label="Rechtliche Informationen" className="hidden sm:flex flex-wrap justify-center gap-x-4 gap-y-2 sm:justify-end">
              <Popover open={desktopMoreOpen} onOpenChange={setDesktopMoreOpen}>
                <PopoverTrigger asChild>
                  <button ref={desktopMoreTriggerRef} type="button" className={moreButtonClass}>
                    Mehr
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  side="top"
                  align="end"
                  role="region"
                  aria-label="Weitere rechtliche Informationen"
                  className={`w-48 origin-[var(--radix-popover-content-transform-origin)] rounded-[10px] border-[#e8ddd0] bg-white p-1 text-xs text-[#1d1a15] shadow-[0_10px_24px_rgba(29,26,21,0.16)] motion-reduce:animate-none ${tLine} ${tPanel} ${tInk}`}
                  onMouseEnter={() => setMoreMenuHovered(true)}
                  onMouseLeave={() => setMoreMenuHovered(false)}
                >
                  <Link
                    href="/impressum"
                    className={`block px-3 py-1.5 text-left text-xs text-[#1d1a15] hover:underline transition-colors ${tInk}`}
                  >
                    Impressum
                  </Link>
                  <Link
                    href="/datenschutz"
                    className={`block px-3 py-1.5 text-left text-xs text-[#1d1a15] hover:underline transition-colors ${tInk}`}
                  >
                    Datenschutz
                  </Link>
                  <Link
                    href="/cookie-richtlinie"
                    className={`block px-3 py-1.5 text-left text-xs text-[#1d1a15] hover:underline transition-colors ${tInk}`}
                  >
                    Cookie-Richtlinie
                  </Link>
                  <button
                    type="button"
                    onClick={openCookieSettings}
                    className={`block w-full px-3 py-1.5 text-left text-xs text-[#1d1a15] hover:underline transition-colors ${tInk}`}
                  >
                    Cookie-Einstellungen
                  </button>
                  <Link
                    href="/transparenz"
                    className={`block px-3 py-1.5 text-left text-xs text-[#1d1a15] hover:underline transition-colors ${tInk}`}
                  >
                    Transparenzhinweise
                  </Link>
                  <Link
                    href="/agb"
                    className={`block px-3 py-1.5 text-left text-xs text-[#1d1a15] hover:underline transition-colors ${tInk}`}
                  >
                    AGB
                  </Link>
                  <Link
                    href="/widerruf"
                    className={`block px-3 py-1.5 text-left text-xs text-[#1d1a15] hover:underline transition-colors ${tInk}`}
                  >
                    Widerruf
                  </Link>
                  <Link
                    href="/urheberrecht"
                    className={`block px-3 py-1.5 text-left text-xs text-[#1d1a15] hover:underline transition-colors ${tInk}`}
                  >
                    Urheberrecht
                  </Link>
                  <Link
                    href="/barrierefreiheit"
                    className={`block px-3 py-1.5 text-left text-xs text-[#1d1a15] hover:underline transition-colors ${tInk}`}
                  >
                    Barrierefreiheit
                  </Link>
                </PopoverContent>
              </Popover>
            </nav>
            <div className="flex items-center gap-2 self-end sm:hidden">
              <button
                type="button"
                className={moreButtonClass}
                aria-expanded={moreOpen}
                ref={moreTriggerRef}
                aria-controls="footer-more-menu"
                onClick={() => setMoreOpen((open) => !open)}
              >
                Mehr
              </button>
              <div
                id="footer-more-menu"
                role="region"
                aria-label="Weitere rechtliche Informationen"
                aria-hidden={!moreOpen}
                data-state={moreOpen ? "open" : "closed"}
                onMouseEnter={() => setMoreMenuHovered(true)}
                onMouseLeave={() => setMoreMenuHovered(false)}
                className={`absolute bottom-full left-1/2 z-50 mb-2 w-48 -translate-x-1/2 origin-bottom rounded-[10px] border border-[#e8ddd0] bg-white p-1 text-xs text-[#1d1a15] shadow-[0_10px_24px_rgba(29,26,21,0.16)] ${tLine} ${tPanel} ${tInk} transition-[opacity,transform,visibility] duration-200 ease-out motion-reduce:transition-none ${
                  moreOpen
                    ? "visible translate-y-0 scale-100 opacity-100"
                    : "pointer-events-none invisible translate-y-2 scale-95 opacity-0"
                }`}
              >
                  <div className="flex flex-col gap-1">
                    <Link
                      href="/impressum"
                      className={`block px-3 py-1.5 text-left text-xs text-[#1d1a15] hover:bg-[#f7f2e7] hover:text-[#9c2d22] transition-colors ${tInk} ${tPanelHover} ${tAccentHover}`}
                      onClick={() => setMoreOpen(false)}
                    >
                      Impressum
                    </Link>
                    <Link
                      href="/datenschutz"
                      className={`block px-3 py-1.5 text-left text-xs text-[#1d1a15] hover:bg-[#f7f2e7] hover:text-[#9c2d22] transition-colors ${tInk} ${tPanelHover} ${tAccentHover}`}
                      onClick={() => setMoreOpen(false)}
                    >
                      Datenschutz
                    </Link>
                    <Link
                      href="/cookie-richtlinie"
                      className={`block px-3 py-1.5 text-left text-xs text-[#1d1a15] hover:bg-[#f7f2e7] hover:text-[#9c2d22] transition-colors ${tInk} ${tPanelHover} ${tAccentHover}`}
                      onClick={() => setMoreOpen(false)}
                    >
                      Cookie-Richtlinie
                    </Link>
                    <button
                      type="button"
                      onClick={openCookieSettings}
                      className={`block w-full px-3 py-1.5 text-left text-xs text-[#1d1a15] hover:bg-[#f7f2e7] hover:text-[#9c2d22] transition-colors ${tInk} ${tPanelHover} ${tAccentHover}`}
                    >
                      Cookie-Einstellungen
                    </button>
                    <Link
                      href="/transparenz"
                      className={`block px-3 py-1.5 text-left text-xs text-[#1d1a15] hover:bg-[#f7f2e7] hover:text-[#9c2d22] transition-colors ${tInk} ${tPanelHover} ${tAccentHover}`}
                      onClick={() => setMoreOpen(false)}
                    >
                      Transparenzhinweise
                    </Link>
                    <Link
                      href="/agb"
                      className={`block px-3 py-1.5 text-left text-xs text-[#1d1a15] hover:bg-[#f7f2e7] hover:text-[#9c2d22] transition-colors ${tInk} ${tPanelHover} ${tAccentHover}`}
                      onClick={() => setMoreOpen(false)}
                    >
                      AGB
                    </Link>
                    <Link
                      href="/widerruf"
                      className={`block px-3 py-1.5 text-left text-xs text-[#1d1a15] hover:bg-[#f7f2e7] hover:text-[#9c2d22] transition-colors ${tInk} ${tPanelHover} ${tAccentHover}`}
                      onClick={() => setMoreOpen(false)}
                    >
                      Widerruf
                    </Link>
                    <Link
                      href="/urheberrecht"
                      className={`block px-3 py-1.5 text-left text-xs text-[#1d1a15] hover:bg-[#f7f2e7] hover:text-[#9c2d22] transition-colors ${tInk} ${tPanelHover} ${tAccentHover}`}
                      onClick={() => setMoreOpen(false)}
                    >
                      Urheberrecht
                    </Link>
                    <Link
                      href="/barrierefreiheit"
                      className={`block px-3 py-1.5 text-left text-xs text-[#1d1a15] hover:bg-[#f7f2e7] hover:text-[#9c2d22] transition-colors ${tInk} ${tPanelHover} ${tAccentHover}`}
                      onClick={() => setMoreOpen(false)}
                    >
                      Barrierefreiheit
                    </Link>
                  </div>
              </div>
            </div>
            <div className="hidden items-center gap-2 sm:flex">
              <span>Dunkelmodus</span>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
