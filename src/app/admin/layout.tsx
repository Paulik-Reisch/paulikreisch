// Admin pages read live data and must never be prerendered at build time.
// Without this, next build runs the page loaders (e.g. the analytics query) before
// the session check bails out to dynamic rendering, which causes Firestore reads on every build.
export const dynamic = "force-dynamic";


import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { AdminHeader } from "./header";
import { Footer } from "@/components/landing/footer";

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
    <div className="flex flex-col min-h-screen">
      <AdminHeader />
      <main className="flex-1 container py-8 md:py-12">{children}</main>
      <Footer />
    </div>
  );
}
