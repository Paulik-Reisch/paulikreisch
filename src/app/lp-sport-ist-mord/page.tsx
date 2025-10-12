"use client";

import { useState } from 'react';
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { HeroSportIstMord } from "@/components/landing/hero-sport-ist-mord";
import { DeathDevices } from "@/components/landing/DeathDevices";
import { DodgeballGuide } from "@/components/landing/DodgeballGuide";
import { QuotesGallery } from "@/components/landing/QuotesGallery";
import { SportVerweigererQuiz } from "@/components/landing/SportVerweigererQuiz";

export default function SportIstMordPage() {
  const [isRevealed, setIsRevealed] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <HeroSportIstMord isRevealed={isRevealed} onReveal={() => setIsRevealed(true)} />
        {isRevealed && (
          <>
            <DeathDevices />
            <DodgeballGuide />
            <QuotesGallery />
            <SportVerweigererQuiz />
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
