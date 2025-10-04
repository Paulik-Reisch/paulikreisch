

"use server";

import { app } from "@/app/firebase";
import { 
    getFirestore, 
    collection, 
    getDocs, 
    doc, 
    updateDoc,
    addDoc,
    Timestamp,
    orderBy,
    query,
    getDoc,
    setDoc,
    deleteDoc,
    arrayUnion,
    writeBatch
} from "firebase/firestore";

export interface Order {
    id: string;
    [key: string]: any;
    timestamp: string;
}

export interface Subscriber {
    id: string; // The email address
    email: string;
    source: string[] | string;
    subscribedAt: string;
    tags?: string[];
}


export interface PageComponent {
    id: string;
    type: 'heading' | 'text' | 'button' | 'image' | 'spacer' | 'separator' | 'columns' | 'customHtml';
    props: {
        [key: string]: any;
    };
}


export interface LegalPage {
    id: string;
    title: string;
    content: string; // Will store the generated HTML for preview, components are the source of truth
    components: PageComponent[];
    lastUpdated: string;
    showTitle?: boolean;
    showDate?: boolean;
}

export interface NewsletterComponent {
    id: string;
    type: 'heading' | 'text' | 'button' | 'image' | 'separator' | 'spacer' | 'two-columns' | 'image-text' | 'customHtml';
    props: {
        [key: string]: any;
    };
}

export interface Newsletter {
    id: string;
    name: string;
    subject: string;
    components: NewsletterComponent[];
    content: string; // Storing the final HTML
    lastUpdated: string;
    useWrapper?: boolean;
}

export interface Campaign {
    id: string;
    newsletterId: string;
    newsletterName: string;
    newsletterSubject: string;
    recipientCount: number;
    tags: string[];
    sentAt: string;
    status: 'sent' | 'pending' | 'failed';
    resendBatchId?: string;
}

export interface Product {
    id: string;
    title: string;
    subtitle: string;
    price: number;
    preorderPrice?: number;
    imageSrc: string;
    aiHint: string;
    amazonLink: string;
    description: string;
}

export interface Palabrota {
    id: string;
    de: string;
    es: string;
    wortart: string;
    anwendung: string;
    synonyme: string;
    beispiel: string;
    pfeiferFaktor: number;
}

export interface Chiste {
    id: string;
    witz: string;
    uebersetzung: string;
    erklaerung: string;
    pfeiferFaktor: number;
    kategorie: string;
}

export interface Excerpt {
    id: string;
    title: string;
    slug: string;
    chapterNumber: number;
    isPublished: boolean;
    content: string;
    lastUpdated: string;
}


const db = getFirestore(app);

export async function getAdminCredentials(): Promise<Record<string, string> | null> {
    try {
        const docRef = doc(db, "settings", "admin");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data() as Record<string, string>;
        } else {
            console.warn("Admin credentials not found in Firestore under settings/admin. Creating default credentials.");
            const defaultCredentials = {
                'ppaulik': 'AtrIpl;gebes!ud3',
                'mreisch': 'eifrigEnorm!arT2',
            };
            await setDoc(docRef, defaultCredentials);
            return defaultCredentials;
        }
    } catch (error) {
        console.error("Error fetching admin credentials:", error);
        return null;
    }
}

export async function getOrders(): Promise<Order[]> {
    const ordersCol = collection(db, 'orders');
    const q = query(ordersCol, orderBy("timestamp", "desc"));
    const orderSnapshot = await getDocs(q);
    const orderList = orderSnapshot.docs.map(doc => {
        const data = doc.data();
        const timestamp = data.timestamp;
        return { 
            id: doc.id, 
            ...data,
            timestamp: timestamp ? (timestamp as Timestamp).toDate().toISOString() : new Date().toISOString(),
        } as Order;
    });
    return orderList;
}

export async function addOrder(orderData: any) {
    const ordersCol = collection(db, 'orders');
    const dataWithTimestamp = {
        ...orderData,
        timestamp: Timestamp.now()
    };
    await addDoc(ordersCol, dataWithTimestamp);
    
    // Also add to subscribers if not already there
    if (orderData.email) {
        await addSubscriber(orderData.email, orderData.orderType || 'Order');
    }
}

