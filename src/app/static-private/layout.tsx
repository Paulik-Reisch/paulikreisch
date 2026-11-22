import type { ReactNode } from 'react';
import '../admin/admin.css';

export default function StaticManagementLayout({ children }: { children: ReactNode }) {
  return <div className="admin-shell">{children}</div>;
}
