import type { ReactNode } from 'react';
import { LogoutButton } from '@/app/admin/logout-button';
export function StaticManagementView({ children }: { children: ReactNode }) {
  return <div className="min-h-screen"><header className="border-b px-4 py-4 flex flex-wrap items-center justify-between gap-3 sm:px-6"><h1 className="text-xl font-semibold">Static - Dateiverwaltung</h1><LogoutButton /></header><main className="admin-main">{children}</main></div>;
}