// --- SUBSCRIBERS ---
export async function addSubscriber(email: string, source?: string) {
    const docId = email.toLowerCase();
    const subscriberRef = doc(db, 'subscribers', docId);
    const docSnap = await getDoc(subscriberRef);

    if (docSnap.exists()) {
        // If the subscriber already exists, update the source array
        // Make sure `source` field is an array.
        const existingData = docSnap.data();
        const existingSources = existingData.source || [];
        const newSources = Array.isArray(existingSources) ? existingSources : [existingSources];
        
        if (source && !newSources.includes(source)) {
            await updateDoc(subscriberRef, {
                source: arrayUnion(source)
            });
        }
        throw new Error(`Ein Abonnent mit der E-Mail "${email}" existiert bereits.`);
    } else {
        await setDoc(subscriberRef, { 
            email: email,
            source: [source || 'unknown'],
            subscribedAt: Timestamp.now(),
            tags: [],
        });
    }
}


export async function getSubscribers(): Promise<Subscriber[]> {
    const subsCol = collection(db, 'subscribers');
    const q = query(subsCol, orderBy("subscribedAt", "desc"));
    const subsSnapshot = await getDocs(q);
    if (subsSnapshot.empty) {
        return [];
    }
    const subsList = subsSnapshot.docs.map(doc => {
        const data = doc.data();
        const subscribedAt = data.subscribedAt;
        return { 
            id: doc.id, 
            email: data.email,
            source: data.source,
            tags: data.tags || [],
            subscribedAt: subscribedAt ? (subscribedAt as Timestamp).toDate().toISOString() : new Date().toISOString(),
        } as Subscriber;
    });
    return subsList;
}

export async function addTagsToSubscribers(subscriberIds: string[], tags: string[]) {
    if (!subscriberIds || subscriberIds.length === 0 || !tags || tags.length === 0) {
        throw new Error("Subscriber IDs and tags are required.");
    }
    const batch = [];
    for (const id of subscriberIds) {
        const subscriberRef = doc(db, 'subscribers', id);
        batch.push(updateDoc(subscriberRef, {
            tags: arrayUnion(...tags)
        }));
    }
    await Promise.all(batch);
}


// --- LEGAL PAGES ---
const defaultLegalPages: LegalPage[] = [
    { id: 'impressum', title: 'Impressum', content: '<p>Hier steht das Impressum.</p>', components: [], lastUpdated: new Date().toISOString(), showTitle: true, showDate: true },
    { id: 'datenschutz', title: 'Datenschutzerklärung', content: '<p>Hier steht die Datenschutzerklärung.</p>', components: [], lastUpdated: new Date().toISOString(), showTitle: true, showDate: true },
    { id: 'agb', title: 'AGB', content: '<p>Hier stehen die AGB.</p>', components: [], lastUpdated: new Date().toISOString(), showTitle: true, showDate: true },
    { id: 'cookie-richtlinie', title: 'Cookie-Richtlinie', content: '<p>Hier stehen die Cookie-Richtlinien.</p>', components: [], lastUpdated: new Date().toISOString(), showTitle: true, showDate: true },
    { id: 'lizenz', title: 'Lizenz', content: '<h2 class="font-headline">Software-Lizenz (MIT)</h2><p>Die Software und der Quellcode dieser Webseite sind unter der MIT-Lizenz veröffentlicht. Das bedeutet, Sie können damit tun, was immer Sie wollen, solange Sie den ursprünglichen Copyright-Hinweis beibehalten. Wenn Sie einen Fehler finden, dürfen Sie ihn behalten.</p><h2 class="font-headline mt-8">Inhalts-Lizenz (CC BY-NC-ND 4.0)</h2><p>Alle kreativen Inhalte – Texte, Bilder, satirische Ergüsse – sind urheberrechtlich geschützt und unterliegen der <a href="https://creativecommons.org/licenses/by-nc-nd/4.0/deed.de" target="_blank" rel="noopener noreferrer" class="underline">Creative Commons Namensnennung-NichtKommerziell-KeineBearbeitung 4.0 International Lizenz</a>. Das heißt im Klartext: Sie dürfen unsere Genialität gerne teilen, solange Sie uns als Urheber nennen, kein Geld damit verdienen und nichts daran verändern. Wer unsere Texte klaut und als seine eigenen verkauft, den verklagen wir bis ins literarische Jenseits.</p>', components: [], lastUpdated: new Date().toISOString(), showTitle: true, showDate: true },
];


