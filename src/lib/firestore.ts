

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

export async function getAdminPassword(): Promise<string | null> {
    try {
        const docRef = doc(db, "settings", "admin");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists() && docSnap.data().password) {
            return docSnap.data().password as string;
        } else {
            console.warn("Admin password not found in Firestore under settings/admin.");
            return null;
        }
    } catch (error) {
        console.error("Error fetching admin password:", error);
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
    { id: 'impressum', title: 'Impressum', content: '<p>Hier steht das Impressum.</p>', components: [], lastUpdated: new Date().toISOString() },
    { id: 'datenschutz', title: 'Datenschutzerklärung', content: '<p>Hier steht die Datenschutzerklärung.</p>', components: [], lastUpdated: new Date().toISOString() },
    { id: 'agb', title: 'AGB', content: '<p>Hier stehen die AGB.</p>', components: [], lastUpdated: new Date().toISOString() },
    { id: 'cookie-richtlinie', title: 'Cookie-Richtlinie', content: '<p>Hier stehen die Cookie-Richtlinien.</p>', components: [], lastUpdated: new Date().toISOString() },
    { id: 'lizenz', title: 'Lizenz', content: '<p>Hier stehen die Lizenzinformationen.</p>', components: [], lastUpdated: new Date().toISOString() },
];


