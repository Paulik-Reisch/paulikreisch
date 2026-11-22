import UploadPage from '@/app/admin/upload/page';
import { StaticManagementView } from './static-management-view';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Static - Dateiverwaltung', robots: {index:false,follow:false}, alternates:{canonical:null} };
export default function Page(){ return <StaticManagementView><UploadPage /></StaticManagementView> }
