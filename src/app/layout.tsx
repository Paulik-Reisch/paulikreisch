
import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';
import { CookieBanner } from '@/components/landing/cookie-banner';
import { CustomCursor } from '@/components/ui/custom-cursor';

export const metadata: Metadata = {
  title: 'Hallo Welt - Paulik & Reisch',
  description: 'Die offizielle Seite zum Buch von Paulik & Reisch, gefüllt mit Satire und Humor.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@700&family=Inter:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <CustomCursor />
        {children}
        <Toaster />
        <CookieBanner />
      </body>
    </html>
  );
}
