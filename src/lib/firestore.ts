import { app } from "@/app/firebase";
import { 
    getFirestore, 
    collection, 
    doc, 
    updateDoc,
    addDoc,
    Timestamp,
    orderBy,
    query,
    setDoc,
    deleteDoc,
    writeBatch,
    documentId,
    where,
    limit as limitTo,
    type DocumentData
} from "firebase/firestore";
import { 
    getStorage,
    ref,
    listAll,
    getMetadata,
} from "firebase/storage";
import { getDocMetered, getDocsMetered } from "@/lib/firestore-read-metering";

export interface Order {
    id: string;
    [key: string]: any;
    timestamp: string;
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
    isLive?: boolean;
}

export interface Product {
    id: string;
    title: string;
    subtitle: string;
    price: number;
    preorderPrice?: number;
    imageSrc: string;
    imageBackSrc?: string;
    aiHint: string;
    amazonLink: string;
    description: string;
}

export interface Palabrota {
    id: string;
    de: string;
    es: string;
    phonetik?: string;
    wortart: string;
    anwendung: string;
    synonyme: string;
    beispiel: string;
    pfeiferFaktor: number;
    // New fields for the "Hyper-Duden"
    geschlecht?: 'm' | 'w' | 'n' | 'p'; // männlich, weiblich, neutral, plural
    artikel?: string; // el, la, los, las
    mehrzahl?: string; // Plural form
    region?: string; // z.B. Spanien, Lateinamerika, Allgemein
    kontext?: string; // Zusätzlicher Kontext
    steigerung?: string; // z.B. für Adjektive
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

export interface SeoMetadata {
  id: string; // URL slug, e.g., 'lp-pfeifer' or 'home'
  title: string;
  metaDescription: string;
  canonicalUrl?: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogImageAlt?: string;
  ogType?: string;
  ogSiteName?: string;
  twitterCard?: string;
  twitterSite?: string;
  twitterCreator?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  aiSummary?: string;
  aiKeywords?: string;
  aiEntities?: string;
  aiContext?: string;
  aiQuestions?: string;
  contentStructure?: string;
  schemaType?: string;
  publisher?: string;
  robots?: string;
  language?: string;
  geoTargeting?: string;
  answerSnippets?: string;
  semanticRelations?: string;
}

export interface Author {
    id: string;
    slug: string;
    firstName: string;
    lastName: string;
    profilePictureUrl: string;
    bio: string;
    websiteUrl?: string;
}

export interface LandingPage {
    id: string;
    slug: string;
    title: string;
    lastUpdated: string;
    htmlContent?: string;
    cssContent?: string;
    jsContent?: string;
}

export interface AnalyticsEvent {
    id: string;
    type: 'page_view' | 'newsletter_subscription' | string;
    timestamp: Timestamp;
    path: string;
    userId: string;
    params?: {
        [key: string]: any;
    };
}

export interface Subscriber {
    id: string;
    email: string;
    source: string;
    subscribedAt: Timestamp;
}



const db = getFirestore(app);

// --- AUTHORS ---

export async function getAuthors(): Promise<Author[]> {
    const authorsCol = collection(db, 'authors');
    const q = query(authorsCol, orderBy("lastName", "asc"));
    const snapshot = await getDocsMetered("getAuthors", q);
    if (snapshot.empty) {
        // A read may return a local fallback, but must never seed production data.
        const defaultAuthor: Omit<Author, 'id'> = {
            slug: 'paulik-reisch',
            firstName: 'Paulik',
            lastName: '& Reisch',
            profilePictureUrl: 'https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/p_und_r-logo.png?alt=media&token=e1b7c172-fa61-47f4-a4e4-f92fe0ffa522',
            bio: 'Satire-Autoren und Meister des alltäglichen Wahnsinns.',
            websiteUrl: 'https://paulikreisch.de'
        };
        return [{ id: 'paulik-reisch', ...defaultAuthor }];
    }
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    } as Author));
}

export async function getAuthorBySlug(slug: string): Promise<Author | null> {
    const docRef = doc(db, 'authors', slug);
    const docSnap = await getDocMetered("getAuthorBySlug", docRef);
    if (docSnap.exists()) {
        return {
            id: docSnap.id,
            ...docSnap.data()
        } as Author;
    }
    return null;
}

