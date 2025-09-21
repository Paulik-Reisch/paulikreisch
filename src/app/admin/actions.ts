
"use server";

import { z } from "zod";
import {
  addProduct,
  updateProduct,
  deleteProduct,
  addLegalPage,
  updateLegalPage,
  deleteLegalPage,
  Product,
  addNewsletter,
  updateNewsletter,
  deleteNewsletter,
} from "@/lib/firestore";
import { revalidatePath } from "next/cache";
import { correctHtml } from "@/ai/flows/correct-html-flow";

// Products
const ProductSchema = z.object({
  title: z.string().min(1, "Titel ist erforderlich."),
  subtitle: z.string().optional(),
  price: z.coerce.number().min(0, "Preis muss positiv sein."),
  preorderPrice: z.coerce.number().optional(),
  amazonLink: z.string().url("Gültige URL erforderlich."),
  imageSrc: z.string().url("Gültige URL erforderlich."),
  aiHint: z.string().optional(),
  description: z.string().optional(),
});

export type AdminProductState = {
  success: boolean;
  error: string | null;
  message?: string;
};

const initialProductState: AdminProductState = { success: false, error: null };

export async function addProductAction(
  prevState: AdminProductState,
  formData: FormData
): Promise<AdminProductState> {
  const validatedFields = ProductSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    const errorMessages = validatedFields.error.errors.map((e) => e.message).join(". ");
    return { success: false, error: errorMessages };
  }

  try {
    await addProduct(validatedFields.data);
    revalidatePath("/admin");
    revalidatePath("/buchhandlung-paulik-reisch");
    return { success: true, message: "Produkt erfolgreich hinzugefügt." };
  } catch (e) {
    const error = e as Error;
    return { success: false, error: error.message };
  }
}

export async function updateProductAction(
  prevState: AdminProductState,
  formData: FormData
): Promise<AdminProductState> {
  const productId = formData.get("productId") as string;
  const productDataString = formData.get("productData") as string;

  if (!productId || !productDataString) {
    return { success: false, error: "Produkt-ID oder Daten fehlen." };
  }
  
  try {
    const productData = JSON.parse(productDataString);
    await updateProduct(productId, productData);
    revalidatePath("/admin");
    revalidatePath("/buchhandlung-paulik-reisch");
    return { success: true, message: "Produkt erfolgreich aktualisiert." };
  } catch (e) {
    const error = e as Error;
    return { success: false, error: "Fehler beim Aktualisieren: " + error.message };
  }
}

const DeleteProductSchema = z.object({
  productId: z.string(),
});

export async function deleteProductAction(
  prevState: AdminProductState,
  formData: FormData
): Promise<AdminProductState> {
  const validatedFields = DeleteProductSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return { success: false, error: "Ungültige Produkt-ID." };
  }

  try {
    await deleteProduct(validatedFields.data.productId);
    revalidatePath("/admin");
    revalidatePath("/buchhandlung-paulik-reisch");
    return { success: true, message: "Produkt wurde gelöscht." };
  } catch (e) {
    const error = e as Error;
    return { success: false, error: "Fehler beim Löschen: " + error.message };
  }
}


// Legal Pages
const LegalPageSchema = z.object({
    pageId: z.string().min(2, "Seiten-ID ist erforderlich.").regex(/^[a-z0-9-]+$/, "ID darf nur Kleinbuchstaben, Zahlen und Bindestriche enthalten."),
    title: z.string().min(1, "Titel ist erforderlich."),
    content: z.string().min(1, "Inhalt ist erforderlich."),
});

export type AdminLegalPageState = {
    success: boolean;
    error: string | null;
    message?: string;
};

const initialLegalPageState: AdminLegalPageState = { success: false, error: null };


export async function addLegalPageAction(
    prevState: AdminLegalPageState,
    formData: FormData
): Promise<AdminLegalPageState> {
    const validatedFields = LegalPageSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
        const errorMessages = validatedFields.error.errors.map((e) => e.message).join(". ");
        return { success: false, error: errorMessages };
    }

    try {
        const { pageId, title, content } = validatedFields.data;
        await addLegalPage(pageId, { title, content });
        revalidatePath("/admin");
        revalidatePath(`/${pageId}`);
        return { success: true, message: "Seite erfolgreich erstellt." };
    } catch (e) {
        const error = e as Error;
        return { success: false, error: error.message };
    }
}

