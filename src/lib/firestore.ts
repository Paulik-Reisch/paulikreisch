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

export interface LegalPage {
    id: string;
    title: string;
    content: string;
    lastUpdated: string;
}

export interface NewsletterComponent {
    id: string;
    type: 'heading' | 'text' | 'button' | 'image';
    props: {
        [key: string]: string;
    };
}

export interface Newsletter {
    id: string;
    name: string;
    subject: string;
    components: NewsletterComponent[];
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
            content: data.content,
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
            content: data.content,
            lastUpdated: lastUpdated ? (lastUpdated as Timestamp).toDate().toISOString() : new Date().toISOString(),
        } as LegalPage;
    } else {
        return null;
    }
}

export async function addLegalPage(pageId: string, data: { title: string; content: string }) {
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


export async function updateLegalPage(pageId: string, data: { title: string, content: string }) {
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
        lastUpdated: Timestamp.now(),
    });
    return docRef.id;
}

export async function updateNewsletter(id: string, data: Partial<Omit<Newsletter, 'id'>>) {
    const newsletterRef = doc(db, 'newsletters', id);
    await updateDoc(newsletterRef, {
        ...data,
        lastUpdated: Timestamp.now(),
    });
}

export async function deleteNewsletter(id: string) {
    const newsletterRef = doc(db, 'newsletters', id);
    await deleteDoc(newsletterRef);
}