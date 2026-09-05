import { NextResponse, type NextRequest } from 'next/server';

// 301 domain move: paulik-reisch.de (alt) -> paulikreisch.de (neu)
// Erfüllt GSC "Adressänderung" Validierung: Homepage + alle Pfade 301
// Firebase App Hosting behält beide Domains am selben Backend, daher Host-Check in Middleware.
export function middleware(request: NextRequest) {
  const host = request.headers.get('host')?.toLowerCase() ?? '';
  const pathname = request.nextUrl.pathname;
  const search = request.nextUrl.search;

  // Alte Domain (mit Bindestrich) -> neue Domain (ohne Bindestrich), 301
  // Trifft: paulik-reisch.de, www.paulik-reisch.de
  const isOldDomain = host === 'paulik-reisch.de'
    || host === 'www.paulik-reisch.de'
    || host.endsWith('.paulik-reisch.de');

  if (isOldDomain) {
    const url = `https://paulikreisch.de${pathname}${search}`;
    return NextResponse.redirect(url, 301);
  }

  // Optional: www.paulikreisch.de -> paulikreisch.de konsolidieren
  if (host === 'www.paulikreisch.de' || host.endsWith('.paulikreisch.de')) {
    const url = `https://paulikreisch.de${pathname}${search}`;
    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}

export const config = {
  // Läuft auf allen Pfaden inkl. /shop, /impressum, /ueber/* etc. — genau was GSC unter "Beispielseiten" prüft
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|txt|xml|webmanifest)).*)'],
};
