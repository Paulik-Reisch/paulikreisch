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
    setDoc
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
    timestamp: Timestamp;
}

export interface LegalPage {
    id: string;
    title: string;
    content: string;
    lastUpdated: Timestamp;
}

const db = getFirestore(app);

export async function getProducts(): Promise<Product[]> {
    const productsCol = collection(db, 'products');
    const productSnapshot = await getDocs(productsCol);
    const productList = productSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
    return productList;
}

export async function updateProduct(productId: string, data: Partial<Product>) {
    const productRef = doc(db, 'products', productId);
    await updateDoc(productRef, data);
}

export async function getOrders(): Promise<Order[]> {
    const ordersCol = collection(db, 'orders');
    const q = query(ordersCol, orderBy("timestamp", "desc"));
    const orderSnapshot = await getDocs(q);
    const orderList = orderSnapshot.docs.map(doc => {
        const data = doc.data();
        return { 
            id: doc.id, 
            ...data,
            timestamp: (data.timestamp as Timestamp)
        } as Order;
    });
    return orderList;
}

export async function addOrder(orderData: any) {
    const ordersCol = collection(db, 'orders');
    // Firestore automatically converts JS Date objects to Timestamps
    const dataWithTimestamp = {
        ...orderData,
        timestamp: new Date(orderData.timestamp)
    };
    await addDoc(ordersCol, dataWithTimestamp);
}

// --- Legal Pages CMS Functions ---

export async function getLegalPages(): Promise<LegalPage[]> {
    const legalCol = collection(db, 'legal_pages');
    const legalSnapshot = await getDocs(legalCol);
    if (legalSnapshot.empty) {
        // Optional: Seed initial data if collection is empty
        return [];
    }
    const pageList = legalSnapshot.docs.map(doc => {
        const data = doc.data();
        return { 
            id: doc.id, 
            ...data,
            lastUpdated: (data.lastUpdated as Timestamp)
        } as LegalPage;
    });
    return pageList;
}

export async function getLegalPage(slug: string): Promise<LegalPage | null> {
    const docRef = doc(db, "legal_pages", slug);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const data = docSnap.data();
        return {
            id: docSnap.id,
            ...data,
            lastUpdated: (data.lastUpdated as Timestamp)
        } as LegalPage;
    } else {
        // Fallback content if document doesn't exist yet
        return {
            id: slug,
            title: `Seite "${slug}" nicht gefunden`,
            content: "Dieser Inhalt wurde noch nicht im Admin-Bereich erstellt. Bitte fügen Sie ihn dort hinzu.",
            lastUpdated: Timestamp.now()
        };
    }
}


export async function updateLegalPage(pageId: string, data: { title: string, content: string }) {
    const pageRef = doc(db, 'legal_pages', pageId);
    await setDoc(pageRef, { 
        ...data,
        lastUpdated: Timestamp.now() 
    }, { merge: true });
}