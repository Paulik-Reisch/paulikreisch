
import { SidebarProvider } from "@/components/ui/sidebar";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { AdminSidebar } from "./sidebar";
import { AdminHeader } from "./header";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  return (
    <SidebarProvider>
      <div className="internal-dashboard flex flex-col h-screen overflow-hidden">
        <AdminHeader />
        <div className="wrapper flex flex-1 overflow-hidden">
          <AdminSidebar />
          <main className="main flex-1 overflow-y-auto p-6">
              {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