export async function getLegalPages(): Promise<LegalPage[]> {
    try {
        const legalCol = collection(db, 'legal');
        const legalSnapshot = await getDocs(legalCol);
        if (legalSnapshot.empty) {
            // If the collection is empty, create the default pages.
            for (const page of defaultLegalPages) {
                const pageRef = doc(db, 'legal', page.id);
                await setDoc(pageRef, { title: page.title, content: page.content, components: page.components, lastUpdated: Timestamp.now(), showTitle: page.showTitle, showDate: page.showDate });
            }
            return defaultLegalPages;
        }
        return legalSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                title: data.title,
                content: data.content,
                components: data.components || [],
                lastUpdated: (data.lastUpdated as Timestamp).toDate().toISOString(),
                showTitle: data.showTitle,
                showDate: data.showDate,
            } as LegalPage;
        });
    } catch (error) {
        console.error("Error fetching legal pages, returning defaults:", error);
        return defaultLegalPages;
    }
}

export async function getLegalPage(slug: string): Promise<LegalPage | null> {
    try {
        const docRef = doc(db, 'legal', slug);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            return {
                id: docSnap.id,
                title: data.title,
                content: data.content,
                components: data.components || [],
                lastUpdated: (data.lastUpdated as Timestamp).toDate().toISOString(),
                showTitle: data.showTitle,
                showDate: data.showDate,
            } as LegalPage;
        } else {
            console.log(`No legal page found for slug: ${slug}`);
            return null;
        }
    } catch (error) {
        console.error(`Error fetching legal page for slug ${slug}:`, error);
        return null;
    }
}

export async function updateLegalPage(pageId: string, data: Partial<Omit<LegalPage, 'id'>>) {
    const pageRef = doc(db, 'legal', pageId);
    await updateDoc(pageRef, {
        ...data,
        lastUpdated: Timestamp.now(),
    });
}


// --- Newsletter Functions ---

export async function getNewsletters(): Promise<Newsletter[]> {
    const newslettersCol = collection(db, 'newsletters');
    const q = query(newslettersCol, orderBy("lastUpdated", "desc"));
    const newsletterSnapshot = await getDocs(q);
    return newsletterSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            name: data.name,
            subject: data.subject,
            components: data.components || [],
            content: data.content || '',
            lastUpdated: (data.lastUpdated as Timestamp).toDate().toISOString(),
            useWrapper: data.useWrapper !== false, // default to true
        } as Newsletter;
    });
}

export async function getNewsletter(id: string): Promise<Newsletter | null> {
    const docRef = doc(db, "newsletters", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const data = docSnap.data();
        return {
            id: docSnap.id,
            name: data.name,
            subject: data.subject,
            components: data.components || [],
            content: data.content || '',
            lastUpdated: (data.lastUpdated as Timestamp).toDate().toISOString(),
            useWrapper: data.useWrapper !== false, // default to true
        } as Newsletter;
    } else {
        return null;
    }
}

export async function addNewsletter(data: { name: string; subject: string }): Promise<string> {
    const newslettersCol = collection(db, 'newsletters');
    const docRef = await addDoc(newslettersCol, {
        ...data,
        components: [],
        content: ``, // Start with empty content
        lastUpdated: Timestamp.now(),
        useWrapper: true,
    });
    return docRef.id;
}

export async function duplicateNewsletter(id: string): Promise<string> {
    const originalNewsletter = await getNewsletter(id);
    if (!originalNewsletter) {
        throw new Error("Original newsletter not found.");
    }
    
    const newName = `Kopie von ${originalNewsletter.name}`;
    const newSubject = originalNewsletter.subject;

    const newNewsletterRef = await addDoc(collection(db, 'newsletters'), {
        name: newName,
        subject: newSubject,
        components: originalNewsletter.components,
        content: originalNewsletter.content,
        lastUpdated: Timestamp.now(),
        useWrapper: originalNewsletter.useWrapper,
    });
    
    return newNewsletterRef.id;
}


