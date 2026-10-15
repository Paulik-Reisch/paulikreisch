import type { Metadata, Viewport } from 'next';
import { Suspense } from 'react';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';
import { CookieBanner } from '@/components/landing/cookie-banner';
import { ThemeProvider } from '@/components/theme-provider';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { GlobalTracker } from '@/components/analytics/global-tracker';
import localFont from 'next/font/local';

const poppins = localFont({ src: './fonts/poppins-latin-700-normal.woff2', weight: '700', display: 'swap', variable: '--font-poppins' });
const inter = localFont({ src: [
  { path: './fonts/inter-latin-400-normal.woff2', weight: '400' },
  { path: './fonts/inter-latin-700-normal.woff2', weight: '700' },
], display: 'swap', variable: '--font-inter' });
const patrickHand = localFont({ src: './fonts/patrick-hand-latin-400-normal.woff2', weight: '400', display: 'swap', variable: '--font-patrick-hand' });
const lora = localFont({ src: [
  { path: './fonts/lora-latin-400-normal.woff2', weight: '400' },
  { path: './fonts/lora-latin-700-normal.woff2', weight: '700' },
], display: 'swap', variable: '--font-lora' });
const sourceSerif = localFont({ src: [
  { path: './fonts/source-serif-4-latin-400-normal.woff2', weight: '400' },
  { path: './fonts/source-serif-4-latin-700-normal.woff2', weight: '700' },
], display: 'swap', variable: '--font-source-serif' });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ffffff',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://paulikreisch.de'),
  title: {
    default: 'Hallo Welt — Das satirische Buch über Schule | Paulik & Reisch',
    template: '%s | Paulik & Reisch',
  },
  description: 'Satire die weh tut und heilt: Paulik & Reisch sezieren Schulsystem, Bürokratie und Alltag. Buch „Hallo Welt" (106 S., 10,99€) + tägliches Worthaft + Magazin.',
  applicationName: 'Paulik & Reisch',
  appleWebApp: { title: 'Paulik & Reisch' },
  authors: [{ name: 'Philipp Paulik' }, { name: 'Maximilian Reisch' }],
  keywords: ['Satire', 'Humor', 'Buch Hallo Welt', 'Paulik Reisch', 'Schulsatire', 'Worthaft', 'Lernvollzugsanstalt', 'deutsche Satire', 'lustige Bücher'],
  openGraph: {
      title: 'Paulik & Reisch | Satirische Literatur & humorvolle Bücher',
      description: 'Schulsatire, Bürokratie-Wahnsinn, Worthaft täglich. Buch „Hallo Welt\" — 106 Seiten Premium-Zynismus, 10,99€ auf Amazon. Jetzt entdecken.',
      url: 'https://paulikreisch.de',
      siteName: 'Paulik & Reisch',
      locale: 'de_DE',
      type: 'website',
      images: [{ url: 'https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/Frame-social.png?alt=media&token=0bd72452-4230-4a07-8bec-0f557f2aa3c7', width: 1200, height: 630, alt: 'Paulik & Reisch — Satire, Buch Hallo Welt, Worthaft' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Paulik & Reisch | Satirische Literatur & humorvolle Bücher',
    description: '106 Seiten Schulsatire die sitzen. „Hallo Welt\" für 10,99€ + Worthaft + Magazin — täglich neuer Wahnsinn.',
    creator: '@paulikreisch',
    images: ['https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/Frame-social.png?alt=media&token=0bd72452-4230-4a07-8bec-0f557f2aa3c7'],
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icon.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  robots: {
    index: true,
    follow: true,
    'max-snippet': -1,
    'max-image-preview': 'large',
    'max-video-preview': -1,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: { canonical: 'https://paulikreisch.de' },
  verification: { google: undefined },
};

const globalJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://paulikreisch.de/#organization',
      name: 'Paulik & Reisch',
      url: 'https://paulikreisch.de',
      logo: { '@type': 'ImageObject', url: 'https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/p_und_r-logo.png?alt=media&token=e1b7c172-fa61-47f4-a4e4-f92fe0ffa522', width: 512, height: 512 },
      knowsAbout: ['Satire', 'Schulsatire', 'Bürokratie-Satire', 'deutsche Sprache', 'Bildungskritik', 'Wortspiel', 'humorvolle Bücher'],
      sameAs: ['https://amzn.eu/d/02nS59t2', 'https://www.amazon.de/s?k=Paulik+Reisch'],
    },
    {
      '@type': 'WebSite',
      '@id': 'https://paulikreisch.de/#website',
      url: 'https://paulikreisch.de',
      name: 'Paulik & Reisch',
      publisher: { '@id': 'https://paulikreisch.de/#organization' },
      inLanguage: 'de-DE',
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://paulikreisch.de/a?q={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={`${poppins.variable} ${inter.variable} ${patrickHand.variable} ${lora.variable} ${sourceSerif.variable} font-body antialiased`}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(globalJsonLd) }} />
        <ThemeProvider attribute="class" defaultTheme="light">
          <FirebaseClientProvider>
            {children}
            <Toaster />
            <CookieBanner />
            <Suspense>
              <GlobalTracker />
            </Suspense>
          </FirebaseClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
