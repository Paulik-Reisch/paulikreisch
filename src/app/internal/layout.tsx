
import { SidebarProvider } from "@/components/ui/sidebar";
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
    redirect("/admin/login");
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-muted/40">
        <InternalSidebar />
        <div className="flex flex-col flex-1 overflow-y-auto">
          <InternalHeader />
          <main className="flex-1 p-4 sm:px-6 sm:py-4">
            {children}
          </main>
          <InternalFooter />
        </div>
      </div>
    </SidebarProvider>
  );
}