export async function addAuthor(authorData: Omit<Author, 'id'>, user: string): Promise<string> {
    const slug = authorData.slug || `${authorData.firstName}-${authorData.lastName}`.toLowerCase().replace(/\s+/g, '-');
    const docRef = doc(db, 'authors', slug);
    
    const docSnap = await getDocMetered("addAuthor", docRef);
    if (docSnap.exists()) {
        throw new Error(`Autor-Slug "${slug}" existiert bereits.`);
    }

    await setDoc(docRef, { ...authorData, slug });
    await addLog(user, 'Autor erstellt', `Slug: ${slug}`);
    return slug;
}

export async function updateAuthor(originalSlug: string, dataToUpdate: Partial<Omit<Author, 'id'>>, user: string) {
    const { slug: newSlug, ...restData } = dataToUpdate;

    if (!newSlug || originalSlug === newSlug) {
        const docRef = doc(db, 'authors', originalSlug);
        await updateDoc(docRef, restData);
        await addLog(user, 'Autor aktualisiert', `Slug: ${originalSlug}`);
    } else {
        const oldDocRef = doc(db, 'authors', originalSlug);
        const newDocRef = doc(db, 'authors', newSlug);

        const newDocSnap = await getDocMetered("updateAuthor", newDocRef);
        if (newDocSnap.exists()) {
            throw new Error(`Autor-Slug "${newSlug}" existiert bereits.`);
        }

        const oldDocSnap = await getDocMetered("updateAuthor", oldDocRef);
        if (!oldDocSnap.exists()) {
             throw new Error(`Originalautor mit Slug "${originalSlug}" nicht gefunden.`);
        }
        
        const oldData = oldDocSnap.data();
        const batch = writeBatch(db);
        
        const newData = {
            ...oldData,
            ...dataToUpdate,
        };

        batch.set(newDocRef, newData);
        batch.delete(oldDocRef);
        
        await batch.commit();
        await addLog(user, 'Autor verschoben/aktualisiert', `Von ${originalSlug} zu ${newSlug}`);
    }
}

export async function deleteAuthor(slug: string, user: string) {
    const docRef = doc(db, 'authors', slug);
    await deleteDoc(docRef);
    await addLog(user, 'Autor gelöscht', `Slug: ${slug}`);
}

// --- COUNTDOWN ---
export async function getCountdownTarget(): Promise<Date> {
    const docRef = doc(db, 'settings', 'countdown');
    const docSnap = await getDocMetered("getCountdownTarget", docRef);

    if (docSnap.exists()) {
        return (docSnap.data().hw2LaunchDate as Timestamp).toDate();
    } else {
        // Initialize if it doesn't exist
        const initialDate = new Date('2026-08-01T00:00:00');
        return initialDate;
    }
}

export async function updateCountdownTarget(newDate: Date): Promise<void> {
    const docRef = doc(db, 'settings', 'countdown');
    await setDoc(docRef, { hw2LaunchDate: Timestamp.fromDate(newDate) }, { merge: true });
}


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
    const snapshot = await getDocsMetered("getLogs", q);
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
export async function getAdminCredentials(): Promise<Record<string, string> | null> {
    const docRef = doc(db, 'settings', 'admin');
    const docSnap = await getDocMetered("getAdminCredentials", docRef);

    if (docSnap.exists()) {
        return docSnap.data() as Record<string, string>;
    } else {
        console.warn("Admin credentials document not found in 'settings' collection.");
        return null;
    }
}


export async function getOrders(): Promise<Order[]> {
    const ordersCol = collection(db, 'orders');
    const q = query(ordersCol, orderBy("timestamp", "desc"));
    const orderSnapshot = await getDocsMetered("getOrders", q);
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
}


// --- LEGAL PAGES ---
const defaultLegalPages: LegalPage[] = [
    { id: 'impressum', title: 'Impressum', content: '<p>Hier steht das Impressum.</p>', components: [], lastUpdated: new Date().toISOString(), showTitle: true, showDate: true },
    { id: 'datenschutz', title: 'Datenschutzerklärung', content: '<p>Hier steht die Datenschutzerklärung.</p>', components: [], lastUpdated: new Date().toISOString(), showTitle: true, showDate: true },
    { id: 'agb', title: 'AGB', content: '<p>Hier stehen die AGB.</p>', components: [], lastUpdated: new Date().toISOString(), showTitle: true, showDate: true },
    { id: 'cookie-richtlinie', title: 'Cookie-Richtlinie', content: '<p>Hier stehen die Cookie-Richtlinien.</p>', components: [], lastUpdated: new Date().toISOString(), showTitle: true, showDate: true },
];


function toLegalPage(doc: { id: string; data: () => DocumentData }): LegalPage {
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
}

