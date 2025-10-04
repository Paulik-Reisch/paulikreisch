
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
      <div className="flex h-screen w-full flex-col bg-muted/40">
        <InternalSidebar />
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
          <InternalHeader />
          <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 overflow-auto">
            {children}
          </main>
          <InternalFooter />
        </div>
      </div>
    </SidebarProvider>
  );
}