const UpdateLegalPageSchema = z.object({
    pageId: z.string(),
    title: z.string().min(1, "Titel darf nicht leer sein."),
    content: z.string().min(1, "Inhalt darf nicht leer sein."),
});

export async function updateLegalPageAction(
    prevState: AdminLegalPageState,
    formData: FormData
): Promise<AdminLegalPageState> {
    const validatedFields = UpdateLegalPageSchema.safeParse(Object.fromEntries(formData.entries()));

     if (!validatedFields.success) {
        const errorMessages = validatedFields.error.errors.map((e) => e.message).join(". ");
        return { success: false, error: errorMessages };
    }

    try {
        const { pageId, title, content } = validatedFields.data;
        await updateLegalPage(pageId, { title, content });
        revalidatePath("/admin");
        revalidatePath(`/${pageId}`);
        return { success: true, message: "Seite erfolgreich aktualisiert." };
    } catch (e) {
        const error = e as Error;
        return { success: false, error: "Fehler beim Aktualisieren: " + error.message };
    }
}

const DeleteLegalPageSchema = z.object({
  pageId: z.string(),
});

export async function deleteLegalPageAction(
    prevState: AdminLegalPageState,
    formData: FormData
): Promise<AdminLegalPageState> {
    const validatedFields = DeleteLegalPageSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
        return { success: false, error: "Ungültige Seiten-ID." };
    }
    
    try {
        await deleteLegalPage(validatedFields.data.pageId);
        revalidatePath("/admin");
        // We can't easily revalidate a dynamic slug that no longer exists,
        // but revalidating /admin is the most important part.
        return { success: true, message: "Seite wurde gelöscht." };
    } catch (e) {
        const error = e as Error;
        return { success: false, error: "Fehler beim Löschen: " + error.message };
    }
}

