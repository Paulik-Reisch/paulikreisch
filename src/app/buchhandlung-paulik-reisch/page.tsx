
import { BookShopHeader } from "@/components/landing/book-shop-header";
import { Footer } from "@/components/landing/footer";
import { BookGrid } from "@/components/landing/book-grid";
import { BookShopHero } from "@/components/landing/book-shop-hero";
import { ShopNewsletter } from "@/components/landing/shop-newsletter";
import { Product } from "@/lib/firestore";
import { WhyBoth } from "@/components/landing/why-both";
import { ProductDescription } from "@/components/landing/ProductDescription";
import { APlusContent } from "@/components/landing/APlusContent";
import { BookMosaic } from "@/components/landing/BookMosaic";
import { AuthorInfo } from "@/components/landing/AuthorInfo";

const products: Product[] = [
    {
        id: "hw1",
        title: "Hallo Welt",
        subtitle: "Erhebliche Kritik am unerhörten Bildungsgang der Lernvollzugsanstalt SK-S",
        price: 10.99,
        imageSrc: "https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/cover-hw1.png?alt=media&token=a3c3cb2d-c367-4634-b2b1-944e497f144e",
        imageBackSrc: "https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/back-hw1-temp.png?alt=media&token=a859415e-bf5c-4688-ab60-a4c55dbe6cb1",
        aiHint: "book cover satire",
        amazonLink: "https://amzn.eu/d/0CdFeZ3",
        description: "Die satirische Abrechnung mit dem Schulsystem, Lehrern als Beamtenrobotern und dem täglichen Wahnsinn des Erwachsenwerdens."
    },
    {
        id: "hw2",
        title: "Hallo Welt 2",
        subtitle: "Wie das Leben funktioniert",
        price: 12.99,
        preorderPrice: 9.99,
        imageSrc: "https://placehold.co/300x450.png",
        imageBackSrc: "https://placehold.co/300x450/333/eee?text=R%C3%BCckseite+HW2",
        aiHint: "funny book cover",
        amazonLink: "#",
        description: "Die Fortsetzung, die niemand wollte. Eine Abrechnung mit Bürokratie, deutschem Internet und Mietenwahnsinn."
    }
];

export default async function BookShopPage() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-background text-foreground">
      <BookShopHeader />
      <main className="flex-1 flex flex-col items-center">
        <BookGrid initialProducts={products} />
        <BookShopHero />
        <WhyBoth />
        <ProductDescription />
        <APlusContent />
        <BookMosaic />
        <AuthorInfo />
        <ShopNewsletter />
      </main>
      <Footer />
    </div>
  );
}