function generateComponentHTML(component: NewsletterComponent): string {
    const props = component.props;
    const align = props.alignment as 'left' | 'center' | 'right' || 'left';

    switch(component.type) {
        case 'heading':
            return `
                <tr>
                    <td align="${align}" style="padding: 10px 20px; text-align: ${align};">
                        <h1 style="font-family: Arial, sans-serif; font-size: ${props.fontSize || '24px'}; color: ${props.color || '#000000'}; margin: 0;">${props.text || ''}</h1>
                    </td>
                </tr>
            `;
        case 'text':
             return `
                 <tr>
                    <td align="${align}" style="padding: 10px 20px; text-align: ${align};">
                        <p style="font-family: Arial, sans-serif; font-size: ${props.fontSize || '16px'}; color: ${props.color || '#333333'}; margin: 0; line-height: 1.5;">${(props.text || '').replace(/\n/g, '<br />')}</p>
                    </td>
                </tr>
            `;
        case 'button':
            return `
                <tr>
                    <td align="${align}" style="padding: 20px; text-align: ${align};">
                      <table border="0" cellspacing="0" cellpadding="0" role="presentation" align="${align}" style="margin-left: ${align === 'center' ? 'auto' : '0'}; margin-right: ${align === 'center' ? 'auto' : '0'};">
                        <tr>
                          <td align="center" style="background-color:${props.backgroundColor || '#007bff'};" bgcolor="${props.backgroundColor || '#007bff'}">
                            <a href="${props.href || '#'}" target="_blank" style="font-size: ${props.fontSize || '16px'}; font-family: Arial, sans-serif; color: ${props.color || '#ffffff'}; text-decoration: none; padding: 10px 25px; border: 1px solid ${props.backgroundColor || '#007bff'}; display: inline-block; font-weight: bold;">
                              ${props.text || ''}
                            </a>
                          </td>
                        </tr>
                      </table>
                    </td>
                </tr>
            `;
        case 'image':
            const width = props.width ? parseInt(props.width, 10) : 600;
            return `
                <tr>
                    <td align="${align}" style="padding: 10px 20px;">
                        <table border="0" cellpadding="0" cellspacing="0" role="presentation" align="${align}" style="max-width: 100%; margin-left: ${align === 'center' ? 'auto' : '0'}; margin-right: ${align === 'center' ? 'auto' : '0'};">
                            <tr>
                                <td>
                                    <img src="${props.src || 'https://placehold.co/600x400'}" alt="${props.alt || ''}" style="width: 100%; height: auto; display: block; max-width: ${width}px;" width="${width}" />
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            `;
        case 'separator':
            return `
                <tr>
                    <td style="padding: ${props.padding || 10}px 20px;">
                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                            <tr>
                                <td height="1" style="border-bottom: ${props.thickness || 1}px ${props.style || 'solid'} ${props.color || '#cccccc'};"></td>
                            </tr>
                        </table>
                    </td>
                </tr>
            `;
        case 'spacer':
            return `
                <tr>
                    <td style="height: ${props.height || 20}px; line-height: ${props.height || 20}px; font-size: 1px;">&nbsp;</td>
                </tr>
            `;
        case 'two-columns':
            return `
                <tr>
                    <td style="padding: 10px 20px;">
                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                            <tr>
                                <td valign="top" width="50%" style="padding-right: 10px;">
                                    <p style="font-family: Arial, sans-serif; font-size: 14px; color: #333333; margin: 0; line-height: 1.5;">${(props.text1 || '').replace(/\n/g, '<br />')}</p>
                                </td>
                                <td valign="top" width="50%" style="padding-left: 10px;">
                                    <p style="font-family: Arial, sans-serif; font-size: 14px; color: #333333; margin: 0; line-height: 1.5;">${(props.text2 || '').replace(/\n/g, '<br />')}</p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            `;
        case 'image-text':
            const imageOrder = props.layout === 'image-right' ? 2 : 1;
            const textOrder = props.layout === 'image-right' ? 1 : 2;
            const widths = (props.columnWidth || '50/50').split('/');
            const imageWidthPercent = widths[imageOrder - 1];
            const textWidthPercent = widths[textOrder - 1];
            
            const imageContent = `
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                        <td align="center" style="padding: 5px;">
                             <img src="${props.src || 'https://placehold.co/300x200'}" alt="${props.alt || ''}" style="width: 100%; height: auto; display: block;" width="100%" />
                        </td>
                    </tr>
                </table>`;

            const textContent = `
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                        <td align="left" style="padding: 5px;">
                            <p style="font-family: Arial, sans-serif; font-size: 14px; color: #333333; margin: 0; line-height: 1.5;">${(props.text || '').replace(/\n/g, '<br />')}</p>
                        </td>
                    </tr>
                </table>`;

            return `
                <tr>
                    <td style="padding: 10px;">
                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                            <tr>
                                <td valign="top" width="${imageWidthPercent}%" style="${textOrder === 1 ? 'padding-right:10px;' : 'padding-left:10px;'}">
                                    ${imageOrder === 1 ? imageContent : textContent}
                                </td>
                                <td valign="top" width="${textWidthPercent}%" style="${imageOrder === 1 ? 'padding-left:10px;' : 'padding-right:10px;'}">
                                    ${textOrder === 2 ? textContent : imageContent}
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            `;
        case 'customHtml':
            return props.html || '';
        default:
            return '';
    }
}

