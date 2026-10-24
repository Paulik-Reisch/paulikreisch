import { LegalPage } from "@/components/landing/legal-page";

export const metadata = {
  title: "Transparenzhinweise – Paulik & Reisch",
  description: "Kennzeichnung KI-generierter Inhalte gemäß Art. 50 EU AI Act.",
};

export default function TransparenzPage() {
  return (
    <LegalPage title="Transparenzhinweise" description="Hinweise zur Kennzeichnung KI-generierter und KI-unterstützter Inhalte gemäß Art. 50 der EU-KI-Verordnung.">
            <p className="text-sm text-muted-foreground">
              Gemäß Art. 50 der Verordnung (EU) 2024/1689 (KI-Verordnung / AI Act)
            </p>

            <h2>1. Geltungsbereich und Rechtsnatur</h2>
            <p>
              Die nachfolgenden Hinweise erfolgen im Bewusstsein der Transparenzpflichten gemäß Art. 50 der
              Verordnung (EU) 2024/1689 („KI-Verordnung") sowie des hierzu ergangenen Verhaltenskodex zur
              Kennzeichnung KI-generierter Inhalte. Sie dienen dem Zweck, natürlichen Personen die Einordnung
              und Herkunft der auf diesem Angebot bereitgestellten Inhalte zu ermöglichen.
            </p>

            <h2>2. KI-generierte und KI-unterstützte Inhalte</h2>
            <p>
              Die auf diesem Angebot veröffentlichten satirischen Beiträge, literarischen Texte sowie
              illustrativen und/oder audiovisuellen Darstellungen können ganz oder teilweise mittels Systemen
              künstlicher Intelligenz erzeugt, bearbeitet oder wesentlich beeinflusst worden sein. Sofern
              derartige Inhalte — insbesondere solche mit Bezug zu realen Personen, Objekten, Orten, Entitäten
              oder Ereignissen — geeignet sind, als authentisch erschcheinend wahrgenommen zu werden, werden
              dieselben als künstlichen Ursprungs gekennzeichnet.
            </p>

            <h2>3. Maschinenlesbare Kennzeichnung</h2>
            <p>
              Im Rahmen des technisch Machbaren bemühen wir uns, synthetische Inhalte zusätzlich in einem
              maschinenlesbaren Format als KI-erzeugt zu kennzeichnen (Art. 50 Abs. 2 KI-Verordnung).
            </p>

            <h2>4. Interaktion mit KI-Systemen</h2>
            <p>
              Sofern auf diesem Angebot interaktive KI-Systeme zum Einsatz gelangen, werden Nutzer darüber
              informiert, dass sie mit einem System künstlicher Intelligenz interagieren (Art. 50 Abs. 3
              KI-Verordnung).
            </p>

            <h2>5. Redaktionelle Verantwortung und Ausnahmen</h2>
            <p>
              Bei offensichtlich künstlerischen, kreativen, satirischen oder fiktionalen Werken beschränken
              sich die Transparenzpflichten auf eine Offenlegung in geeigneter Weise, die die Darstellung nicht
              behindert (Art. 50 Abs. 4 Satz 4 KI-Verordnung). Sämtliche Beiträge verfolgen ausschließlich
              einen satirischen, unterhaltsamen Zweck und haben nicht zum Ziel, Personen oder
              Institutionen zu diffamieren.
            </p>

            <h2>6. Weitere Hinweise</h2>
            <p>
              Die satirische &quot;Hallo Welt&quot;-Bücherserie ist eine Idee und Kreation von Philipp Paulik
              (Autor), Maximilian Reisch (Autor), Luin Schiffbauer (Illustrator) und weiteren Mitwirkenden.
              Veröffentlicht und produziert durch Kindle Direct Publishing (KDP) der Amazon Distribution GmbH,
              Leipzig sowie ggf. weiteren Verlags- und Produktionspartnern.
            </p>
    </LegalPage>
  );
}
