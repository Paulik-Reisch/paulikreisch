import 'server-only';

import { Timestamp, type DocumentData } from 'firebase-admin/firestore';
import { getAdminDb } from '@/lib/firebase-admin';
import type {
  Author,
  LandingPage,
  Newsletter,
  LegalPage,
  Excerpt,
  SeoMetadata,
} from '@/lib/firestore';

/**
 * Admin-Schreibzugriffe ueber das Firebase Admin SDK. Das Admin SDK umgeht die
 * Firestore-Security-Rules und darf deshalb NUR aus Server Actions mit
 * bestehendem getSession()-Guard (oder server-only Modulen) aufgerufen werden.
 * Signaturen spiegeln die bisherigen Funktionen aus @/lib/firestore.
 */

// --- LOGGING ---
export async function addAdminLog(user: string, action: string, details: string) {
    try {
        const logsCol = getAdminDb().collection('logs');
        await logsCol.add({
            user,
            action,
            details,
            timestamp: Timestamp.now(),
        });
    } catch (e) {
        console.error("Error writing log:", e);
    }
}

// --- AUTHORS ---
export async function addAuthor(authorData: Omit<Author, 'id'>, user: string): Promise<string> {
    const slug = authorData.slug || `${authorData.firstName}-${authorData.lastName}`.toLowerCase().replace(/\s+/g, '-');
    const docRef = getAdminDb().collection('authors').doc(slug);

    const docSnap = await docRef.get();
    if (docSnap.exists) {
        throw new Error(`Autor-Slug "${slug}" existiert bereits.`);
    }

    await docRef.set({ ...authorData, slug });
    await addAdminLog(user, 'Autor erstellt', `Slug: ${slug}`);
    return slug;
}

export async function updateAuthor(originalSlug: string, dataToUpdate: Partial<Omit<Author, 'id'>>, user: string) {
    const { slug: newSlug, ...restData } = dataToUpdate;

    if (!newSlug || originalSlug === newSlug) {
        const docRef = getAdminDb().collection('authors').doc(originalSlug);
        await docRef.update(restData);
        await addAdminLog(user, 'Autor aktualisiert', `Slug: ${originalSlug}`);
    } else {
        const oldDocRef = getAdminDb().collection('authors').doc(originalSlug);
        const newDocRef = getAdminDb().collection('authors').doc(newSlug);

        const newDocSnap = await newDocRef.get();
        if (newDocSnap.exists) {
            throw new Error(`Autor-Slug "${newSlug}" existiert bereits.`);
        }

        const oldDocSnap = await oldDocRef.get();
        if (!oldDocSnap.exists) {
             throw new Error(`Originalautor mit Slug "${originalSlug}" nicht gefunden.`);
        }

        const oldData = oldDocSnap.data();
        const batch = getAdminDb().batch();

        const newData = {
            ...oldData,
            ...dataToUpdate,
        };

        batch.set(newDocRef, newData);
        batch.delete(oldDocRef);

        await batch.commit();
        await addAdminLog(user, 'Autor verschoben/aktualisiert', `Von ${originalSlug} zu ${newSlug}`);
    }
}

export async function deleteAuthor(slug: string, user: string) {
    const docRef = getAdminDb().collection('authors').doc(slug);
    await docRef.delete();
    await addAdminLog(user, 'Autor gelöscht', `Slug: ${slug}`);
}

// --- LANDING PAGES ---
export async function addLandingPage(pageData: Omit<LandingPage, 'id' | 'lastUpdated'>, user: string): Promise<string> {
    const slug = pageData.slug || pageData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const docRef = getAdminDb().collection('landing_pages').doc(slug);

    const docSnap = await docRef.get();
    if (docSnap.exists) {
        throw new Error(`Landing Page mit Slug "${slug}" existiert bereits.`);
    }

    const dataWithTimestamp = {
        ...pageData,
        slug,
        lastUpdated: Timestamp.now(),
    };
    await docRef.set(dataWithTimestamp);
    await addAdminLog(user, 'Landing Page erstellt', `Slug: ${slug}`);
    return slug;
}

export async function updateLandingPage(slug: string, dataToUpdate: Partial<Omit<LandingPage, 'id' | 'lastUpdated'>>, user: string) {
    const docRef = getAdminDb().collection('landing_pages').doc(slug);

    // If slug is being changed, we need to move the document
    if (dataToUpdate.slug && dataToUpdate.slug !== slug) {
        const newDocRef = getAdminDb().collection('landing_pages').doc(dataToUpdate.slug);
        const oldDocSnap = await docRef.get();
        if (oldDocSnap.exists) {
            const batch = getAdminDb().batch();
            const newData = {
                ...oldDocSnap.data(),
                ...dataToUpdate,
                lastUpdated: Timestamp.now()
            };
            batch.set(newDocRef, newData);
            batch.delete(docRef);
            await batch.commit();
            await addAdminLog(user, 'Landing Page Slug geändert', `Von ${slug} zu ${dataToUpdate.slug}`);
        }
    } else {
         await docRef.update({
            ...dataToUpdate,
            lastUpdated: Timestamp.now(),
        });
        await addAdminLog(user, 'Landing Page aktualisiert', `Slug: ${slug}`);
    }
}

export async function deleteLandingPage(slug: string, user: string) {
    const docRef = getAdminDb().collection('landing_pages').doc(slug);
    await docRef.delete();
    await addAdminLog(user, 'Landing Page gelöscht', `Slug: ${slug}`);
}