export async function getLegalPages(): Promise<LegalPage[]> {
    try {
        const legalCol = collection(db, 'legal');
        const legalSnapshot = await getDocs(legalCol);
        if (legalSnapshot.empty) {
            // If the collection is empty, create the default pages.
            for (const page of defaultLegalPages) {
                const pageRef = doc(db, 'legal', page.id);
                await setDoc(pageRef, { title: page.title, content: page.content, components: page.components, lastUpdated: Timestamp.now() });
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

// --- PALABROTAS ---

const defaultPalabrotas: Omit<Palabrota, 'id'>[] = [
    { de: "Fotze", es: "el coño", pfeiferFaktor: 5, wortart: "Nomen", anwendung: "Starke vulgäre Beleidigung.", synonyme: "Muschi", beispiel: "¡Coño, qué dolor!" },
    { de: "Arsch", es: "el culo", pfeiferFaktor: 3, wortart: "Nomen", anwendung: "Umgangssprachlich für Gesäß.", synonyme: "Hintern", beispiel: "Mueve el culo." },
    { de: "Dummkopf", es: "el tonto", pfeiferFaktor: 2, wortart: "Nomen", anwendung: "Für eine dumme Person.", synonyme: "Idiot", beispiel: "No seas tonto." },
    { de: "Arschloch", es: "el cabrón", pfeiferFaktor: 5, wortart: "Nomen", anwendung: "Starke Beleidigung, auch für einen gerissenen Kerl.", synonyme: "Mistkerl", beispiel: "¡Qué cabrón eres!" },
    { de: "Mistkerl", es: "el gilipollas", pfeiferFaktor: 4, wortart: "Nomen", anwendung: "Starke Beleidigung für einen Idioten.", synonyme: "Vollidiot", beispiel: "Eres un gilipollas." },
    { de: "Arschkriecher", es: "el lameculos", pfeiferFaktor: 4, wortart: "Nomen", anwendung: "Für einen Schleimer.", synonyme: "Speichellecker", beispiel: "Es un lameculos del jefe." },
    { de: "Schwuchtel", es: "el maricón", pfeiferFaktor: 5, wortart: "Nomen", anwendung: "Abfällige Bezeichnung für einen homosexuellen Mann.", synonyme: "Schwuler", beispiel: "¡Qué maricón!" },
    { de: "Hure", es: "la puta", pfeiferFaktor: 5, wortart: "Nomen", anwendung: "Starke Beleidigung, kann auch verstärkend genutzt werden.", synonyme: "Schlampe", beispiel: "¡De puta madre!" },
    { de: "Hurensohn", es: "el hijo de puta", pfeiferFaktor: 5, wortart: "Nomen", anwendung: "Eine der stärksten Beleidigungen.", synonyme: "Bastard", beispiel: "Ese hijo de puta me engañó." },
    { de: "verdammt", es: "maldito", pfeiferFaktor: 2, wortart: "Adjektiv", anwendung: "Um Ärger auszudrücken.", synonyme: "verflucht", beispiel: "Este maldito coche no arranca." },
    { de: "ficken", es: "follar", pfeiferFaktor: 4, wortart: "Verb", anwendung: "Vulgärer Ausdruck für Sex.", synonyme: "vögeln", beispiel: "Vamos a follar." },
    { de: "gefickt", es: "follado", pfeiferFaktor: 4, wortart: "Partizip", anwendung: "Am Ende sein, ruiniert.", synonyme: "am Arsch", beispiel: "Estoy follado." },
    { de: "Scheiße", es: "la mierda", pfeiferFaktor: 1, wortart: "Nomen", anwendung: "Ausdruck von Ekel oder Ärger.", synonyme: "Mist", beispiel: "¡Qué mierda!" },
    { de: "Alter", es: "el tío", pfeiferFaktor: 1, wortart: "Nomen", anwendung: "Umgangssprachlich für 'Typ' oder 'Kerl'.", synonyme: "Kerl", beispiel: "¿Qué pasa, tío?" },
    { de: "Idiot", es: "el idiota", pfeiferFaktor: 3, wortart: "Nomen", anwendung: "Gängige Beleidigung.", synonyme: "Dummkopf", beispiel: "¡No seas idiota!" },
    { de: "Trottel", es: "el imbécil", pfeiferFaktor: 3, wortart: "Nomen", anwendung: "Stärkere Form von Idiot.", synonyme: "Schwachkopf", beispiel: "Eres un imbécil." },
    { de: "Wichser", es: "el pendejo", pfeiferFaktor: 4, wortart: "Nomen", anwendung: "Starke Beleidigung, besonders in Lateinamerika.", synonyme: "Idiot", beispiel: "¡Qué pendejo!" },
    { de: "Feigling", es: "el cobarde", pfeiferFaktor: 2, wortart: "Nomen", anwendung: "Für eine ängstliche Person.", synonyme: "Angsthase", beispiel: "No seas cobarde." },
    { de: "Bastard", es: "el capullo", pfeiferFaktor: 4, wortart: "Nomen", anwendung: "Starke Beleidigung.", synonyme: "Arschloch", beispiel: "¡Vaya capullo!" },
    { de: "Schwanzlutscher", es: "el chupapollas", pfeiferFaktor: 5, wortart: "Nomen", anwendung: "Sehr vulgäre Beleidigung.", synonyme: "Arschkriecher", beispiel: "Ese tío es un chupapollas." },
    { de: "behindert", es: "discapacitado", pfeiferFaktor: 1, wortart: "Adjektiv", anwendung: "Medizinischer Begriff, oft als Beleidigung missbraucht.", synonyme: "eingeschränkt", beispiel: "Das ist eine behinderte Regelung." },
    { de: "Blödmann", es: "el estúpido", pfeiferFaktor: 3, wortart: "Nomen", anwendung: "Für jemanden, der dumm handelt.", synonyme: "Dummkopf", beispiel: "Hör auf, so ein Blödmann zu sein." },
    { de: "Clown", es: "el payaso", pfeiferFaktor: 2, wortart: "Nomen", anwendung: "Für jemanden, der sich lächerlich macht.", synonyme: "Witzbold", beispiel: "Spiel nicht den Clown." },
    { de: "Dieb", es: "el ladrón", pfeiferFaktor: 3, wortart: "Nomen", anwendung: "Jemand, der stiehlt.", synonyme: "Gauner", beispiel: "Haltet den Dieb!" },
    { de: "Drecksack", es: "el guache", pfeiferFaktor: 4, wortart: "Nomen", anwendung: "Sehr abfällige Bezeichnung.", synonyme: "Mistkerl", beispiel: "Was für ein Drecksack!" },
    { de: "dumme Kuh", es: "la vaca ignorante", pfeiferFaktor: 3, wortart: "Phrase", anwendung: "Beleidigung für eine dumme Frau.", synonyme: "dumme Gans", beispiel: "Diese dumme Kuh versteht nichts." },
    { de: "ekelhaft", es: "asqueroso", pfeiferFaktor: 3, wortart: "Adjektiv", anwendung: "Für etwas sehr Widerliches.", synonyme: "widerwärtig", beispiel: "Das Essen schmeckt asqueroso." },
    { de: "Fettsack", es: "el barrigón", pfeiferFaktor: 4, wortart: "Nomen", anwendung: "Stark abfällige Bezeichnung für eine dicke Person.", synonyme: "Dickwanst", beispiel: "Dieser Fettsack isst schon wieder." },
    { de: "Ficker", es: "el chingón", pfeiferFaktor: 5, wortart: "Nomen", anwendung: "Eine Person, die gut im Bett ist (kann auch positiv sein).", synonyme: "Stecher", beispiel: "Er ist ein echter chingón." },
    { de: "Fresser", es: "el zampabollos", pfeiferFaktor: 3, wortart: "Nomen", anwendung: "Für jemanden, der viel und schnell isst.", synonyme: "Vielfraß", beispiel: "Dieser Fresser hat alles aufgegessen." },
    { de: "hässlich", es: "feo", pfeiferFaktor: 2, wortart: "Adjektiv", anwendung: "Beschreibung von etwas Unansehnlichem.", synonyme: "unschön", beispiel: "Der Pullover ist hässlich." },
    { de: "Hexe", es: "la bruja", pfeiferFaktor: 2, wortart: "Nomen", anwendung: "Für eine böse, alte Frau.", synonyme: "Zauberin", beispiel: "Die alte Hexe von nebenan." },
    { de: "Hinterwäldler", es: "el paleto", pfeiferFaktor: 3, wortart: "Nomen", anwendung: "Für eine ungebildete Person vom Land.", synonyme: "Landei", beispiel: "Was für ein Paleto!" },
    { de: "hirnlos", es: "descerebrado", pfeiferFaktor: 4, wortart: "Adjektiv", anwendung: "Für jemanden ohne Verstand.", synonyme: "dumm", beispiel: "Eine hirnlose Aktion." },
    { de: "Hodenkobold", es: "el duende de los testículos", pfeiferFaktor: 5, wortart: "Phrase", anwendung: "Kreative und absurde Beleidigung.", synonyme: "seltsamer Kauz", beispiel: "Du Hodenkobold!" },
    { de: "Holzkopf", es: "el cafre", pfeiferFaktor: 3, wortart: "Nomen", anwendung: "Für eine dumme, ungeschickte Person.", synonyme: "Dummkopf", beispiel: "Dieser Holzkopf hat alles kaputt gemacht." },
    { de: "Hurenbock", es: "el putero", pfeiferFaktor: 5, wortart: "Nomen", anwendung: "Mann, der häufig Prostituierte aufsucht.", synonyme: "Freier", beispiel: "Er ist ein alter Hurenbock." },
    { de: "Kanake", es: "el sudaca", pfeiferFaktor: 5, wortart: "Nomen", anwendung: "Abfällige Bezeichnung für Südamerikaner.", synonyme: "-", beispiel: "Dieser sudaca nervt." },
    { de: "Klugscheißer", es: "el listillo", pfeiferFaktor: 2, wortart: "Nomen", anwendung: "Für einen Besserwisser.", synonyme: "Neunmalkluger", beispiel: "Sei nicht so ein listillo." },
    { de: "Knirps", es: "el renacuajo", pfeiferFaktor: 2, wortart: "Nomen", anwendung: "Für ein kleines Kind oder eine kleine Person.", synonyme: "Zwerg", beispiel: "Was will dieser Knirps?" },
    { de: "Köter", es: "el chucho", pfeiferFaktor: 2, wortart: "Nomen", anwendung: "Abfällig für einen Hund.", synonyme: "Töle", beispiel: "Nimm deinen Köter an die Leine." },
    { de: "Kotzbrocken", es: "el tipo asqueroso", pfeiferFaktor: 4, wortart: "Phrase", anwendung: "Für eine widerliche Person.", synonyme: "Ekel", beispiel: "Was für ein Kotzbrocken." },
    { de: "Kumpel", es: "el güey", pfeiferFaktor: 1, wortart: "Nomen", anwendung: "Umgangssprachlich (Mexiko) für 'Typ', 'Alter'.", synonyme: "Freund", beispiel: "¡Órale, güey!" },
    { de: "Lesbe", es: "la lesbiana", pfeiferFaktor: 1, wortart: "Nomen", anwendung: "Bezeichnung für eine homosexuelle Frau.", synonyme: "-", beispiel: "Sie ist Lesbe." },
    { de: "Lümmel", es: "el patán", pfeiferFaktor: 3, wortart: "Nomen", anwendung: "Für einen unhöflichen, ungehobelten Mann.", synonyme: "Flegel", beispiel: "Sei kein Lümmel." },
    { de: "lutschen", es: "chupar", pfeiferFaktor: 2, wortart: "Verb", anwendung: "Saugen, kann auch vulgär verwendet werden.", synonyme: "saugen", beispiel: "Den Lutscher lutschen." },
    { de: "Missgeburt", es: "la monsquerta", pfeiferFaktor: 5, wortart: "Nomen", anwendung: "Extrem starke Beleidigung.", synonyme: "Monster", beispiel: "¡Qué monsquerta!" },
    { de: "Miststück", es: "el canallas", pfeiferFaktor: 4, wortart: "Nomen", anwendung: "Für eine gemeine, hinterhältige Person.", synonyme: "Schurke", beispiel: "Er ist ein echtes Miststück." },
    { de: "Nichtsnutz", es: "el ablandahígos", pfeiferFaktor: 3, wortart: "Nomen", anwendung: "Für eine faule, nutzlose Person.", synonyme: "Taugenichts", beispiel: "Dieser Nichtsnutz tut nichts." },
    { de: "Nutte", es: "la ramera", pfeiferFaktor: 5, wortart: "Nomen", anwendung: "Starke Beleidigung, ähnlich wie Hure.", synonyme: "Hure", beispiel: "¡Cállate, ramera!" },
    { de: "Pechvogel", es: "el gafe", pfeiferFaktor: 2, wortart: "Nomen", anwendung: "Jemand, der Unglück bringt.", synonyme: "Unglücksrabe", beispiel: "Du bist ein echter Pechvogel." },
    { de: "Penner", es: "el vagabundo", pfeiferFaktor: 2, wortart: "Nomen", anwendung: "Für einen Obdachlosen oder eine heruntergekommene Person.", synonyme: "Landstreicher", beispiel: "Der Penner schläft auf der Parkbank." },
    { de: "Rotzlöffel", es: "el mocoso", pfeiferFaktor: 2, wortart: "Nomen", anwendung: "Für ein freches, ungezogenes Kind.", synonyme: "Gör", beispiel: "Hör zu, du kleiner Rotzlöffel!" },
    { de: "Schlampe", es: "la zorra", pfeiferFaktor: 5, wortart: "Nomen", anwendung: "Starke Beleidigung für eine Frau.", synonyme: "Hure", beispiel: "Was für eine Schlampe!" },
    { de: "Schlawiner", es: "el pillo", pfeiferFaktor: 1, wortart: "Nomen", anwendung: "Für einen kleinen Gauner oder Schelm.", synonyme: "Spitzbube", beispiel: "So ein kleiner Schlawiner!" },
    { de: "Schleimscheißer", es: "el ñoño", pfeiferFaktor: 4, wortart: "Nomen", anwendung: "Für eine übertrieben brave oder langweilige Person.", synonyme: "Langweiler", beispiel: "Sei kein Schleimscheißer." },
    { de: "Schmarotzer", es: "el gorrón", pfeiferFaktor: 3, wortart: "Nomen", anwendung: "Jemand, der auf Kosten anderer lebt.", synonyme: "Parasit", beispiel: "Er ist ein echter Schmarotzer." },
    { de: "schmutzig", es: "sucio", pfeiferFaktor: 1, wortart: "Adjektiv", anwendung: "Nicht sauber.", synonyme: "dreckig", beispiel: "Deine Hände sind schmutzig." },
    { de: "Schnarchsack", es: "el roncador", pfeiferFaktor: 2, wortart: "Nomen", anwendung: "Für jemanden, der laut schnarcht.", synonyme: "Schnarcher", beispiel: "Du alter Schnarchsack!" },
    { de: "Schurke", es: "el malnacido", pfeiferFaktor: 4, wortart: "Nomen", anwendung: "Starke Beleidigung, wörtlich 'schlecht geboren'.", synonyme: "Mistkerl", beispiel: "¡Malnacido!" },
    { de: "Schwätzer", es: "el bocachancla", pfeiferFaktor: 2, wortart: "Nomen", anwendung: "Jemand, der viel und Unsinn redet.", synonyme: "Quasselstrippe", beispiel: "Was für ein Schwätzer!" },
    { de: "Schwachkopf", es: "el tarado", pfeiferFaktor: 4, wortart: "Nomen", anwendung: "Für eine geistig zurückgebliebene Person (stark beleidigend).", synonyme: "Idiot", beispiel: "Er ist ein tarado." },
    { de: "Schweinehund", es: "el hijo de perra", pfeiferFaktor: 5, wortart: "Phrase", anwendung: "Ähnlich wie 'Hurensohn', sehr starke Beleidigung.", synonyme: "Mistkerl", beispiel: "¡Hijo de perra!" },
    { de: "Stinkstiefel", es: "el apestoso", pfeiferFaktor: 2, wortart: "Nomen", anwendung: "Für eine übellaunige Person.", synonyme: "Miesepeter", beispiel: "Sei kein Stinkstiefel." },
    { de: "Streber", es: "el empollón", pfeiferFaktor: 1, wortart: "Nomen", anwendung: "Für einen sehr fleißigen Schüler.", synonyme: "Büffler", beispiel: "Er ist der größte Streber der Klasse." },
    { de: "Tölpel", es: "el papanatas", pfeiferFaktor: 2, wortart: "Nomen", anwendung: "Für eine naive, einfältige Person.", synonyme: "Einfaltspinsel", beispiel: "Was für ein Tölpel!" },
    { de: "verfickt", es: "pinche", pfeiferFaktor: 4, wortart: "Adjektiv", anwendung: "Verstärkendes Wort (Mexiko), ähnlich wie 'verdammt'.", synonyme: "verdammt", beispiel: "¡Pinche coche!" },
    { de: "verrückt", es: "loco", pfeiferFaktor: 1, wortart: "Adjektiv", anwendung: "Nicht bei Verstand.", synonyme: "irre", beispiel: "Estás loco." },
    { de: "Vielfraß", es: "el tragón", pfeiferFaktor: 2, wortart: "Nomen", anwendung: "Jemand, der sehr viel isst.", synonyme: "Fresser", beispiel: "Mein Bruder ist ein echter Vielfraß." },
    { de: "Weichei", es: "el blandengue", pfeiferFaktor: 3, wortart: "Nomen", anwendung: "Für eine schwache, memmenhafte Person.", synonyme: "Memme", beispiel: "Sei kein Weichei." },
    { de: "Zigeuner", es: "el gitano", pfeiferFaktor: 3, wortart: "Nomen", anwendung: "Bezeichnung für Roma, oft abfällig verwendet.", synonyme: "-", beispiel: "Er lebt wie ein Zigeuner." },
    { de: "Zwitter", es: "el hermafrodita", pfeiferFaktor: 2, wortart: "Nomen", anwendung: "Biologischer Begriff, kann beleidigend sein.", synonyme: "Zwitter", beispiel: "Diese Schnecke ist ein Zwitter." }
];


export async function getPalabrotas(): Promise<Palabrota[]> {
    try {
        const vocabCol = collection(db, 'palabrotas');
        const vocabSnapshot = await getDocs(vocabCol);
        if (vocabSnapshot.empty) {
            // If the collection is empty, create the default entries.
            for (const item of defaultPalabrotas) {
                await addDoc(vocabCol, item);
            }
             const newSnapshot = await getDocs(vocabCol);
             return newSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Palabrota)).sort((a,b) => a.de.localeCompare(b.de));
        }
        return vocabSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Palabrota)).sort((a,b) => a.de.localeCompare(b.de));
    } catch (error) {
        console.error("Error fetching palabrotas, returning defaults:", error);
        return defaultPalabrotas.map((p, i) => ({ id: `default-${i}`, ...p })).sort((a,b) => a.de.localeCompare(b.de));
    }
}

