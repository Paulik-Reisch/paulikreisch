
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { BookGrid } from "@/components/landing/book-grid";
import { BookShopHero } from "@/components/landing/book-shop-hero";
import { ShopNewsletter } from "@/components/landing/shop-newsletter";
import { Product } from "@/lib/firestore";
import { WhyBoth } from "@/components/landing/why-both";
import { ProductDescription } from "@/components/landing/ProductDescription";
import { BookMosaic } from "@/components/landing/BookMosaic";
import { Separator } from "@/components/ui/separator";

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
        imageSrc: "https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/cover-hw2-temp.png?alt=media&token=3b0a318c-e8c1-4e66-be02-858a7b365a44",
        imageBackSrc: "https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/back-hw2-temp.png?alt=media&token=1441421b-bcad-476b-89d0-117a86e5ffd1",
        aiHint: "funny book cover",
        amazonLink: "#",
        description: "Die Fortsetzung, die niemand wollte. Eine Abrechnung mit Bürokratie, deutschem Internet und Mietenwahnsinn."
    }
];

export default async function BookShopPage() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-background text-foreground">
      <Header />
      <main className="flex-1 flex flex-col items-center">
        <BookGrid initialProducts={products} />
        <Separator className="my-0 max-w-sm h-[2px] bg-border" />
        <BookShopHero />
        <WhyBoth />
        <ProductDescription />
        <BookMosaic />
        <ShopNewsletter />
      </main>
      <Footer />
    </div>
  );
}
