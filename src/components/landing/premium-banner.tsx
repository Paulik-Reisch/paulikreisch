import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function PremiumBanner() {
  return (
    <aside
      aria-label="Premium-Ankündigung"
      className="bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 text-white animate-in fade-in duration-500"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center p-3 text-center">
          <p className="text-sm font-medium">
            <span className="md:hidden">Die neue Premium-Erfahrung!</span>
            <span className="hidden md:inline">Paulik &amp; Reisch launchen die ultimative Premium-Erfahrung für Sie.</span>
            <Link
              href="https://premium.paulik-reisch.de/?utm-source=paulik-reisch.de&utm-medium=banner&utm-campaign=premium-launch"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-3 inline-block whitespace-nowrap font-bold underline transition-transform hover:scale-105"
            >
              Jetzt entdecken <ArrowRight className="inline h-4 w-4" />
            </Link>
          </p>
        </div>
      </div>
    </aside>
  );
}