export async function addPalabrota(data: Omit<Palabrota, 'id'>) {
    const vocabCol = collection(db, 'palabrotas');
    await addDoc(vocabCol, data);
}

export async function updatePalabrota(id: string, data: Partial<Omit<Palabrota, 'id'>>) {
    const docRef = doc(db, 'palabrotas', id);
    await updateDoc(docRef, data);
}

export async function deletePalabrota(id: string) {
    const docRef = doc(db, 'palabrotas', id);
    await deleteDoc(docRef);
}


// --- CHISTES ---

const defaultChistes: Omit<Chiste, 'id'>[] = [
    { witz: "¿Qué le dice un semáforo a otro? — ¡No me mires, que me estoy cambiando!", uebersetzung: "Was sagt eine Ampel zur anderen? — Schau mich nicht an, ich ziehe mich gerade um!", erklaerung: "Wortspiel: 'cambiar' bedeutet sowohl 'sich umziehen' als auch '(Farbe) wechseln'.", pfeiferFaktor: 2, kategorie: "Wortspiel" },
    { witz: "¿Cuál es el último animal que subió al arca de Noé? — El del-fín.", uebersetzung: "Welches ist das letzte Tier, das die Arche Noah bestieg? — Der Del-phin.", erklaerung: "Wortspiel: 'del fin' klingt wie 'delfín' (Delphin) und bedeutet 'vom Ende'.", pfeiferFaktor: 3, kategorie: "Wortspiel" },
    { witz: "Papá, ¿qué se siente tener un hijo tan guapo? — No sé, hijo, pregúntale a tu abuelo.", uebersetzung: "Papa, wie fühlt es sich an, einen so gutaussehenden Sohn zu haben? — Ich weiß nicht, mein Sohn, frag deinen Großvater.", erklaerung: "Der Vater gibt das 'Kompliment' indirekt an sich selbst weiter.", pfeiferFaktor: 4, kategorie: "Familie" },
    { witz: "Entra un hombre a una pajarería y pregunta: ¿Cuánto cuesta el loro? — 6.000 euros. — ¡Caramba! ¿Y qué hace? — Habla 7 idiomas y sabe de computación. — ¡Me lo llevo! Al día siguiente, vuelve: ¡El loro no ha dicho ni una palabra! — Es que es muy tímido. ¡Usted háblele primero!", uebersetzung: "Ein Mann geht in eine Tierhandlung und fragt: Was kostet der Papagei? - 6.000 Euro. - Wow! Was kann er denn? - Er spricht 7 Sprachen und kennt sich mit Computern aus. - Ich nehme ihn! Am nächsten Tag kommt er zurück: Der Papagei hat kein Wort gesagt! - Er ist nur sehr schüchtern. Sprechen Sie ihn einfach zuerst an!", erklaerung: "Eine klassische Pointe, die die hohe Erwartung mit einer banalen Ausrede bricht.", pfeiferFaktor: 5, kategorie: "Tiere" },
    { witz: "¿Cómo se llama el campeón de buceo japonés? — Tokofondo.", uebersetzung: "Wie heißt der japanische Meister im Tauchen? — Tokofondo.", erklaerung: "Klingt wie ein japanischer Name, bedeutet aber wörtlich 'Ich berühre den Grund' (toco fondo).", pfeiferFaktor: 3, kategorie: "International" },
    { witz: "¿Qué le dice un pez a otro? — ¡Nada!", uebersetzung: "Was sagt ein Fisch zum anderen? — Nichts! / Schwimm!", erklaerung: "Wortspiel: 'Nada' bedeutet 'nichts' und ist auch die Imperativform von 'nadar' (schwimmen).", pfeiferFaktor: 2, kategorie: "Wortspiel" },
];