/** Reads the whole `legal` collection once. Throws on errors so callers never cache a failure. */
export async function fetchLegalPagesStrict(): Promise<LegalPage[]> {
    const legalSnapshot = await getDocsMetered("fetchLegalPagesStrict", collection(db, 'legal'));
    return legalSnapshot.docs.map(toLegalPage);
}

export async function getLegalPages(): Promise<LegalPage[]> {
    try {
        const legalCol = collection(db, 'legal');
        const legalSnapshot = await getDocsMetered("getLegalPages", legalCol);
        if (legalSnapshot.empty) {
            // Return local defaults without writing during page rendering.
            return defaultLegalPages;
        }
        return legalSnapshot.docs.map(toLegalPage);
    } catch (error) {
        console.error("Error fetching legal pages, returning defaults:", error);
        return defaultLegalPages;
    }
}

// Lokale Fallback-Inhalte, damit Legal-Seiten auch ohne Firestore-Dokument
// (noch nicht angelegt / Fehler) funktionieren, statt eine 404 zu werfen.
const LEGAL_FALLBACKS: Record<string, Omit<LegalPage, 'id'>> = {
  impressum: {
    title: 'Impressum',
    content: '<p>Die rechtlichen Angaben gemäß §§ 5, 6 DDG werden derzeit finalisiert und an dieser Stelle hinterlegt. Bitte beachten Sie die aktuellsten Informationen unter <a href="/datenschutz">Datenschutz</a>.</p>',
    components: [],
    lastUpdated: new Date().toISOString(),
    showTitle: true,
    showDate: true,
  },
  'cookie-richtlinie': {
    title: 'Cookie-Richtlinie',
    content: '<p>Unsere Cookie-Richtlinie wird derzeit aktualisiert. Wesentliche Hinweise zur Verarbeitung finden Sie in unserer <a href="/datenschutz">Datenschutzerklärung</a>.</p>',
    components: [],
    lastUpdated: new Date().toISOString(),
    showTitle: true,
    showDate: true,
  },
  transparenz: {
    title: 'Transparenzhinweise',
    content: '<h2>Transparenzhinweise gemäß Art. 50 der Verordnung (EU) 2024/1689 (KI-Verordnung / AI Act)</h2><p>Die auf diesem Angebot veröffentlichten satirischen Beiträge, literarischen Texte sowie illustrativen und/oder audiovisuellen Darstellungen können ganz oder teilweise mittels Systemen künstlicher Intelligenz erzeugt, bearbeitet oder wesentlich beeinflusst worden sein. Sofern derartige Inhalte geeignet sind, als authentisch wahrgenommen zu werden, werden sie als künstlichen Ursprungs gekennzeichnet. Bei offensichtlich künstlerischen, kreativen, satirischen oder fiktionalen Werken beschränken sich die Transparenzpflichten auf eine geeignete Offenlegung.</p>',
    components: [],
    lastUpdated: new Date().toISOString(),
    showTitle: true,
    showDate: true,
  },
  datenschutz: {
    title: 'Datenschutzerklärung',
    content: '<p>Unsere Datenschutzerklärung wird derzeit finalisiert. Bitte beachten Sie die aktuellen Hinweise im Impressum.</p>',
    components: [],
    lastUpdated: new Date().toISOString(),
    showTitle: true,
    showDate: true,
  },
  agb: {
    title: 'Allgemeine Geschäftsbedingungen',
    content: '<p>Unsere Allgemeinen Geschäftsbedingungen werden derzeit finalisiert.</p>',
    components: [],
    lastUpdated: new Date().toISOString(),
    showTitle: true,
    showDate: true,
  },
};

export function getLegalFallback(slug: string): LegalPage | null {
    const fallback = LEGAL_FALLBACKS[slug];
    return fallback ? { id: slug, ...fallback } : null;
}

export async function getLegalPage(slug: string): Promise<LegalPage | null> {
    try {
        const docRef = doc(db, 'legal', slug);
        const docSnap = await getDocMetered("getLegalPage", docRef);

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
            console.log(`No legal page found for slug: ${slug} — using local fallback`);
            const fallback = LEGAL_FALLBACKS[slug];
            return fallback ? { id: slug, ...fallback } : null;
        }
    } catch (error) {
        console.error('Error fetching legal page for slug %s:', slug, error);
        const fallback = LEGAL_FALLBACKS[slug];
        return fallback ? { id: slug, ...fallback } : null;
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

// --- LANDING PAGES ---

async function initializeLandingPages() {
    const lpCol = collection(db, 'landing_pages');
    const snapshot = await getDocsMetered("initializeLandingPages", query(lpCol));
    if (snapshot.empty) {
        const batch = writeBatch(db);
        console.log("Initializing default landing pages...");
        
        await batch.commit();
        console.log("Default landing pages initialized.");
    }
}

export async function getLandingPages(): Promise<LandingPage[]> {
    const lpCol = collection(db, 'landing_pages');
    const q = query(lpCol, orderBy("title", "asc"));
    const snapshot = await getDocsMetered("getLandingPages", q);
    return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            slug: doc.id,
            ...data,
            lastUpdated: (data.lastUpdated as Timestamp).toDate().toISOString(),
        } as LandingPage;
    });
}

