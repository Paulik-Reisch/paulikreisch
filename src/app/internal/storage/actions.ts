"use server";

import { getStorage, ref, deleteObject, getDownloadURL } from "firebase/storage";
import { app } from "@/app/firebase";
import { getSession } from "@/lib/session";
import { addLog } from "@/lib/firestore";
import { revalidatePath } from "next/cache";

// This action creates a signed URL for uploading a file.
export async function getUploadUrlAction(fileName: string, fileType: string) {
    const session = await getSession();
    if (!session) {
      return { error: "Nicht authentifiziert" };
    }
    
    try {
        // This is a client-side operation, but for the sake of the action,
        // we'll log it. The actual upload will happen on the client.
        await addLog(session.user.id, 'Storage: Upload-URL angefordert', `Datei: ${fileName}`);
        // In a client-side SDK scenario, we don't generate a signed URL on the server like this.
        // The client will directly upload to a path. This action now just serves as a log endpoint.
        // We will return a placeholder or handle the logic differently on the client.
        // For now, let's return an error to indicate this flow is not supported.
        return { error: "Serverseitige Upload-URL-Erstellung wird nicht unterstützt. Bitte clientseitig implementieren." };

    } catch (e: any) {
        console.error("Error with upload placeholder:", e);
        return { error: "Upload-Vorbereitung fehlgeschlagen: " + e.message };
    }
}


// This action creates a temporary download URL.
export async function getDownloadUrlAction(filePath: string) {
     const session = await getSession();
    if (!session) {
      return { error: "Nicht authentifiziert" };
    }

    try {
        const storage = getStorage(app);
        const fileRef = ref(storage, filePath);
        const url = await getDownloadURL(fileRef);
        return { url };
    } catch (e: any) {
        return { error: 'Konnte keine Download-URL abrufen: ' + e.message };
    }
}

export async function deleteFileAction(filePath: string) {
  const session = await getSession();
  if (!session) {
    return { success: false, error: "Nicht authentifiziert" };
  }

  try {
    const storage = getStorage(app);
    const fileRef = ref(storage, filePath);
    await deleteObject(fileRef);
    
    await addLog(session.user.id, 'Storage: Datei gelöscht', `Pfad: ${filePath}`);
    revalidatePath('/internal/isdm/storage');
    return { success: true };

  } catch (error: any) {
    console.error("Error deleting file:", error);
    return { success: false, error: error.message };
  }
}