export async function getChistes(): Promise<Chiste[]> {
    try {
        const chistesCol = collection(db, 'chistes');
        const chistesSnapshot = await getDocs(chistesCol);
        if (chistesSnapshot.empty) {
            // If the collection is empty, create the default entries.
            for (const item of defaultChistes) {
                await addDoc(chistesCol, item);
            }
             const newSnapshot = await getDocs(chistesCol);
             return newSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Chiste)).sort((a,b) => a.witz.localeCompare(b.witz));
        }
        return chistesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Chiste)).sort((a,b) => a.witz.localeCompare(b.witz));
    } catch (error) {
        console.error("Error fetching chistes, returning defaults:", error);
        return defaultChistes.map((p, i) => ({ id: `default-${i}`, ...p })).sort((a,b) => a.witz.localeCompare(b.witz));
    }
}

export async function addChiste(data: Omit<Chiste, 'id'>) {
    const chistesCol = collection(db, 'chistes');
    await addDoc(chistesCol, data);
}

export async function updateChiste(id: string, data: Partial<Omit<Chiste, 'id'>>) {
    const docRef = doc(db, 'chistes', id);
    await updateDoc(docRef, data);
}

export async function deleteChiste(id: string) {
    const docRef = doc(db, 'chistes', id);
    await deleteDoc(docRef);
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
            ...data
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
