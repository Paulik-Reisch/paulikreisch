import UploadPage from '@/app/admin/upload/page';
import { LogoutButton } from '@/app/admin/logout-button';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Static - Dateiverwaltung', robots: {index:false,follow:false}, alternates:{canonical:null} };
export default function Page(){ return <div className="internal-dashboard min-h-screen"><header className="border-b px-5 py-4 flex items-center justify-between"><h1 className="text-xl font-semibold">Static - Dateiverwaltung</h1><LogoutButton/></header><main className="container mx-auto py-8 px-4"><UploadPage/></main></div> }
