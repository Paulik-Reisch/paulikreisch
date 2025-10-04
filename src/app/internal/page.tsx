import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { Button } from "@/components/ui/button";
import { logoutAction } from "../admin/actions";
import { LogOut, DatabaseZap } from "lucide-react";

export default async function InternalPage() {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="flex flex-col min-h-[100dvh] bg-background text-foreground">
      <Header />
      <main className="flex-1 py-12">
        <div className="container px-4 md:px-6">
            <div className="flex justify-between items-center mb-8">
              <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl">
                Internal Management
              </h1>
              <form action={logoutAction}>
                <Button variant="outline" type="submit">
                  <LogOut className="mr-2 h-4 w-4"/>
                  Abmelden
                </Button>
              </form>
            </div>
            <div className="border-2 border-dashed rounded-lg p-12 text-center">
              <DatabaseZap className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h2 className="text-2xl font-bold">Datenbank & Storage Management</h2>
              <p className="text-muted-foreground mt-2">
                Dieses Interface dient der Verwaltung von Datenbankregeln und Frontend-Speicher.
              </p>
            </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
