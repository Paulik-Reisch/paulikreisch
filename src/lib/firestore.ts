
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
    deleteDoc
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

export interface PageComponent {
    id: string;
    type: 'heading' | 'text' | 'button' | 'image' | 'spacer';
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
    type: 'heading' | 'text' | 'button' | 'image' | 'separator' | 'spacer' | 'two-columns' | 'image-text';
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
}

// --- SUBSCRIBERS ---
export async function addSubscriber(email: string, source?: string) {
    const docId = email.toLowerCase();
    const subscriberRef = doc(db, 'subscribers', docId);
    const docSnap = await getDoc(subscriberRef);

    if (docSnap.exists()) {
        // Optional: Update existing subscriber
        await updateDoc(subscriberRef, {
            lastSeen: Timestamp.now(),
            source: source || docSnap.data().source || 'unknown',
        });
        // We could throw an error, but it's often better UX to just confirm they are subscribed.
        throw new Error(`Ein Abonnent mit der E-Mail "${email}" existiert bereits.`);
    } else {
        await setDoc(subscriberRef, { 
            email: email,
            source: source || 'unknown',
            subscribedAt: Timestamp.now() 
        });
    }
}


// --- Legal Pages CMS Functions ---

export async function getLegalPages(): Promise<LegalPage[]> {
    const legalCol = collection(db, 'legal_pages');
    const legalSnapshot = await getDocs(legalCol);
    if (legalSnapshot.empty) {
        return [];
    }
    const pageList = legalSnapshot.docs.map(doc => {
        const data = doc.data();
        const lastUpdated = data.lastUpdated;
        return { 
            id: doc.id, 
            title: data.title,
            content: data.content || '',
            components: data.components || [],
            lastUpdated: lastUpdated ? (lastUpdated as Timestamp).toDate().toISOString() : new Date().toISOString(),
        } as LegalPage;
    });
    return pageList;
}

export async function getLegalPage(slug: string): Promise<LegalPage | null> {
    const docRef = doc(db, "legal_pages", slug);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const data = docSnap.data();
        const lastUpdated = data.lastUpdated;
        return {
            id: docSnap.id,
            title: data.title,
            content: data.content || '',
            components: data.components || [],
            lastUpdated: lastUpdated ? (lastUpdated as Timestamp).toDate().toISOString() : new Date().toISOString(),
        } as LegalPage;
    } else {
        return null;
    }
}

export async function addLegalPage(pageId: string, data: { title: string; content: string, components: PageComponent[] }) {
    if (!pageId) throw new Error("Page ID (slug) is required.");
    const pageRef = doc(db, 'legal_pages', pageId);
    const docSnap = await getDoc(pageRef);

    if (docSnap.exists()) {
        throw new Error(`Eine Seite mit der ID "${pageId}" existiert bereits.`);
    }

    await setDoc(pageRef, { 
        ...data,
        lastUpdated: Timestamp.now() 
    });
}


export async function updateLegalPage(pageId: string, data: Partial<Omit<LegalPage, 'id'>>) {
    const pageRef = doc(db, 'legal_pages', pageId);
    await setDoc(pageRef, { 
        ...data,
        lastUpdated: Timestamp.now() 
    }, { merge: true });
}

export async function deleteLegalPage(pageId: string) {
    const pageRef = doc(db, 'legal_pages', pageId);
    await deleteDoc(pageRef);
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
        content: ``,
        lastUpdated: Timestamp.now(),
    });
    
    const initialContent = generateEmailHTML([], data.subject, `${process.env.NEXT_PUBLIC_BASE_URL}/nl/preview/${docRef.id}`);
    await updateDoc(docRef, { content: initialContent });

    return docRef.id;
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
                    <td align="${align}" style="padding: 20px;">
                      <table border="0" cellspacing="0" cellpadding="0" role="presentation">
                        <tr>
                          <td align="center" style="background:${props.backgroundColor || '#007bff'};" bgcolor="${props.backgroundColor || '#007bff'}">
                            <a href="${props.href || '#'}" target="_blank" style="font-size: ${props.fontSize || '16px'}; font-family: Arial, sans-serif; color: ${props.color || '#ffffff'}; text-decoration: none; text-decoration: none; padding: 10px 25px; border: 1px solid ${props.backgroundColor || '#007bff'}; display: inline-block; font-weight: bold;">
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
                        <table border="0" cellpadding="0" cellspacing="0" role="presentation" align="${align}" style="max-width: 100%;">
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
        default:
            return '';
    }
}

