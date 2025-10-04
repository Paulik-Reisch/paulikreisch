"use server";

import { getStorage, ref, deleteObject, getDownloadURL } from "firebase-admin/storage";
import { getApp } from "firebase-admin/app";
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
        const bucket = getStorage(getApp()).bucket();
        const file = bucket.file(fileName);

        const [url] = await file.getSignedUrl({
            version: 'v4',
            action: 'write',
            expires: Date.now() + 15 * 60 * 1000, // 15 minutes
            contentType: fileType,
        });

        await addLog(session.user.id, 'Storage: Upload-URL angefordert', `Datei: ${fileName}`);
        return { url };
    } catch (e: any) {
        console.error("Error creating signed upload URL:", e);
        return { error: "Upload-URL konnte nicht erstellt werden: " + e.message };
    }
}


// This action creates a temporary download URL.
export async function getDownloadUrlAction(filePath: string) {
     const session = await getSession();
    if (!session) {
      return { error: "Nicht authentifiziert" };
    }

    try {
        const bucket = getStorage(getApp()).bucket();
        const file = bucket.file(filePath);
        
        const [url] = await file.getSignedUrl({
            action: 'read',
            expires: Date.now() + 60 * 60 * 1000, // 1 hour
        });
        
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
    const bucket = getStorage(getApp()).bucket();
    const file = bucket.file(filePath);
    await file.delete();
    
    await addLog(session.user.id, 'Storage: Datei gelöscht', `Pfad: ${filePath}`);
    revalidatePath('/internal/isdm/storage');
    return { success: true };

  } catch (error: any) {
    console.error("Error deleting file:", error);
    return { success: false, error: error.message };
  }
}