function generateEmailHTML(components: NewsletterComponent[], subject: string, previewUrl: string, useWrapper: boolean): string {
    const body = components.map(generateComponentHTML).join('\n');

    if (!useWrapper) {
        return body;
    }

    return `
        <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <html xmlns="http://www.w3.org/1999/xhtml">
        <head>
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            <title>${subject}</title>
            <style type="text/css">
                body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
                table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
                img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
                table { border-collapse: collapse !important; }
                body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; }
            </style>
        </head>
        <body style="margin: 0 !important; padding: 0 !important; background-color: #f4f4f4;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                    <td align="center" style="background-color: #f4f4f4;">
                        <!--[if (gte mso 9)|(IE)]>
                        <table align="center" border="0" cellspacing="0" cellpadding="0" width="600">
                        <tr>
                        <td align="center" valign="top" width="600">
                        <![endif]-->
                        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="max-width: 600px; width: 100%;">
                            <tr>
                                <td align="center" valign="top" style="font-size: 11px; font-family: Arial, sans-serif; color: #888888; padding: 10px;">
                                    E-Mail wird nicht korrekt angezeigt? <a href="${previewUrl}" target="_blank" style="color: #888888; text-decoration: underline;">Online ansehen</a>
                                </td>
                            </tr>
                            <tr>
                                <td align="center" valign="top" style="background-color: #ffffff;">
                                    <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%">
                                        ${body}
                                    </table>
                                </td>
                            </tr>
                            <!-- Footer -->
                            <tr>
                                <td align="center" style="padding:20px; background-color:#f4f4f4; font-size:12px; line-height:18px; color:#666666; font-family: Arial, sans-serif;">
                                    <p style="margin:0 0 8px 0;">Die satirische "Hallo Welt"-Bücherserie ist eine Idee und Kreation von Philipp Paulik (Autor), Maximilian Reisch (Autor), Luin Schiffbauer (Illustrator) und weiteren Mitwirkenden. Veröffentlicht und produziert durch Kindle Direct Publishing (KDP) der Amazon Distribution GmbH, Leipzig sowie ggf. weitere Verlags- und Produktionspartner.
                                    </p>
                                    <p style="margin:0 0 8px 0;">Du möchtest keine weiteren E‑Mails erhalten?
                                    <a href="/nl/unsubscribe" target="_blank" style="color:#0A5EBF; text-decoration:underline;">Hier abmelden</a>.
                                    </p>
                                    <p style="margin:0;">&copy; ${new Date().getFullYear()} Hallo Welt – Philipp Paulik & Maximilian Reisch</p>
                                </td>
                            </tr>
                        </table>
                        <!--[if (gte mso 9)|(IE)]>
                        </td>
                        </tr>
                        </table>
                        <![endif]-->
                    </td>
                </tr>
            </table>
        </body>
        </html>
    `;
}

export async function updateNewsletter(id: string, data: Partial<Omit<Newsletter, 'id'>>) {
    const newsletterRef = doc(db, 'newsletters', id);
    
    let finalData: any = { ...data };

    // If components are being updated, we need to regenerate the HTML content
    if (data.components) {
        const docSnap = await getDoc(newsletterRef);
        if (docSnap.exists()) {
             const existingData = docSnap.data();
             const useWrapper = data.useWrapper !== undefined ? data.useWrapper : existingData.useWrapper !== false;
             const previewUrl = `${process.env.NEXT_PUBLIC_BASE_URL || ''}/nl/preview/${id}`;
             finalData.content = generateEmailHTML(data.components, data.subject || existingData.subject, previewUrl, useWrapper);
        }
    } else if (data.useWrapper !== undefined || data.subject) {
         const docSnap = await getDoc(newsletterRef);
         if (docSnap.exists()) {
            const existingData = docSnap.data();
            const previewUrl = `${process.env.NEXT_PUBLIC_BASE_URL || ''}/nl/preview/${id}`;
            const useWrapper = data.useWrapper !== undefined ? data.useWrapper : existingData.useWrapper;
            finalData.content = generateEmailHTML(existingData.components, data.subject || existingData.subject, previewUrl, useWrapper);
        }
    }


    await updateDoc(newsletterRef, {
        ...finalData,
        lastUpdated: Timestamp.now(),
    });
}

