

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
    arrayUnion
} from "firebase/firestore";

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


const db = getFirestore(app);

// In a real app, this would fetch from Firestore.
// For this prototype, we return mock data to avoid empty states.
const defaultProducts: Product[] = [
    {
        id: "hw1",
        title: "Hallo Welt",
        subtitle: "Erhebliche Kritik am unerhörten Bildungsgang der Lernvollzugsanstalt SK-S",
        price: 10.99,
        imageSrc: "https://m.media-amazon.com/images/I/61hB6jTD-CL._SY466_.jpg",
        aiHint: "book cover satire",
        amazonLink: "https://www.amazon.de/Hallo-Welt-unerh%C3%B6rten-Bildungsgang-Lernvollzugsanstalt/dp/3982548803",
        description: "Die satirische Abrechnung mit dem Schulsystem, Lehrern als Beamtenrobotern und dem täglichen Wahnsinn des Erwachsenwerdens."
    },
    {
        id: "hw2",
        title: "Hallo Welt 2",
        subtitle: "Wie das Leben funktioniert",
        price: 12.99,
        preorderPrice: 9.99,
        imageSrc: "https://placehold.co/300x450.png",
        aiHint: "funny book cover",
        amazonLink: "#",
        description: "Die Fortsetzung, die niemand wollte. Eine Abrechnung mit Bürokratie, deutschem Internet und Mietenwahnsinn."
    }
];

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

export async function getProducts(): Promise<Product[]> {
    try {
        const productsCol = collection(db, 'products');
        const productSnapshot = await getDocs(productsCol);
        if (productSnapshot.empty) {
            console.log("No products found in Firestore, returning default products.");
            return defaultProducts;
        }
        const productList = productSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
        return productList;
    } catch (error) {
        console.error("Error fetching products from Firestore, returning default products:", error);
        return defaultProducts;
    }
}


export async function addProduct(data: Omit<Product, 'id'>) {
    const productsCol = collection(db, 'products');
    await addDoc(productsCol, data);
}

export async function updateProduct(productId: string, data: Partial<Product>) {
    const productRef = doc(db, 'products', productId);
    await updateDoc(productRef, data);
}

export async function deleteProduct(productId: string) {
    const productRef = doc(db, 'products', productId);
    await deleteDoc(productRef);
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

    
