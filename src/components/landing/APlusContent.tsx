import Image from "next/image";

export function APlusContent() {
    return (
        <section className="w-full py-12 md:py-24">
            <div className="container px-4 md:px-6">
                <Image 
                    src="https://picsum.photos/seed/aplus/1200/400"
                    alt="A+ Content Banner"
                    data-ai-hint="book advertisement"
                    width={1200}
                    height={400}
                    className="w-full rounded-lg shadow-lg"
                />
            </div>
        </section>
    )
}