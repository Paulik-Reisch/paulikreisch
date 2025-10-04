import { SidebarProvider } from "@/components/ui/sidebar";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { InternalSidebar } from "@/components/internal/sidebar";

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
        <InternalSidebar />
        <main className="lg:pl-[16rem]">
            <div className="p-4 sm:p-6 lg:p-8">
                {children}
            </div>
        </main>
    </SidebarProvider>
  );
}
