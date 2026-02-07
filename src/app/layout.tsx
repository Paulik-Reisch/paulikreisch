
import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';
import { CookieBanner } from '@/components/landing/cookie-banner';
import { ThemeProvider } from '@/components/theme-provider';
import { PremiumBanner } from '@/components/landing/premium-banner';

export const metadata: Metadata = {
  metadataBase: new URL('https://paulik-reisch.de'),
  title: {
    default: 'Paulik & Reisch | Satirische Literatur & humorvolle Bücher',
    template: '%s | Paulik & Reisch',
  },
  description: 'Die offiziellen Autorenwerke von Philipp Paulik & Maximilian Reisch. Satirische Bücher, absurde Kurzgeschichten und tiefgründiger Unsinn über Schule, Bürokratie und den alltäglichen Wahnsinn.',
  applicationName: 'Paulik & Reisch',
  authors: [{ name: 'Philipp Paulik' }, { name: 'Maximilian Reisch' }],
  keywords: ['Satire', 'Humor', 'Buch', 'Autoren', 'Paulik', 'Reisch', 'Hallo Welt', 'lustige Bücher', 'deutsche Autoren', 'Schulsatire'],
  openGraph: {
      title: 'Paulik & Reisch | Satirische Literatur',
      description: 'Die offiziellen Autorenwerke von Philipp Paulik & Maximilian Reisch. Satire über Schule, Bürokratie und den alltäglichen Wahnsinn.',
      url: 'https://paulik-reisch.de',
      siteName: 'Paulik & Reisch',
      locale: 'de_DE',
      type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Paulik & Reisch | Satire, die sitzt',
    description: 'Die offiziellen Autorenwerke von Paulik & Reisch. Satire, die den Wahnsinn des Alltags entlarvt.',
    creator: '@paulikreisch',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@700&family=Inter:wght@400;700&family=Patrick+Hand&display=swap" rel="stylesheet" />
        <meta name="theme-color" content="#F5C12C" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" href="/favicon-196x196.png" sizes="196x196" />
        <link rel="icon" type="image/png" href="/favicon-128x128.png" sizes="128x128" />
        <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/png" href="/favicon-32x32.png" sizes="32x32" />
        <link rel="icon" type="image/png" href="/favicon-16x16.png" sizes="16x16" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider attribute="class" defaultTheme="light">
          {children}
          <PremiumBanner />
          <Toaster />
          <CookieBanner />
        </ThemeProvider>
      </body>
    </html>
  );
}
