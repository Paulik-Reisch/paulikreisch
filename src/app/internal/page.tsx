import { InternalDashboard } from "@/components/internal/dashboard";
import { redirect } from "next/navigation";

export default async function InternalPage() {
  // The root /internal page just redirects to the main dashboard.
  redirect("/internal/isdm/dashboard");
}
