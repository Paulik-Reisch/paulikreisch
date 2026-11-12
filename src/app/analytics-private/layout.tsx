import type { Metadata } from 'next';
export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Analytics | Paulik & Reisch', robots: {index:false,follow:false},alternates:{canonical:null} };
export default function AnalyticsLayout({children}:{children:React.ReactNode}) {return <>{children}</>;}
