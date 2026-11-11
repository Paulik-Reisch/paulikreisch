
"use server";

import { z } from "zod";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { 
    getCollectionData,
    updateDocument,
    addDocument,
    deleteDocument,
} from "@/lib/admin-writes";

export type ActionResponse = {
    success: boolean;
    error?: string | null;
    message?: string;
};

const CollectionActionSchema = z.object({
  collectionId: z.string().min(1),
  documentId: z.string().min(1),
});

const UpdateActionSchema = z.object({
  collectionId: z.string().min(1),
  documentId: z.string().optional(), // optional for new documents
  payload: z.string(), // JSON string
});

export async function getCollectionDataAction(collectionId: string): Promise<any[]> {
    const session = await getSession();
    if (!session) {
        throw new Error("Nicht authentifiziert");
    }
    // No specific permissions check here, relies on Firestore rules for client-side fetching
    // But for a server action, this is okay as it's an internal tool for authenticated admins.
    return getCollectionData(collectionId);
}

export async function updateDocumentAction(formData: FormData): Promise<ActionResponse> {
    const session = await getSession();
    if (!session) {
        return { success: false, error: "Nicht authentifiziert" };
    }
    
    const validatedFields = UpdateActionSchema.safeParse(Object.fromEntries(formData.entries()));
    if (!validatedFields.success) {
        return { success: false, error: "Ungültige Eingabe." };
    }

    const { collectionId, documentId, payload } = validatedFields.data;

    try {
        const data = JSON.parse(payload);
        if (documentId) {
            // Update existing document
            await updateDocument(collectionId, documentId, data, session.user.id);
            revalidatePath(`/internal/isdm/database`);
            return { success: true, message: "Dokument erfolgreich aktualisiert." };
        } else {
            // Add new document
            await addDocument(collectionId, data, session.user.id);
            revalidatePath(`/internal/isdm/database`);
            return { success: true, message: "Dokument erfolgreich hinzugefügt." };
        }
    } catch (e: any) {
        console.error("Update/Add action error:", e);
        return { success: false, error: e.message };
    }
}


export async function deleteDocumentAction(formData: FormData): Promise<ActionResponse> {
    const session = await getSession();
    if (!session) {
        return { success: false, error: "Nicht authentifiziert" };
    }
    
    const validatedFields = CollectionActionSchema.safeParse(Object.fromEntries(formData.entries()));
     if (!validatedFields.success) {
        return { success: false, error: "Ungültige Eingabe." };
    }

    const { collectionId, documentId } = validatedFields.data;

    try {
        await deleteDocument(collectionId, documentId, session.user.id);
        revalidatePath(`/internal/isdm/database`);
        return { success: true, message: "Dokument erfolgreich gelöscht." };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}
