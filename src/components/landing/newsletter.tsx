import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Newsletter() {
  return (
    <section id="newsletter" className="w-full py-12 md:py-24 lg:py-32" style={{ backgroundColor: 'hsl(var(--color-bg-light-pink))' }}>
      <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
        <div className="space-y-3">
          <h2 className="text-3xl font-bold font-headline tracking-tighter md:text-4xl">Treten Sie der Gemeinschaft der Verwirrten bei</h2>
          <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed text-balance">
            Erhalten Sie exklusive Inhalte, Updates und weitere fragwürdige Lebensratschläge direkt in Ihren Posteingang. Wir versprechen, Sie nicht zuzuspammen. Kaum.
          </p>
        </div>
        <div className="mx-auto w-full max-w-sm space-y-2">
          <form className="flex space-x-2">
            <Input className="max-w-lg flex-1" placeholder="Ihre E-Mail-Adresse eingeben" type="email" />
            <Button type="submit">Abonnieren</Button>
          </form>
          <p className="text-xs text-muted-foreground">
            Melden Sie sich an, um benachrichtigt zu werden, wenn wir etwas Neues veröffentlichen. Wir werden Ihre E-Mail niemals weitergeben. Wahrscheinlich.
          </p>
        </div>
      </div>
    </section>
  );
}
