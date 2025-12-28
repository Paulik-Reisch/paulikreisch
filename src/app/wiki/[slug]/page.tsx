
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { ImageWithLoader as Image } from "@/components/ui/image-with-loader";
import { Badge } from "@/components/ui/badge";
import { notFound }s from "next/navigation";

// In a real application, you would fetch this data from an API based on the slug.
// e.g., from the Wikipedia API
const articles: { [key: string]: any } = {
  satire: {
    title: "Satire",
    summary:
      "Die Satire ist eine Kunstform, mit der Personen, Ereignisse oder Zustände kritisiert, verspottet oder angeprangert werden. Sie bedient sich dazu der Übertreibung, der Ironie und des Spotts.",
    image: {
      src: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Gulliver_in_Brobdingnag.jpg/800px-Gulliver_in_Brobdingnag.jpg",
      alt: "Gulliver in Brobdingnag, eine klassische satirische Darstellung.",
      caption: "Gulliver wird vom Bauern in Brobdingnag dem König vorgeführt (Stich von James Gillray, 1803).",
    },
    content: `
      <p>Der Begriff Satire leitet sich vom lateinischen <i>satura lanx</i> ab, was so viel wie „mit Früchten gefüllte Schale“ bedeutet. Dies deutet auf die bunte Vielfalt der in der Satire behandelten Themen und Stile hin.</p>
      <h2>Merkmale der Satire</h2>
      <p>Typische Stilmittel der Satire sind:</p>
      <ul>
        <li><strong>Übertreibung (Hyperbel):</strong> Sachverhalte werden stark überzeichnet, um sie der Lächerlichkeit preiszugeben.</li>
        <li><strong>Ironie:</strong> Das Gegenteil des Gesagten ist gemeint.</li>
        <li><strong>Spott und Hohn:</strong> Direkte Herabwürdigung des kritisierten Objekts.</li>
        <li><strong>Verfremdung:</strong> Bekanntes wird in einen neuen, ungewöhnlichen Kontext gestellt, um Absurditäten aufzuzeigen.</li>
      </ul>
      <p>Das Ziel der Satire ist nicht nur die reine Unterhaltung, sondern oft auch die Anregung zum Nachdenken und zur Kritik an gesellschaftlichen Missständen. In diesem Sinne ist sie eng mit der Gesellschaftskritik verwandt.</p>
      <h2>Satire in der Literatur</h2>
      <p>Berühmte Beispiele für literarische Satiren sind Jonathan Swifts "Gullivers Reisen", Voltaires "Candide oder der Optimismus" oder in der deutschen Literatur Kurt Tucholsky. Die Autoren von "Hallo Welt" sehen sich in dieser stolzen Tradition des intelligenten Spotts.</p>
    `,
  },
};

export default function WikiPage({ params }: { params: { slug: string } }) {
  const article = articles[params.slug];

  if (!article) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 py-12 md:py-16">
        <div className="container max-w-4xl mx-auto px-4">
          <article>
            <header className="mb-8">
              <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight mb-2">
                {article.title}
              </h1>
              <p className="text-lg text-muted-foreground">{article.summary}</p>
            </header>

            <figure className="my-8">
              <Image
                src={article.image.src}
                alt={article.image.alt}
                width={800}
                height={450}
                className="rounded-lg shadow-md mx-auto"
              />
              <figcaption className="text-center text-xs text-muted-foreground mt-2">
                {article.image.caption}
              </figcaption>
            </figure>

            <div
              className="prose dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
}
