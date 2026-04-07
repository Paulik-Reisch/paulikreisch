import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Worthaft – Paulik & Reisch Satire',
  description: 'Eine billige Kopie von Wordle? Ja, vermutlich ist es das ...',
  applicationName: 'Worthaft – Paulik & Reisch Satire',
  themeColor: '#686868',
  viewport: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no',
  openGraph: {
    title: 'Worthaft – Paulik & Reisch Satire',
    description: 'Eine billige Kopie von Wordle? Ja, vermutlich ist es das ... Warum? Man kann nie genug Worthaft spielen!',
  },
  icons: {
    icon: '/worthaft_favicon.ico',
  },
};

export default function WorthaftLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
