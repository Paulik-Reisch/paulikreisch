
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Book, ChevronRight } from "lucide-react";

export default function ChineseLandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-neutral-50 text-neutral-800">
      <header className="px-4 lg:px-6 h-16 flex items-center sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto flex items-center justify-between">
            <Link className="flex items-center justify-center" href="/">
              <span className="text-xl font-bold">你好世界</span>
            </Link>
            <nav className="hidden md:flex gap-4">
                 <Link href="/" className="text-sm font-medium hover:underline underline-offset-4">
                    首頁
                </Link>
                <Link href="/lp-series" className="text-sm font-medium hover:underline underline-offset-4">
                    書籍系列
                </Link>
            </nav>
            <Link href="/buchhandlung-paulik-reisch">
                <Button size="sm">
                  購買書籍
                </Button>
            </Link>
        </div>
      </header>

      <main className="flex-1">
        <section className="w-full py-20 md:py-32 lg:py-40">
          <div className="container px-4 md:px-6">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-16 items-center">
              <div className="flex flex-col justify-center space-y-6">
                <div className="space-y-4">
                  <h1
                    className="text-4xl font-bold tracking-tight sm:text-5xl xl:text-6xl/none text-balance"
                  >
                    一部顛覆傳統的諷刺史詩
                  </h1>
                  <p className="max-w-[600px] text-neutral-600 md:text-xl text-balance">
                    歡迎來到《你好世界》。一場深入學校神秘深淵的文學之旅。一部關於官僚主義、僵化教育和日常瘋狂的辛辣喜劇。
                  </p>
                </div>
                 <div className="flex flex-col gap-2 min-[400px]:flex-row">
                    <Link href="/buchhandlung-paulik-reisch">
                        <Button size="lg">
                            <Book className="mr-2 h-5 w-5" />
                            立即購買
                        </Button>
                    </Link>
                </div>
              </div>
               <div className="relative group">
                    <Image
                        alt="書籍封面模型"
                        className="mx-auto overflow-hidden rounded-xl object-contain object-center sm:w-full transition-transform duration-500 group-hover:scale-105"
                        height="550"
                        src="https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/cover-mockup-ch.png?alt=media&token=e6b2164a-251f-49ae-a010-3843793e8783"
                        width="550"
                        data-ai-hint="book cover chinese style"
                    />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 border-t bg-neutral-100">
        <div className="container text-center text-sm text-neutral-500">
          <p>© {new Date().getFullYear()} Paulik & Reisch. 版權所有。</p>
          <nav className="flex justify-center gap-4 mt-4">
            <Link href="/impressum" className="hover:underline hover:text-neutral-900">
              版本說明
            </Link>
            <Link href="/datenschutz" className="hover:underline hover:text-neutral-900">
              數據保護
            </Link>
             <Link href="/agb" className="hover:underline hover:text-neutral-900">
              服務條款
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
