import type { ReactNode } from 'react';
import { AdminHeader } from './header';
import { AdminFooter } from './footer';
import './admin.css';

export function AdminShell({ children, showUploads = false }: { children: ReactNode; showUploads?: boolean }) {
  return <div className="admin-shell flex min-h-screen flex-col">
    <AdminHeader showUploads={showUploads} />
    <main className="admin-main flex-1">{children}</main>
    <AdminFooter />
  </div>;
}
