
import { BookShopHeader } from "@/components/landing/book-shop-header";
import { Footer } from "@/components/landing/footer";
import { BookShop } from "@/components/landing/book-shop";
import { BookShopHero } from "@/components/landing/book-shop-hero";
import { Product } from "@/lib/firestore";

const products: Product[] = [
    {
        id: "hw1",
        title: "Hallo Welt",
        subtitle: "Erhebliche Kritik am unerhörten Bildungsgang der Lernvollzugsanstalt SK-S",
        price: 10.99,
        imageSrc: "https://m.media-amazon.com/images/I/61hB6jTD-CL._SY466_.jpg",
        aiHint: "book cover satire",
        amazonLink: "https://www.amazon.de/Hallo-Welt-unerh%C3%B6rten-Bildungsgang-Lernvollzugsanstalt/dp/3982548803",
        description: "Die satirische Abrechnung mit dem Schulsystem, Lehrern als Beamtenrobotern und dem täglichen Wahnsinn des Erwachsenwerdens."
    },
    {
        id: "hw2",
        title: "Hallo Welt 2",
        subtitle: "Wie das Leben funktioniert",
        price: 12.99,
        preorderPrice: 9.99,
        imageSrc: "https://placehold.co/300x450.png",
        aiHint: "funny book cover",
        amazonLink: "#",
        description: "Die Fortsetzung, die niemand wollte. Eine Abrechnung mit Bürokratie, deutschem Internet und Mietenwahnsinn."
    }
];

export default async function BookShopPage() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-background text-foreground">
      <BookShopHeader />
      <main className="flex-1">
        <BookShopHero />
        <BookShop initialProducts={products} />
      </main>
      <Footer />
    </div>
  );
}
