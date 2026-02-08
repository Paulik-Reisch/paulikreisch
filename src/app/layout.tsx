
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';
import { CookieBanner } from '@/components/landing/cookie-banner';
import { ThemeProvider } from '@/components/theme-provider';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { GlobalTracker } from '@/components/analytics/global-tracker';

export const metadata: Metadata = {
  metadataBase: new URL('https://paulik-reisch.de'),
  title: {
    default: 'Paiúlik & Reisch | Premium Humor und Satire',
    template: '%s | Paiúlik & Reisch',
  },
  description: 'Premium Humor und Satire',
  applicationName: 'Paiúlik & Reisch',
  authors: [{ name: 'Philipp Paulik' }, { name: 'Maximilian Reisch' }],
  keywords: ['Satire', 'Humor', 'Buch', 'Autoren', 'Paulik', 'Reisch', 'Hallo Welt', 'lustige Bücher', 'deutsche Autoren', 'Schulsatire', 'Premium Satire'],
  openGraph: {
      title: 'Paiúlik & Reisch',
      description: 'Premium Humor und Satire',
      url: 'https://paulik-reisch.de',
      siteName: 'Paiúlik & Reisch',
      locale: 'de_DE',
      type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Paiúlik & Reisch | Premium Humor und Satire',
    description: 'Entdecken Sie Premium Humor und Satire von Paiúlik & Reisch.',
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
        <meta name="theme-color" content="#FFFFFF" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" href="/favicon-196x196.png" sizes="196x196" />
        <link rel="icon" type="image/png" href="/favicon-128x128.png" sizes="128x128" />
        <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/png" href="/favicon-32x32.png" sizes="32x32" />
        <link rel="icon" type="image/png" href="/favicon-16x16.png" sizes="16x16" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon-180x180.png" />
        <link rel="apple-touch-icon" sizes="192x192" href="/apple-touch-icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="57x57" href="/apple-touch-icon-57x57.png" />
        <link rel="apple-touch-icon" sizes="60x60" href="/apple-touch-icon-60x60.png" />
        <link rel="apple-touch-icon" sizes="72x72" href="/apple-touch-icon-72x72.png" />
        <link rel="apple-touch-icon" sizes="76x76" href="/apple-touch-icon-76x76.png" />
        <link rel="apple-touch-icon" sizes="114x114" href="/apple-touch-icon-114x114.png" />
        <link rel="apple-touch-icon" sizes="120x120" href="/apple-touch-icon-120x120.png" />
        <link rel="apple-touch-icon" sizes="144x144" href="/apple-touch-icon-144x144.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/apple-touch-icon-152x152.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className="font-body antialiased">
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
