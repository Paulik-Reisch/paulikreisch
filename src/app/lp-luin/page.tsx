import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { HeroLuin } from "@/components/landing/hero-luin";

export default function LuinPage() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <HeroLuin />
      </main>
      <Footer />
    </div>
  );
}