export async function createDefaultLegalPagesAction(): Promise<AdminLegalPageState> {
    const defaultPages = [
        { 
            pageId: "impressum", 
            title: "Impressum", 
            content: `
                <h1>Impressum</h1>
                <h2>Angaben gem&auml;&szlig; &sect; 5 TMG</h2>
                <p>
                    [Vollst&auml;ndiger Name]<br />
                    [Stra&szlig;e und Hausnummer]<br />
                    [PLZ und Ort]<br />
                </p>
                <h2>Kontakt</h2>
                <p>
                    Telefon: [Ihre Telefonnummer]<br />
                    E-Mail: [Ihre E-Mail-Adresse]
                </p>
                <h2>Verantwortlich f&uuml;r den Inhalt nach &sect; 55 Abs. 2 RStV</h2>
                <p>
                    [Name des Verantwortlichen]<br />
                    [Anschrift des Verantwortlichen]
                </p>
                <h3>Haftungsausschluss</h3>
                <p><strong>Haftung f&uuml;r Inhalte</strong></p>
                <p>Als Diensteanbieter sind wir gem&auml;&szlig; &sect; 7 Abs.1 TMG f&uuml;r eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach &sect;&sect; 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, &uuml;bermittelte oder gespeicherte fremde Informationen zu &uuml;berwachen oder nach Umst&auml;nden zu forschen, die auf eine rechtswidrige T&auml;tigkeit hinweisen.</p>
                <p><strong>Haftung f&uuml;r Links</strong></p>
                <p>Unser Angebot enth&auml;lt Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb k&ouml;nnen wir f&uuml;r diese fremden Inhalte auch keine Gew&auml;hr &uuml;bernehmen. F&uuml;r die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.</p>
                <p><strong>Urheberrecht</strong></p>
                <p>Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielf&auml;ltigung, Bearbeitung, Verbreitung und jede Art der Verwertung au&szlig;erhalb der Grenzen des Urheberrechtes bed&uuml;rfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.</p>
            ` 
        },
        { 
            pageId: "datenschutz", 
            title: "Datenschutzerklärung", 
            content: `
                <h1>Datenschutzerkl&auml;rung</h1>
                <h2>1. Datenschutz auf einen Blick</h2>
                <h3>Allgemeine Hinweise</h3>
                <p>Die folgenden Hinweise geben einen einfachen &Uuml;berblick dar&uuml;ber, was mit Ihren personenbezogenen Daten passiert, wenn Sie unsere Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie pers&ouml;nlich identifiziert werden k&ouml;nnen.</p>
                <h3>Datenerfassung auf unserer Website</h3>
                <p><strong>Wer ist verantwortlich f&uuml;r die Datenerfassung auf dieser Website?</strong></p>
                <p>Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten k&ouml;nnen Sie dem Impressum dieser Website entnehmen.</p>
                <p><strong>Wie erfassen wir Ihre Daten?</strong></p>
                <p>Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen. Hierbei kann es sich z.&nbsp;B. um Daten handeln, die Sie in ein Kontaktformular eingeben. Andere Daten werden automatisch beim Besuch der Website durch unsere IT-Systeme erfasst. Das sind vor allem technische Daten (z.&nbsp;B. Internetbrowser, Betriebssystem oder Uhrzeit des Seitenaufrufs).</p>
                <h2>2. Allgemeine Hinweise und Pflichtinformationen</h2>
                <h3>Datenschutz</h3>
                <p>Die Betreiber dieser Seiten nehmen den Schutz Ihrer pers&öuml;nlichen Daten sehr ernst. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend der gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerkl&auml;rung.</p>
                <h3>Widerruf Ihrer Einwilligung zur Datenverarbeitung</h3>
                <p>Viele Datenverarbeitungsvorg&auml;nge sind nur mit Ihrer ausdr&uuml;cklichen Einwilligung m&ouml;glich. Sie k&ouml;nnen eine bereits erteilte Einwilligung jederzeit widerrufen. Dazu reicht eine formlose Mitteilung per E-Mail an uns. Die Rechtm&auml;&szlig;igkeit der bis zum Widerruf erfolgten Datenverarbeitung bleibt vom Widerruf unber&uuml;hrt.</p>
            ` 
        },
        { 
            pageId: "cookie-richtlinie", 
            title: "Cookie-Richtlinie", 
            content: `
                <h1>Cookie-Richtlinie</h1>
                <p>Diese Cookie-Richtlinie erkl&auml;rt, was Cookies sind und wie wir sie verwenden.</p>
                <h2>Was sind Cookies?</h2>
                <p>Cookies sind kleine Textdateien, die auf Ihrem Ger&auml;t gespeichert werden, wenn eine Website in Ihrem Browser geladen wird. Diese Dateien helfen uns, die Website ordnungsgem&auml;&szlig; funktionieren zu lassen, sie sicherer zu machen und eine bessere Benutzererfahrung zu bieten.</p>
                <h2>Wie verwenden wir Cookies?</h2>
                <p>Unsere Website verwendet hauptsächlich Erstanbieter-Cookies f&uuml;r mehrere Zwecke. Diese Cookies sind meist notwendig, damit die Website richtig funktioniert, und sie sammeln keine Ihrer pers&ouml;nlich identifizierbaren Daten.</p>
                <p>Insbesondere verwenden wir ein funktionales Cookie namens 'hallowelt_cookie_consent', um Ihre Zustimmung zur Verwendung von Cookies zu speichern. Dieses Cookie ist f&uuml;r die Funktion des Cookie-Banners unerl&auml;sslich und wird gesetzt, wenn Sie eine Auswahl treffen.</p>
                <h2>Ihre Wahlm&ouml;glichkeiten</h2>
                <p>Sie k&ouml;nnen Ihre Cookie-Einstellungen jederzeit &auml;ndern. In unserem Cookie-Banner k&ouml;nnen Sie Cookies akzeptieren oder ablehnen. Wenn Sie Cookies ablehnen, werden wir nur das unbedingt notwendige Cookie setzen, um Ihre Pr&auml;ferenz zu speichern.</p>
            ` 
        },
        { 
            pageId: "agb", 
            title: "Allgemeine Geschäftsbedingungen", 
            content: `
                <h1>Allgemeine Gesch&auml;ftsbedingungen (AGB)</h1>
                <h2>1. Geltungsbereich</h2>
                <p>F&uuml;r alle Bestellungen &uuml;ber unsere Webseite durch Verbraucher und Unternehmer gelten die nachfolgenden AGB.</p>
                <h2>2. Vertragspartner, Vertragsschluss</h2>
                <p>Der Kaufvertrag kommt zustande mit [Ihr Unternehmen/Name]. Die Darstellung der Produkte im Online-Shop stellt kein rechtlich bindendes Angebot, sondern einen unverbindlichen Online-Katalog dar. Sie k&ouml;nnen unsere Produkte zun&auml;chst unverbindlich in den Warenkorb legen und Ihre Eingaben vor Absenden Ihrer verbindlichen Bestellung jederzeit korrigieren. Durch Anklicken des Bestellbuttons geben Sie eine verbindliche Bestellung der im Warenkorb enthaltenen Waren ab.</p>
                <h2>3. Bezahlung</h2>
                <p>In unserem Shop stehen Ihnen grunds&auml;tzlich die folgenden Zahlungsarten zur Verf&uuml;gung: Vorkasse, Kreditkarte, PayPal.</p>
                <h2>4. Eigentumsvorbehalt</h2>
                <p>Die Ware bleibt bis zur vollst&auml;ndigen Bezahlung unser Eigentum.</p>
                <h2>Haftungsausschluss f&uuml;r Satire</h2>
                <p>Alle Produkte, Texte und Inhalte auf dieser Website sind satirischer Natur. Eine Haftung f&uuml;r eventuell auftretende Verwirrung, existenzielle Krisen oder spontane Lachanf&alle wird ausdr&uuml;cklich ausgeschlossen. Der Erwerb unserer B&uuml;cher geschieht auf eigene Gefahr f&uuml;r Ihr Zwerchfell und Ihre bisherige Weltanschauung.</p>
            ` 
        },
        { 
            pageId: "lizenz", 
            title: "Lizenz", 
            content: `
                <h1>Lizenzinformationen</h1>
                <h2>Urheberrecht</h2>
                <p>Alle Inhalte dieser Website, insbesondere Texte, Fotografien und Grafiken, sind urheberrechtlich gesch&uuml;tzt. Das Urheberrecht liegt, soweit nicht ausdr&uuml;cklich anders gekennzeichnet, bei den Betreibern dieser Seite.</p>
                <p>Wer gegen das Urheberrecht verst&ouml;&szlig;t (z.B. Bilder oder Texte unerlaubt kopiert), macht sich gem. &sect;&sect; 106 ff UrhG strafbar, wird zudem kostenpflichtig abgemahnt und muss Schadensersatz leisten (&sect; 97 UrhG).</p>
                <h2>Verwendung von Inhalten</h2>
                <p>Eine Verwendung der Inhalte au&szlig;erhalb der gesetzlichen Schranken des deutschen Urheberrechts ist ohne vorherige schriftliche Zustimmung der Seitenbetreiber nicht gestattet.</p>
                <h2>Software und verwendete Bibliotheken</h2>
                <p>Diese Website wurde unter Verwendung verschiedener Open-Source-Technologien erstellt. Wir danken den Entwicklern der folgenden Projekte:</p>
                <ul>
                    <li>Next.js</li>
                    <li>React</li>
                    <li>Tailwind CSS</li>
                    <li>Shadcn/ui</li>
                    <li>Lucide Icons</li>
                    <li>Firebase</li>
                    <li>Genkit</li>
                </ul>
            ` 
        },
    ];

    const results = { created: [] as string[], errors: [] as string[] };

    for (const page of defaultPages) {
        try {
            await addLegalPage(page.pageId, { title: page.title, content: page.content });
            results.created.push(page.pageId);
        } catch (e) {
            const error = e as Error;
            // Ignore errors for pages that already exist
            if (!error.message.includes("existiert bereits")) {
                results.errors.push(`${page.pageId}: ${error.message}`);
            }
        }
    }

    if (results.errors.length > 0) {
        return { success: false, error: `Fehler beim Erstellen der Seiten: ${results.errors.join(", ")}` };
    }

    revalidatePath("/admin");
    defaultPages.forEach(p => revalidatePath(`/${p.pageId}`));
    
    const message = results.created.length > 0 
        ? `Seiten erfolgreich erstellt: ${results.created.join(", ")}`
        : "Alle Standardseiten existieren bereits.";

    return { success: true, message };
}


