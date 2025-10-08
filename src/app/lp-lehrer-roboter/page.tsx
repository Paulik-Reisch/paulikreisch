import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { HeroLehrerRoboter } from "@/components/landing/hero-lehrer-roboter";
import { TeacherBugs } from "@/components/landing/teacher-bugs";
import { TeacherEnergyLevel } from "@/components/landing/teacher-energy-level";
import { CoffeeCompatibility } from "@/components/landing/coffee-compatibility";

export default function LehrerRoboterPage() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <HeroLehrerRoboter />
        <TeacherBugs />
        <TeacherEnergyLevel />
        <CoffeeCompatibility />
      </main>
      <Footer />
    </div>
  );
}
