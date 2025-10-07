
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";

export default function LicensePage2() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-background text-foreground">
      <Header />
      <main className="flex-1 py-12 md:py-24">
        <div className="container px-4 md:px-6">
            <article className="prose dark:prose-invert mx-auto">
                <h1>Lizenzbedingungen</h1>
                
                <h2 className="font-headline">1. Software-Lizenz (MIT)</h2>
                <p>
                    Permission is hereby granted, free of charge, to any person obtaining a copy
                    of this software and associated documentation files (the "Software"), to deal
                    in the Software without restriction, including without limitation the rights
                    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
                    copies of the Software, and to permit persons to whom the Software is
                    furnished to do so, subject to the following conditions:
                </p>
                <p>
                    The above copyright notice and this permission notice shall be included in all
                    copies or substantial portions of the Software.
                </p>
                <p>
                    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
                    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
                    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
                    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
                    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
                    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
                    SOFTWARE.
                </p>

                <h2 className="font-headline mt-12">2. Inhalts-Lizenz (Creative Commons)</h2>
                <p>
                    Sofern nicht anders angegeben, unterliegen alle kreativen Inhalte auf dieser Webseite – einschließlich, aber nicht beschränkt auf Texte, Artikel, Blogbeiträge, Bilder, Illustrationen und satirische Werke – der Lizenz <a href="https://creativecommons.org/licenses/by-nc-nd/4.0/deed.de" target="_blank" rel="noopener noreferrer">Creative Commons Namensnennung-NichtKommerziell-KeineBearbeitung 4.0 International (CC BY-NC-ND 4.0)</a>.
                </p>
                <p>Das bedeutet, Sie dürfen die Inhalte unter den folgenden Bedingungen frei kopieren und weiterverbreiten:</p>
                <ul>
                    <li><strong>Namensnennung:</strong> Sie müssen angemessene Urheber- und Rechteangaben machen, einen Link zur Lizenz beifügen und angeben, ob Änderungen vorgenommen wurden.</li>
                    <li><strong>Nicht kommerziell:</strong> Sie dürfen das Material nicht für kommerzielle Zwecke nutzen.</li>
                    <li><strong>Keine Bearbeitungen:</strong> Wenn Sie das Material remixen, verändern oder anderweitig direkt darauf aufbauen, dürfen Sie die bearbeitete Fassung nicht verbreiten.</li>
                </ul>
                <p>
                    Jegliche Nutzung, die über den Geltungsbereich dieser Lizenz hinausgeht, bedarf der ausdrücklichen schriftlichen Genehmigung der Urheber (Paulik & Reisch).
                </p>
            </article>
        </div>
      </main>
      <Footer />
    </div>
  );
}
