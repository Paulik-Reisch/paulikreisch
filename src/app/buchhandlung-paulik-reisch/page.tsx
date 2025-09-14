import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { BookShop } from "@/components/landing/book-shop";

export default function BookShopPage() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <BookShop />
      </main>
      <Footer />
    </div>
  );
}
