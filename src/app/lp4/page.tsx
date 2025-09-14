import { Header } from "@/components/landing/header";
import { HeroLP4 } from "@/components/landing/hero-lp4";
import { ChapterWriter } from "@/components/landing/chapter-writer";
import { SocialShare } from "@/components/landing/social-share";
import { CtaBanner } from "@/components/landing/cta-banner";
import { Footer } from "@/components/landing/footer";

export default function LP4() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-background text-foreground overflow-x-hidden">
      <Header />
      <main className="flex-1">
        <HeroLP4 />
        <ChapterWriter />
        <SocialShare shareUrlPath="/lp4"/>
        <CtaBanner />
      </main>
      <Footer />
    </div>
  );
}