export async function getLandingPageBySlug(slug: string): Promise<LandingPage | null> {
    const docRef = doc(db, 'landing_pages', slug);
    const docSnap = await getDocMetered("getLandingPageBySlug", docRef);
    if (docSnap.exists()) {
        const data = docSnap.data();
        return {
            id: docSnap.id,
            slug: docSnap.id,
            ...data,
            lastUpdated: (data.lastUpdated as Timestamp).toDate().toISOString(),
        } as LandingPage;
    }
    return null;
}

export async function addLandingPage(pageData: Omit<LandingPage, 'id' | 'lastUpdated'>, user: string): Promise<string> {
    const slug = pageData.slug || pageData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const docRef = doc(db, 'landing_pages', slug);
    
    const docSnap = await getDocMetered("addLandingPage", docRef);
    if (docSnap.exists()) {
        throw new Error(`Landing Page mit Slug "${slug}" existiert bereits.`);
    }

    const dataWithTimestamp = {
        ...pageData,
        slug,
        lastUpdated: Timestamp.now(),
    };
    await setDoc(docRef, dataWithTimestamp);
    await addLog(user, 'Landing Page erstellt', `Slug: ${slug}`);
    return slug;
}

export async function updateLandingPage(slug: string, dataToUpdate: Partial<Omit<LandingPage, 'id' | 'lastUpdated'>>, user: string) {
    const docRef = doc(db, 'landing_pages', slug);
    
    // If slug is being changed, we need to move the document
    if (dataToUpdate.slug && dataToUpdate.slug !== slug) {
        const newDocRef = doc(db, 'landing_pages', dataToUpdate.slug);
        const oldDocSnap = await getDocMetered("updateLandingPage", docRef);
        if (oldDocSnap.exists()) {
            const batch = writeBatch(db);
            const newData = {
                ...oldDocSnap.data(),
                ...dataToUpdate,
                lastUpdated: Timestamp.now()
            };
            batch.set(newDocRef, newData);
            batch.delete(docRef);
            await batch.commit();
            await addLog(user, 'Landing Page Slug geändert', `Von ${slug} zu ${dataToUpdate.slug}`);
        }
    } else {
         await updateDoc(docRef, {
            ...dataToUpdate,
            lastUpdated: Timestamp.now(),
        });
        await addLog(user, 'Landing Page aktualisiert', `Slug: ${slug}`);
    }
}

export async function deleteLandingPage(slug: string, user: string) {
    const docRef = doc(db, 'landing_pages', slug);
    await deleteDoc(docRef);
    await addLog(user, 'Landing Page gelöscht', `Slug: ${slug}`);
}

// --- Newsletter Functions ---

export async function getNewsletters(): Promise<Newsletter[]> {
    const newslettersCol = collection(db, 'newsletters');
    const q = query(newslettersCol, orderBy("lastUpdated", "desc"));
    const newsletterSnapshot = await getDocsMetered("getNewsletters", q);
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
            isLive: data.isLive === true, // default to false
        } as Newsletter;
    });
}

export async function getNewsletter(id: string): Promise<Newsletter | null> {
    const docRef = doc(db, "newsletters", id);
    const docSnap = await getDocMetered("getNewsletter", docRef);

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
            isLive: data.isLive === true, // default to false
        } as Newsletter;
    } else {
        return null;
    }
}

