import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { AdminDashboard } from "@/components/admin/dashboard";
import { getLegalPages, getProducts, getNewsletters } from "@/lib/firestore";


export default async function AdminPage() {
  // Fetch initial data on the server
  const initialProducts = await getProducts();
  const initialLegalPages = await getLegalPages();
  const initialNewsletters = await getNewsletters();

  return (
    <div className="flex flex-col min-h-[100dvh] bg-background text-foreground">
      <Header />
      <main className="flex-1 py-12">
        <div className="container px-4 md:px-6">
            <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl mb-8">
              Admin-Dashboard
            </h1>
            <AdminDashboard 
              initialProducts={initialProducts}
              initialLegalPages={initialLegalPages}
              initialNewsletters={initialNewsletters}
            />
        </div>
      </main>
      <Footer />
    </div>
  );
}
