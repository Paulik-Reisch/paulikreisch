import { Button } from "@/components/ui/button";
import { refreshWorthaftWordListsAction } from "./actions";

export default async function AdminWorthaftPage({
  searchParams,
}: {
  searchParams: Promise<{ refreshed?: string }>;
}) {
  const { refreshed } = await searchParams;

  return (
    <div className="max-w-xl space-y-4">
      <h1 className="text-3xl font-bold font-headline tracking-tighter">Worthaft-Wortlisten</h1>
      <p className="text-muted-foreground">
        Die Wortlisten werden bis zu 7 Tage zwischengespeichert. Nach einer Änderung in der Firebase-Konsole hier neu
        laden. Das heutige Wort bleibt dabei bis zum nächsten Neustart des Servers unverändert.
      </p>
      <form action={refreshWorthaftWordListsAction}>
        <Button type="submit">Wortlisten neu laden</Button>
      </form>
      {refreshed ? (
        <p role="status" className="text-sm">
          Der Zwischenspeicher wurde geleert. Die nächste Spielseite liest die Listen neu.
        </p>
      ) : null}
    </div>
  );
}