export async function addNewsletter(data: { name: string; subject: string }, user: string) {
    const newslettersCol = collection(db, 'newsletters');
    const docRef = await addDoc(newslettersCol, {
        ...data,
        components: [],
        content: ``, // Start with empty content
        lastUpdated: Timestamp.now(),
        useWrapper: true,
        isLive: false,
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
        isLive: false, // Duplicates are always drafts
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
export async function addCampaign(data: any, user: string) {
    const campaignsCol = collection(db, 'campaigns');
    await addDoc(campaignsCol, {
        ...data,
        sentAt: Timestamp.now()
    });
    await addLog(user, 'Kampagne erstellt', `Newsletter: ${data.newsletterName}`);
}

// --- EXCERPTS ---

async function initializeExcerpts() {
    const excerptsCol = collection(db, 'excerpts');
    const snapshot = await getDocsMetered("initializeExcerpts", query(excerptsCol));

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
    const excerptsCol = collection(db, 'excerpts');
    const q = query(excerptsCol, orderBy("chapterNumber", "asc"));
    const excerptSnapshot = await getDocsMetered("getExcerpts", q);
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
    const docSnap = await getDocMetered("getExcerpt", docRef);

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
    const snapshot = await getDocsMetered("getPalabrotas", q);
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
    const snapshot = await getDocsMetered("getChistes", q);
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
    const snapshot = await getDocsMetered("getCollectionData", q);
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
    const storage = getStorage(app);
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

// --- SEO ---
export async function getSeoMetadata(slug: string): Promise<SeoMetadata | null> {
    const docRef = doc(db, 'seo_metadata', slug);
    const docSnap = await getDocMetered("getSeoMetadata", docRef);
    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as SeoMetadata;
    }
    return null;
}

export async function getAllSeoMetadata(): Promise<SeoMetadata[]> {
    const collectionRef = collection(db, 'seo_metadata');
    const snapshot = await getDocsMetered("getAllSeoMetadata", collectionRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SeoMetadata));
}

export async function updateSeoMetadata(slug: string, data: Partial<SeoMetadata>, user: string) {
    const docRef = doc(db, 'seo_metadata', slug);
    await setDoc(docRef, data, { merge: true });
    await addLog(user, 'SEO Metadaten aktualisiert', `Seite: ${slug}`);
}

// --- ANALYTICS ---
export async function logAnalyticsEvent(type: string, path: string, userId: string, params: object = {}) {
    try {
        const eventsCol = collection(db, 'analytics_events');
        await addDoc(eventsCol, {
            type,
            path,
            userId,
            params,
            timestamp: Timestamp.now(),
        });
    } catch (e) {
        console.error("Error logging analytics event:", e);
    }
}

export interface AnalyticsEventRecord {
    type: string;
    timestamp: Date;
    path?: string;
    userId?: string;
    params?: { [key: string]: any };
}

/**
 * Reads, once, the events the admin analytics page needs: every page view and
 * the newsletter subscriptions since `since`. Every statistic on that page is
 * computed from this list (see analytics-aggregation.ts), instead of one
 * query per statistic.
 */
export async function loadAnalyticsEvents(since: Date): Promise<AnalyticsEventRecord[]> {
    const eventsCol = collection(db, 'analytics_events');
    const [pageViews, newsletters] = await Promise.all([
        getDocsMetered("loadAnalyticsPageViews", query(eventsCol, where('type', '==', 'page_view'))),
        getDocsMetered("loadAnalyticsNewsletterEvents", query(
            eventsCol,
            where('type', '==', 'newsletter_subscription'),
            where('timestamp', '>=', since)
        )),
    ]);

    return [...pageViews.docs, ...newsletters.docs].map(snapshot => {
        const data = snapshot.data();
        return {
            type: data.type as string,
            timestamp: (data.timestamp as Timestamp).toDate(),
            path: data.path,
            userId: data.userId,
            params: data.params,
        };
    });
}

export type SerializedAnalyticsEvent = Omit<AnalyticsEvent, 'timestamp'> & { timestamp: string };

export async function getRecentEvents(limit = 20): Promise<SerializedAnalyticsEvent[]> {
    const eventsCol = collection(db, 'analytics_events');
    const q = query(eventsCol, orderBy('timestamp', 'desc'), where('type', '==', 'page_view'), limitTo(limit));
    const snapshot = await getDocsMetered("getRecentEvents", q);

    return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            timestamp: (data.timestamp as Timestamp).toDate().toISOString(),
        } as SerializedAnalyticsEvent;
    });
}

export async function addSubscriber(data: { email: string; source: string; }) {
    const subscribersCol = collection(db, 'subscribers');
    // Check if email already exists to avoid duplicates
    const q = query(subscribersCol, where("email", "==", data.email));
    const snapshot = await getDocsMetered("addSubscriber", q);
    if (!snapshot.empty) {
        console.log(`Subscriber with email ${data.email} already exists in Firestore.`);
        return; // Don't add duplicate
    }
    
    await addDoc(subscribersCol, {
        ...data,
        subscribedAt: Timestamp.now()
    });
}

