
"use client";

import { useSearchParams } from 'next/navigation';
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";

function ChiquitoName() {
  const searchParams = useSearchParams();
  const p = searchParams.get('p');

  let name;
  if (p === '1') {
    name = 'max';
  } else if (p === '2') {
    name = 'Philipp';
  } else {
    name = 'nadie es';
  }

  return (
    <h1 className="font-headline text-9xl md:text-[12rem] lg:text-[15rem] font-extrabold tracking-tighter text-center text-black">
      {name} el tonto
    </h1>
  );
}

export default function FelipeElChiquitoPage() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-background text-foreground">
      <Header />
      <main className="flex-1 flex items-center justify-center">
        <ChiquitoName />
      </main>
      <Footer />
    </div>
  );
}

