import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { AdminDashboard } from "@/components/admin/dashboard";
import { getLegalPages, getProducts, getNewsletters, getSubscribers } from "@/lib/firestore";
import { Button } from "@/components/ui/button";
import { logoutAction } from "./actions";
import { LogOut } from "lucide-react";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";


export default async function AdminPage() {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }

  // Fetch initial data on the server
  const initialProducts = await getProducts();
  const initialLegalPages = await getLegalPages();
  const initialNewsletters = await getNewsletters();
  const initialSubscribers = await getSubscribers();

  return (
    <div className="flex flex-col min-h-[100dvh] bg-background text-foreground">
      <Header />
      <main className="flex-1 py-12">
        <div className="container px-4 md:px-6">
            <div className="flex justify-between items-center mb-8">
              <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl">
                Admin-Dashboard
              </h1>
              <form action={logoutAction}>
                <Button variant="outline" type="submit">
                  <LogOut className="mr-2 h-4 w-4"/>
                  Abmelden
                </Button>
              </form>
            </div>
            <AdminDashboard 
              initialProducts={initialProducts}
              initialLegalPages={initialLegalPages}
              initialNewsletters={initialNewsletters}
              initialSubscribers={initialSubscribers}
            />
        </div>
      </main>
      <Footer />
    </div>
  );
}
