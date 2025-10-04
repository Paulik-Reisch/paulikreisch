

import { SidebarProvider, Sidebar, SidebarRail, SidebarInset } from "@/components/ui/sidebar";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { InternalSidebar } from "@/components/internal/sidebar";
import { InternalHeader } from "@/components/internal/header";
import { InternalFooter } from "@/components/internal/footer";

export default async function InternalLayout({
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
      <div className="internal-dashboard bg-gray-100 dark:bg-gray-900">
        <InternalSidebar />
        <SidebarRail />
        <SidebarInset>
            <InternalHeader />
            <main className="flex-1 p-4 sm:px-6 sm:py-4">
                {children}
            </main>
            <InternalFooter />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
