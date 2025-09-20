import { BookShopHeader } from "@/components/landing/book-shop-header";
import { Footer } from "@/components/landing/footer";
import { BookShop } from "@/components/landing/book-shop";
import { BookShopHero } from "@/components/landing/book-shop-hero";

export default function BookShopPage() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-background text-foreground">
      <BookShopHeader />
      <main className="flex-1">
        <BookShopHero />
        <BookShop />
      </main>
      <Footer />
    </div>
  );
}
