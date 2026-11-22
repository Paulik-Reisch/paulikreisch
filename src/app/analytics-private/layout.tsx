import type { Metadata } from 'next';
import '../admin/admin.css';
export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Analytics | Paulik & Reisch', robots: {index:false,follow:false},alternates:{canonical:null} };
export default function AnalyticsLayout({children}:{children:React.ReactNode}) {return <div className="admin-shell">{children}</div>;}