// --- NEWSLETTER ---
async function getNewsletterAdmin(id: string): Promise<Newsletter | null> {
    const docRef = getAdminDb().collection('newsletters').doc(id);
    const docSnap = await docRef.get();
    if (!docSnap.exists) return null;
    const data = docSnap.data() as DocumentData;
    return {
        id: docSnap.id,
        ...data,
        lastUpdated: (data.lastUpdated as Timestamp)?.toDate().toISOString(),
    } as Newsletter;
}

export async function addNewsletter(data: { name: string; subject: string }, user: string) {
    const newslettersCol = getAdminDb().collection('newsletters');
    const docRef = await newslettersCol.add({
        ...data,
        components: [],
        content: ``, // Start with empty content
        lastUpdated: Timestamp.now(),
        useWrapper: true,
        isLive: false,
    });
    await addAdminLog(user, 'Newsletter erstellt', `Name: ${data.name}`);
    return docRef.id;
}

export async function duplicateNewsletter(id: string, user: string): Promise<string> {
    const originalNewsletter = await getNewsletterAdmin(id);
    if (!originalNewsletter) {
        throw new Error("Original newsletter not found.");
    }

    const newName = `Kopie von ${originalNewsletter.name}`;
    const newSubject = originalNewsletter.subject;

    const newNewsletterRef = await getAdminDb().collection('newsletters').add({
        name: newName,
        subject: newSubject,
        components: originalNewsletter.components,
        content: originalNewsletter.content,
        lastUpdated: Timestamp.now(),
        useWrapper: originalNewsletter.useWrapper,
        isLive: false, // Duplicates are always drafts
    });

    await addAdminLog(user, 'Newsletter dupliziert', `Neue Kopie von '${originalNewsletter.name}'`);
    return newNewsletterRef.id;
}

export async function updateNewsletter(id: string, data: Partial<Omit<Newsletter, 'id'>>, user: string) {
    const newsletterRef = getAdminDb().collection('newsletters').doc(id);

    await newsletterRef.update({
        ...data,
        lastUpdated: Timestamp.now(),
    });
    await addAdminLog(user, 'Newsletter aktualisiert', `ID: ${id}`);
}

export async function deleteNewsletter(id: string, user: string) {
    const newsletterRef = getAdminDb().collection('newsletters').doc(id);
    await newsletterRef.delete();
    await addAdminLog(user, 'Newsletter gelöscht', `ID: ${id}`);
}

// --- CAMPAIGNS ---
export async function addCampaign(data: any, user: string) {
    const campaignsCol = getAdminDb().collection('campaigns');
    await campaignsCol.add({
        ...data,
        sentAt: Timestamp.now()
    });
    await addAdminLog(user, 'Kampagne erstellt', `Newsletter: ${data.newsletterName}`);
}

// --- LEGAL PAGES ---
export async function updateLegalPage(pageId: string, data: Partial<Omit<LegalPage, 'id'>>, user: string) {
    const pageRef = getAdminDb().collection('legal').doc(pageId);
    await pageRef.update({
        ...data,
        lastUpdated: Timestamp.now(),
    });
    await addAdminLog(user, 'LP aktualisiert', `Seite: /${pageId}`);
}

// --- EXCERPTS ---
export async function updateExcerpt(slug: string, data: Partial<Omit<Excerpt, 'id'>>, user: string) {
    const docRef = getAdminDb().collection('excerpts').doc(slug);
    await docRef.update({
        ...data,
        lastUpdated: Timestamp.now(),
    });
    await addAdminLog(user, 'Exzerpt aktualisiert', `Slug: ${slug}, Änderungen: ${Object.keys(data).join(', ')}`);
}

// --- SEO ---
export async function updateSeoMetadata(slug: string, data: Partial<SeoMetadata>, user: string) {
    const docRef = getAdminDb().collection('seo_metadata').doc(slug);
    await docRef.set(data, { merge: true });
    await addAdminLog(user, 'SEO Metadaten aktualisiert', `Seite: ${slug}`);
}

// --- GENERIC DB (internes Admin-Tool + Funnel-Queue) ---
export async function getCollectionData(collectionId: string): Promise<any[]> {
    const snapshot = await getAdminDb().collection(collectionId).orderBy('__name__').get();
    return snapshot.docs.map(docSnap => {
        const data = docSnap.data();
        // Convert Timestamps to ISO strings for serialization
        Object.keys(data).forEach(key => {
            if (data[key] instanceof Timestamp) {
                data[key] = (data[key] as Timestamp).toDate().toISOString();
            }
        });
        return { id: docSnap.id, ...data };
    });
}

export async function updateDocument(collectionId: string, documentId: string, data: any, user: string) {
    const docRef = getAdminDb().collection(collectionId).doc(documentId);
    await docRef.update(data);
    await addAdminLog(user, `Dokument aktualisiert in '${collectionId}'`, `ID: ${documentId}`);
}

export async function addDocument(collectionId: string, data: any, user: string) {
    const colRef = getAdminDb().collection(collectionId);
    const newDoc = await colRef.add(data);
    await addAdminLog(user, `Dokument hinzugefügt zu '${collectionId}'`, `Neue ID: ${newDoc.id}`);
}

export async function deleteDocument(collectionId: string, documentId: string, user: string) {
    const docRef = getAdminDb().collection(collectionId).doc(documentId);
    await docRef.delete();
    await addAdminLog(user, `Dokument gelöscht aus '${collectionId}'`, `ID: ${documentId}`);
}