const CorrectHtmlSchema = z.object({
  html: z.string(),
});

export async function correctHtmlAction(
    prevState: { correctedHtml?: string; error?: string },
    formData: FormData
) {
    const validatedFields = CorrectHtmlSchema.safeParse({
        html: formData.get("html"),
    });

    if (!validatedFields.success) {
        return { error: "Ungültige Eingabe." };
    }

    try {
        const result = await correctHtml(validatedFields.data);
        return { correctedHtml: result.correctedHtml };
    } catch (e) {
        console.error(e);
        return { error: "HTML konnte nicht korrigiert werden. Die KI ist möglicherweise im Urlaub." };
    }
}


// Newsletter Editor Actions
export type AdminNewsletterState = {
  success: boolean;
  error?: string | null;
  message?: string;
  newNewsletterId?: string;
};

const initialNewsletterState: AdminNewsletterState = { success: false, error: null };

const AddNewsletterSchema = z.object({
  name: z.string().min(1, "Name ist erforderlich."),
  subject: z.string().min(1, "Betreff ist erforderlich."),
});

export async function addNewsletterAction(
  prevState: AdminNewsletterState,
  formData: FormData
): Promise<AdminNewsletterState> {
  const validatedFields = AddNewsletterSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    const errorMessages = validatedFields.error.errors.map((e) => e.message).join(". ");
    return { success: false, error: errorMessages };
  }

  try {
    const newId = await addNewsletter(validatedFields.data);
    revalidatePath("/admin");
    return { success: true, message: "Newsletter erfolgreich erstellt.", newNewsletterId: newId };
  } catch (e) {
    const error = e as Error;
    return { success: false, error: error.message };
  }
}

const UpdateNewsletterSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  subject: z.string().optional(),
  components: z.string().optional(), // components will be passed as a JSON string
  content: z.string().optional(), // Final HTML content
});

export async function updateNewsletterAction(
  prevState: AdminNewsletterState,
  formData: FormData
): Promise<AdminNewsletterState> {
  const validatedFields = UpdateNewsletterSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    const errorMessages = validatedFields.error.errors.map((e) => e.message).join(". ");
    return { success: false, error: errorMessages };
  }
  
  try {
    const { id, components, content, ...rest } = validatedFields.data;
    const dataToUpdate: any = { ...rest };
    
    if (content) {
        dataToUpdate.content = content;
    }
    if (components) {
        dataToUpdate.components = JSON.parse(components);
    }
    
    await updateNewsletter(id, dataToUpdate);
    revalidatePath("/admin");
    revalidatePath(`/admin/nle/${id}`);
    return { success: true, message: "Newsletter erfolgreich aktualisiert." };
  } catch (e) {
    const error = e as Error;
    return { success: false, error: "Fehler beim Aktualisieren: " + error.message };
  }
}


const DeleteNewsletterSchema = z.object({
  id: z.string(),
});

export async function deleteNewsletterAction(
  prevState: AdminNewsletterState,
  formData: FormData
): Promise<AdminNewsletterState> {
  const validatedFields = DeleteNewsletterSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return { success: false, error: "Ungültige Newsletter-ID." };
  }
  
  try {
    await deleteNewsletter(validatedFields.data.id);
    revalidatePath("/admin");
    return { success: true, message: "Newsletter wurde gelöscht." };
  } catch (e) {
    const error = e as Error;
    return { success: false, error: "Fehler beim Löschen: " + error.message };
  }
}