export async function deleteNewsletter(id: string) {
    const newsletterRef = doc(db, 'newsletters', id);
    await deleteDoc(newsletterRef);
}


// --- CAMPAIGNS ---
export async function addCampaign(data: Omit<Campaign, 'id' | 'sentAt'>): Promise<string> {
    const campaignsCol = collection(db, 'campaigns');
    const docRef = await addDoc(campaignsCol, {
        ...data,
        sentAt: Timestamp.now(),
    });
    return docRef.id;
}


export async function getCampaigns(): Promise<Campaign[]> {
    const campaignsCol = collection(db, 'campaigns');
    const q = query(campaignsCol, orderBy("sentAt", "desc"));
    const campaignSnapshot = await getDocs(q);
    return campaignSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            sentAt: (data.sentAt as Timestamp).toDate().toISOString(),
        } as Campaign;
    });
}

// --- EXCERPTS ---

async function initializeExcerpts() {
    const batch = writeBatch(db);
    const excerptsCol = collection(db, 'excerpts');
    const snapshot = await getDocs(excerptsCol);

    if (snapshot.empty) {
        console.log("Initializing 36 excerpts...");
        for (let i = 1; i <= 36; i++) {
            const slug = `kapitel-${i}`;
            const docRef = doc(db, 'excerpts', slug);
            batch.set(docRef, {
                chapterNumber: i,
                title: `Kapitel ${i}`,
                slug: slug,
                content: `<p>Inhalt für Kapitel ${i} kommt hierher...</p>`,
                isPublished: false,
                lastUpdated: Timestamp.now()
            });
        }
        await batch.commit();
        console.log("Excerpts initialized.");
    }
}


export async function getExcerpts(): Promise<Excerpt[]> {
    await initializeExcerpts(); // Ensure excerpts exist
    const excerptsCol = collection(db, 'excerpts');
    const q = query(excerptsCol, orderBy("chapterNumber", "asc"));
    const excerptSnapshot = await getDocs(q);
    return excerptSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            title: data.title,
            slug: data.slug,
            chapterNumber: data.chapterNumber,
            isPublished: data.isPublished,
            content: data.content,
            lastUpdated: (data.lastUpdated as Timestamp).toDate().toISOString(),
        } as Excerpt;
    });
}

export async function getPublishedExcerpts(): Promise<Excerpt[]> {
    const allExcerpts = await getExcerpts();
    return allExcerpts.filter(e => e.isPublished);
}


export async function getExcerpt(slug: string): Promise<Excerpt | null> {
    const docRef = doc(db, 'excerpts', slug);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const data = docSnap.data();
        return {
            id: docSnap.id,
            ...data,
            lastUpdated: (data.lastUpdated as Timestamp).toDate().toISOString(),
        } as Excerpt;
    }
    return null;
}

export async function updateExcerpt(slug: string, data: Partial<Omit<Excerpt, 'id'>>) {
    const docRef = doc(db, 'excerpts', slug);
    await updateDoc(docRef, {
        ...data,
        lastUpdated: Timestamp.now(),
    });
}

// Palabrotas
export async function getPalabrotas(): Promise<Palabrota[]> {
    const palabrotasCol = collection(db, 'palabrotas');
    const q = query(palabrotasCol, orderBy("de", "asc"));
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
        return [];
    }
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    } as Palabrota));
}

export async function addPalabrota(data: Omit<Palabrota, 'id'>) {
    await addDoc(collection(db, 'palabrotas'), data);
}

export async function updatePalabrota(id: string, data: Partial<Omit<Palabrota, 'id'>>) {
    const docRef = doc(db, 'palabrotas', id);
    await updateDoc(docRef, data);
}

export async function deletePalabrota(id: string) {
    const docRef = doc(db, 'palabrotas', id);
    await deleteDoc(docRef);
}

// Chistes
export async function getChistes(): Promise<Chiste[]> {
    const chistesCol = collection(db, 'chistes');
    const q = query(chistesCol, orderBy("witz", "asc"));
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
        return [];
    }
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    } as Chiste));
}