"use client";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const vocabulary = [
    { de: "Fotze", es: "el coño" },
    { de: "Arsch", es: "el culo" },
    { de: "Dummkopf", es: "el tonto" },
    { de: "Arschloch", es: "el cabrón" },
    { de: "Mistkerl", es: "el gilipollas" },
    { de: "Arschkriecher", es: "el lameculos" },
    { de: "Schwuchtel", es: "el maricón" },
    { de: "Hure", es: "la puta" },
    { de: "Hurensohn", es: "el hijo de puta" },
    { de: "verdammt", es: "maldito" },
    { de: "ficken", es: "follar" },
    { de: "gefickt", es: "follado" },
    { de: "Scheiße", es: "la mierda" },
    { de: "Alter", es: "el tío" },
    { de: "Idiot", es: "el idiota" },
    { de: "Trottel", es: "el imbécil" },
    { de: "Wichser", es: "el pendejo" },
    { de: "Feigling", es: "el cobarde" },
    { de: "Bastard", es: "el capullo" },
    { de: "Schwanzlutscher", es: "el chupapollas" },
    { de: "behindert", es: "discapacitado" },
    { de: "ekelhaft", es: "asqueroso" },
    { de: "Streber", es: "el empollón" },
    { de: "Schlampe", es: "la zorra" },
    { de: "Lümmel", es: "el patán" },
    { de: "dumme Kuh", es: "la vaca ignorante" },
    { de: "Clown", es: "el payaso" },
    { de: "Nutte", es: "la ramera" },
    { de: "Kanake", es: "el sudaca" },
    { de: "Schnarchsack", es: "el roncador" },
    { de: "Stinkstiefel", es: "el apestoso" },
    { de: "Zigeuner", es: "el gitano" },
    { de: "Schlawiner", es: "el pillo" },
    { de: "Lesbe", es: "la lesbiana" },
    { de: "Missgeburt", es: "la monsquerta" },
    { de: "Kumpel", es: "el güey" },
    { de: "Fettsack", es: "el barrigón" },
    { de: "Hurenbock", es: "el putero" },
    { de: "Kotzbrocken", es: "el tipo asqueroso" },
    { de: "Blödmann", es: "el estúpido" },
    { de: "Rotzlöffel", es: "el mocoso" },
    { de: "Affe", es: "el mono" },
    { de: "Luder", es: "la pícara" },
    { de: "Drecksack", es: "el guache" },
    { de: "Hexe", es: "la bruja" },
    { de: "Nichtsnutz", es: "el ablandahígos" },
    { de: "Schwachkopf", es: "el tarado" },
    { de: "Hodenkobold", es: "el duende de los testículos" },
    { de: "Schurke", es: "el malnacido" },
    { de: "Zwitter", es: "el hermafrodita" },
    { de: "Köter", es: "el chucho" },
    { de: "Schleimscheißer", es: "el ñoño" },
    { de: "Ficker", es: "el chingón" },
    { de: "Vielfraß", es: "el tragón" },
    { de: "Tölpel", es: "el papanatas" },
    { de: "Knirps", es: "el renacuajo" },
    { de: "Weichei", es: "el blandengue" },
    { de: "Miststück", es: "el canallas" },
    { de: "verfickt", es: "pinche" },
    { de: "lutschen", es: "chupar" },
    { de: "hässlich", es: "feo" },
    { de: "verrückt", es: "loco" },
    { de: "Penner", es: "el vagabundo" },
    { de: "schmutzig", es: "sucio" },
    { de: "fett", es: "gordo" },
    { de: "Schweinehund", es: "el hijo de perra" },
    { de: "Pechvogel", es: "el gafe" },
    { de: "Hinterwäldler", es: "el paleto" },
    { de: "Klugscheißer", es: "el listillo" },
    { de: "Schwätzer", es: "el bocachancla" },
    { de: "hirnlos", es: "descerebrado" },
    { de: "Fresser", es: "el zampabollos" },
    { de: "Holzkopf", es: "el cafre" },
    { de: "Dieb", es: "el ladrón" },
    { de: "Schmarotzer", es: "el gorrón" },
];

export function Palabrotas() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-6 text-center">
            <Badge>Pfeifer's Vermächtnis</Badge>
            <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-6xl xl:text-8xl/none text-balance">
              Die ultimative "Palabrotas"-Liste
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl text-balance">
              Ein essenzieller Wortschatz für den modernen Weltbürger. Präsentiert von der R. Pfeifer Akademie für angewandte Linguistik und zwischenmenschliche Eskalation.
            </p>
        </div>

        <div className="max-w-4xl mx-auto mt-12">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold text-lg">Deutsch</TableHead>
                <TableHead className="font-semibold text-lg">Spanisch</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vocabulary.map((word) => (
                <TableRow key={word.de}>
                  <TableCell className="font-medium text-base">{word.de}</TableCell>
                  <TableCell className="italic text-base">{word.es}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
           <p className="text-xs text-center text-muted-foreground mt-4">*Haftungsausschluss: Die Autoren übernehmen keine Verantwortung für daraus resultierende soziale oder diplomatische Verwicklungen.</p>
        </div>
      </div>
    </section>
  );
}
