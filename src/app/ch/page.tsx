
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Book, Feather } from "lucide-react";

export default function ChineseLandingPage() {
  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: '#f5f3ef' }}>
      <header className="px-4 lg:px-6 h-14 flex items-center border-b" style={{ borderColor: 'rgba(206, 175, 127, 0.5)' }}>
        <a className="flex items-center justify-center" href="/">
          <span className="text-xl font-semibold" style={{ fontFamily: 'serif', color: '#5a4639' }}>你好世界</span>
        </a>
        <div className="ml-auto">
          <Link href="/buchhandlung-paulik-reisch">
            <Button size="sm" variant="ghost" style={{ color: '#8c6f5d', borderColor: '#d3c1a2' }} className="border hover:bg-black/5">
              購買書籍
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 relative">
           <div
            className="absolute inset-0 bg-no-repeat bg-center bg-cover opacity-10"
            style={{
              backgroundImage:
                "url('https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/chinese-bg.png?alt=media&token=81c3c978-a89b-449e-b7d5-d72b1449b49b')",
            }}
          />
          <div className="container px-4 md:px-6 relative z-10">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="flex flex-col justify-center space-y-4 text-center lg:text-left">
                <div className="space-y-4">
                  <h1
                    className="text-4xl font-bold tracking-tighter sm:text-6xl"
                    style={{ fontFamily: 'serif', color: '#402e26' }}
                  >
                    一部顛覆傳統的諷刺史詩
                  </h1>
                  <p className="max-w-[600px] text-lg mx-auto lg:mx-0" style={{ color: '#6b5b4e' }}>
                    歡迎來到《你好世界》。一場深入學校神秘深淵的文學之旅。一部關於官僚主義、僵化教育和日常瘋狂的辛辣喜劇。
                  </p>
                </div>
                 <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center lg:justify-start">
                    <Link href="/buchhandlung-paulik-reisch">
                        <Button size="lg" style={{ backgroundColor: '#8c6f5d', color: '#f5f3ef' }} className="hover:bg-[#a58878]">
                            <Book className="mr-2 h-5 w-5" />
                            立即購買
                        </Button>
                    </Link>
                </div>
              </div>
              <Image
                alt="Buchcover im chinesischen Stil"
                className="mx-auto overflow-hidden rounded-xl object-contain object-center sm:w-full lg:order-last transition-transform duration-500 hover:scale-105"
                height="550"
                src="https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/cover-mockup-ch.png?alt=media&token=e6b2164a-251f-49ae-a010-3843793e8783"
                width="550"
                data-ai-hint="book cover chinese style"
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="py-6 border-t" style={{ backgroundColor: '#ede9e4', borderColor: 'rgba(206, 175, 127, 0.5)' }}>
        <div className="container text-center text-sm" style={{ color: '#6b5b4e' }}>
          <p>© {new Date().getFullYear()} 保利克與賴施。版權所有。</p>
          <nav className="flex justify-center gap-4 mt-2">
            <Link href="/impressum" className="hover:underline">
              版本說明
            </Link>
            <Link href="/datenschutz" className="hover:underline">
              數據保護
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
