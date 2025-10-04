

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
    writeBatch,
    documentId
} from "firebase/firestore";
import { 
    getStorage,
    ref,
    listAll,
    getMetadata,
} from "firebase/storage";

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
    type: 'heading' | 'text' | 'button' | 'image' | 'spacer' | 'separator' | 'columns' | 'customHtml' | 'card' | 'video';
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

export interface Log {
    id: string;
    user: string;
    action: string;
    details: string;
    timestamp: string;
}

export interface StorageFile {
    name: string;
    fullPath: string;
    size: number;
    contentType: string;
    updated: string;
}


const db = getFirestore(app);
const storage = getStorage(app);

// --- LOGGING ---
export async function addLog(user: string, action: string, details: string) {
    try {
        const logsCol = collection(db, 'logs');
        await addDoc(logsCol, {
            user,
            action,
            details,
            timestamp: Timestamp.now(),
        });
    } catch (e) {
        console.error("Error writing log:", e);
    }
}

export async function getLogs(): Promise<Log[]> {
    const logsCol = collection(db, 'logs');
    const q = query(logsCol, orderBy("timestamp", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            timestamp: (data.timestamp as Timestamp)?.toDate().toISOString(),
        } as Log;
    });
}

// --- ADMIN ---
export async function getAdminCredentials(): Promise<Record<string, string>> {
    const docRef = doc(db, 'admin', 'credentials');
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        // This is insecure, but per user request
        return docSnap.data() as Record<string, string>;
    } else {
        console.warn("Admin credentials not found in collection 'admin'.");
        return {};
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

export async function addOrder(orderData: any, user: string) {
    const ordersCol = collection(db, 'orders');
    const dataWithTimestamp = {
        ...orderData,
        timestamp: Timestamp.now()
    };
    await addDoc(ordersCol, dataWithTimestamp);
    await addLog(user, 'Bestellung erstellt', `Bestell-Typ: ${orderData.orderType || 'N/A'}`);
    
    // Also add to subscribers if not already there
    if (orderData.email) {
        await addSubscriber(orderData.email, orderData.orderType || 'Order', user);
    }
}

// --- SUBSCRIBERS ---
export async function addSubscriber(email: string, source: string | undefined, user: string) {
    const docId = email.toLowerCase();
    const subscriberRef = doc(db, 'subscribers', docId);
    const docSnap = await getDoc(subscriberRef);

    if (docSnap.exists()) {
        // If the subscriber already exists, update the source array
        const existingData = docSnap.data();
        const existingSources = existingData.source || [];
        const newSources = Array.isArray(existingSources) ? existingSources : [existingSources];
        
        if (source && !newSources.includes(source)) {
            await updateDoc(subscriberRef, {
                source: arrayUnion(source)
            });
             await addLog(user, 'Abonnent aktualisiert', `Neue Quelle '${source}' für ${email} hinzugefügt`);
        }
    } else {
        await setDoc(subscriberRef, { 
            email: email,
            source: [source || 'unknown'],
            subscribedAt: Timestamp.now(),
            tags: [],
        });
        await addLog(user, 'Abonnent hinzugefügt', `${email} über Quelle '${source}'`);
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

export async function addTagsToSubscribers(subscriberIds: string[], tags: string[], user: string) {
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
    await addLog(user, 'Tags zugewiesen', `${tags.join(', ')} zu ${subscriberIds.length} Abonnenten`);
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
            const batch = writeBatch(db);
            for (const page of defaultLegalPages) {
                const pageRef = doc(db, 'legal', page.id);
                batch.set(pageRef, { title: page.title, content: page.content, components: page.components, lastUpdated: Timestamp.now(), showTitle: page.showTitle, showDate: page.showDate });
            }
            await batch.commit();
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

export async function updateLegalPage(pageId: string, data: Partial<Omit<LegalPage, 'id'>>, user: string) {
    const pageRef = doc(db, 'legal', pageId);
    await updateDoc(pageRef, {
        ...data,
        lastUpdated: Timestamp.now(),
    });
    await addLog(user, 'LP aktualisiert', `Seite: /${pageId}`);
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

export async function addNewsletter(data: { name: string; subject: string }, user: string): Promise<string> {
    const newslettersCol = collection(db, 'newsletters');
    const docRef = await addDoc(newslettersCol, {
        ...data,
        components: [],
        content: ``, // Start with empty content
        lastUpdated: Timestamp.now(),
        useWrapper: true,
    });
    await addLog(user, 'Newsletter erstellt', `Name: ${data.name}`);
    return docRef.id;
}

export async function duplicateNewsletter(id: string, user: string): Promise<string> {
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
    
    await addLog(user, 'Newsletter dupliziert', `Neue Kopie von '${originalNewsletter.name}'`);
    return newNewsletterRef.id;
}


export async function updateNewsletter(id: string, data: Partial<Omit<Newsletter, 'id'>>, user: string) {
    const newsletterRef = doc(db, 'newsletters', id);
    
    await updateDoc(newsletterRef, {
        ...data,
        lastUpdated: Timestamp.now(),
    });
    await addLog(user, 'Newsletter aktualisiert', `ID: ${id}`);
}

export async function deleteNewsletter(id: string, user: string) {
    const newsletterRef = doc(db, 'newsletters', id);
    await deleteDoc(newsletterRef);
    await addLog(user, 'Newsletter gelöscht', `ID: ${id}`);
}


// --- CAMPAIGNS ---
export async function addCampaign(data: Omit<Campaign, 'id' | 'sentAt'>, user: string): Promise<string> {
    const campaignsCol = collection(db, 'campaigns');
    const docRef = await addDoc(campaignsCol, {
        ...data,
        sentAt: Timestamp.now(),
    });
    await addLog(user, 'Kampagne gestartet', `Newsletter: ${data.newsletterName}, ${data.recipientCount} Empfänger`);
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
    const excerptsCol = collection(db, 'excerpts');
    const snapshot = await getDocs(query(excerptsCol));

    if (snapshot.empty) {
        const batch = writeBatch(db);
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
            ...data,
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

export async function updateExcerpt(slug: string, data: Partial<Omit<Excerpt, 'id'>>, user: string) {
    const docRef = doc(db, 'excerpts', slug);
    await updateDoc(docRef, {
        ...data,
        lastUpdated: Timestamp.now(),
    });
    await addLog(user, 'Exzerpt aktualisiert', `Slug: ${slug}, Änderungen: ${Object.keys(data).join(', ')}`);
}

// --- PALABROTAS ---
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

export async function addPalabrota(data: Omit<Palabrota, 'id'>, user: string) {
    await addDoc(collection(db, 'palabrotas'), data);
    await addLog(user, 'Palabrota hinzugefügt', `Wort: ${data.de}`);
}

export async function updatePalabrota(id: string, data: Partial<Omit<Palabrota, 'id'>>, user: string) {
    const docRef = doc(db, 'palabrotas', id);
    await updateDoc(docRef, data);
    await addLog(user, 'Palabrota aktualisiert', `ID: ${id}`);
}

export async function deletePalabrota(id: string, user: string) {
    const docRef = doc(db, 'palabrotas', id);
    await deleteDoc(docRef);
    await addLog(user, 'Palabrota gelöscht', `ID: ${id}`);
}

// --- CHISTES ---
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

// --- GENERIC DB ---
export async function getCollectionData(collectionId: string): Promise<any[]> {
    const colRef = collection(db, collectionId);
    // Simple query, can be expanded later
    const q = query(colRef, orderBy(documentId()));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => {
        const data = doc.data();
        // Convert Timestamps to ISO strings for serialization
        Object.keys(data).forEach(key => {
            if (data[key] instanceof Timestamp) {
                data[key] = (data[key] as Timestamp).toDate().toISOString();
            }
        });
        return { id: doc.id, ...data };
    });
}

export async function updateDocument(collectionId: string, documentId: string, data: any, user: string) {
    const docRef = doc(db, collectionId, documentId);
    await updateDoc(docRef, data);
    await addLog(user, `Dokument aktualisiert in '${collectionId}'`, `ID: ${documentId}`);
}

export async function addDocument(collectionId: string, data: any, user: string) {
    const colRef = collection(db, collectionId);
    const newDoc = await addDoc(colRef, data);
    await addLog(user, `Dokument hinzugefügt zu '${collectionId}'`, `Neue ID: ${newDoc.id}`);
}

export async function deleteDocument(collectionId: string, documentId: string, user: string) {
    const docRef = doc(db, collectionId, documentId);
    await deleteDoc(docRef);
    await addLog(user, `Dokument gelöscht aus '${collectionId}'`, `ID: ${documentId}`);
}


// --- STORAGE ---
export async function listFiles(path: string = '/'): Promise<StorageFile[]> {
    const listRef = ref(storage, path);
    const res = await listAll(listRef);
    
    const files = await Promise.all(res.items.map(async (itemRef) => {
        const metadata = await getMetadata(itemRef);
        return {
            name: metadata.name,
            fullPath: metadata.fullPath,
            size: metadata.size,
            contentType: metadata.contentType || 'application/octet-stream',
            updated: metadata.updated,
        };
    }));

    return files.sort((a, b) => new Date(b.updated).getTime() - new Date(a.updated).getTime());
}