function generateEmailHTML(components: NewsletterComponent[], subject: string, previewUrl: string): string {
    const body = components.map(generateComponentHTML).join('');

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
                             <tr>
                                <td bgcolor="#eae7e1" style="padding:20px; font-family:Arial, sans-serif; font-size:12px; color:#333333; line-height:1.4; text-align:left;">
                                  Beste Grüße,<br><br>
                                  Paulik & Reisch<br>
                                  Hallo Welt – Die Bücherserie<br><br>
                                  <a href="mailto:hallo-welt@paulik-reisch.de" style="color:#333333; text-decoration:underline;">hallo-welt@paulik-reisch.de</a><br><br>
                                  <b>Direkter Kontakt:</b><br>
                                  Philipp Paulik – <a href="mailto:philipp@paulik-reisch.de" style="color:#333333; text-decoration:underline;">philipp@paulik-reisch.de</a><br>
                                  Maximilian Reisch – <a href="mailto:max@paulik-reisch.de" style="color:#333333; text-decoration:underline;">max@paulik-reisch.de</a><br><br>
                                  Die Hallo Welt (HW) Bücherserie ist erstellt, gepflegt und individuell publiziert durch Philipp Paulik (Autor), Maximilian Reisch (Autor), Luin Schiffbauer (Illustrator) und weitere Mitwirkende.<br><br>
                                  Veröffentlicht und produziert durch Kindle Direct Publishing (KDP) der Amazon Distribution GmbH, Leipzig sowie ggf. weitere Verlags- und Produktionspartner.<br><br>
                                  <b style="font-size:10px;">Vertraulichkeitshinweis</b><br>
                                  <span style="font-size:10px;">Diese Nachricht und ihre Anhänge sind vertraulich und ausschließlich für die bezeichneten Empfänger bestimmt. Sollten Sie diese E-Mail irrtümlich erhalten haben, informieren Sie bitte umgehend den Absender und löschen Sie diese Nachricht sowie alle Anhänge. Die unbefugte Weitergabe oder Nutzung ist untersagt.</span><br><br>
                                  <b style="font-size:10px;">Rechtlicher Hinweis</b><br>
                                  <span style="font-size:10px;">Die Inhalte dieser E-Mail stellen keine rechtsverbindliche Erklärung dar. Für den Abschluss von Verträgen ist ausschließlich die Schriftform gemäß § 126 BGB maßgeblich. Jegliche Haftung für Übermittlungsfehler, Schäden oder die Nutzung der enthaltenen Informationen wird ausgeschlossen. Irrtum und Änderungen vorbehalten.</span><br><br>
                                  <b>Impressum:</b><br>
                                  Philipp Paulik und Maximilian Reisch<br>
                                  Mozartstraße 1<br>
                                  53819 Neunkirchen<br>
                                  E-Mail: <a href="mailto:hallowelt@paulik-reisch.de" style="color:#333333; text-decoration:underline;">hallowelt@paulik-reisch.de</a><br><br>
                                  Diese E-Mail wurde automatisch versendet. Falls Sie keine weiteren Nachrichten wünschen, klicken Sie bitte hier: 
                                  <a href="#unsubscribe" target="_blank" style="color:#333333; text-decoration:underline;">Abmelden</a><br><br>
                                  © 2025 Paulik & Reisch. Alle Rechte vorbehalten. Und einige Falschheiten.
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

    if (data.components) {
        const docSnap = await getDoc(newsletterRef);
        if (docSnap.exists()) {
             const existingData = docSnap.data();
             const previewUrl = `${process.env.NEXT_PUBLIC_BASE_URL || ''}/nl/preview/${id}`;
             finalData.content = generateEmailHTML(data.components, data.subject || existingData.subject, previewUrl);
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
