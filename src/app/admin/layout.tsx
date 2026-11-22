// Admin pages read live data and must never be prerendered at build time.
// Without this, next build runs the page loaders (e.g. the analytics query) before
// the session check bails out to dynamic rendering, which causes Firestore reads on every build.
export const dynamic = "force-dynamic";


import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { AdminShell } from "./shell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
  alternates: { canonical: null },
};

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
    <AdminShell showUploads={process.env.PRIVATE_ASSET_RELEASE==='private-prefix-v1-accepted'}>{children}</AdminShell>
  );
}
