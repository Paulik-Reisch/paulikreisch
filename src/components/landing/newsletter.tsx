import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Newsletter() {
  return (
    <section id="newsletter" className="w-full py-12 md:py-24 lg:py-32" style={{ backgroundColor: 'hsl(var(--color-bg-light-pink))' }}>
      <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
        <div className="space-y-3">
          <h2 className="text-3xl font-bold font-headline tracking-tighter md:text-4xl">Join the Community of the Confused</h2>
          <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed text-balance">
            Get exclusive content, updates, and more questionable life advice delivered straight to your inbox. We promise not to spam you. Much.
          </p>
        </div>
        <div className="mx-auto w-full max-w-sm space-y-2">
          <form className="flex space-x-2">
            <Input className="max-w-lg flex-1" placeholder="Enter your email" type="email" />
            <Button type="submit">Subscribe</Button>
          </form>
          <p className="text-xs text-muted-foreground">
            Sign up to get notified when we release new stuff. We'll never share your email. Probably.
          </p>
        </div>
      </div>
    </section>
  );
}
