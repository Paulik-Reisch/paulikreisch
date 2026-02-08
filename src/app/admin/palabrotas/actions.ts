
"use server";

import { z } from "zod";
import {
  addPalabrota,
  updatePalabrota,
  deletePalabrota,
} from "@/lib/firestore";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/session";
import { addLog } from "@/lib/firestore";

export type PalabrotaState = {
  success: boolean;
  error?: string | null;
  message?: string;
};

const PalabrotaSchema = z.object({
  id: z.string().optional(),
  de: z.string().min(1, "Deutsches Wort ist erforderlich."),
  es: z.string().min(1, "Spanisches Wort ist erforderlich."),
  wortart: z.string().min(1, "Wortart ist erforderlich."),
  anwendung: z.string().min(1, "Anwendung ist erforderlich."),
  synonyme: z.string().min(1, "Synonyme sind erforderlich."),
  beispiel: z.string().min(1, "Beispiel ist erforderlich."),
  pfeiferFaktor: z.coerce.number().min(0).max(5),
});

export async function savePalabrotaAction(
  prevState: PalabrotaState,
  formData: FormData
): Promise<PalabrotaState> {
  const session = await getSession();
  if (!session) {
    return { success: false, error: "Nicht authentifiziert" };
  }
  const validatedFields = PalabrotaSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    const errorMessages = validatedFields.error.errors.map((e) => e.message).join(". ");
    return { success: false, error: errorMessages };
  }
  
  const { id, ...data } = validatedFields.data;

  try {
    if (id) {
        // Update
        await updatePalabrota(id, data, session.user.id);
        revalidatePath("/admin/palabrotas");
        revalidatePath("/lp-palabrotas");
        return { success: true, message: "Wort erfolgreich aktualisiert." };
    } else {
        // Add
        await addPalabrota(data, session.user.id);
        revalidatePath("/admin/palabrotas");
        revalidatePath("/lp-palabrotas");
        return { success: true, message: "Wort erfolgreich hinzugefügt." };
    }
  } catch (e) {
    const error = e as Error;
    return { success: false, error: `Fehler: ${error.message}` };
  }
}

const DeletePalabrotaSchema = z.object({
  id: z.string(),
});

export async function deletePalabrotaAction(
  prevState: PalabrotaState,
  formData: FormData
): Promise<PalabrotaState> {
  const session = await getSession();
  if (!session) {
    return { success: false, error: "Nicht authentifiziert" };
  }
  const validatedFields = DeletePalabrotaSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return { success: false, error: "Ungültige ID." };
  }

  try {
    await deletePalabrota(validatedFields.data.id, session.user.id);
    revalidatePath("/admin/palabrotas");
    revalidatePath("/lp-palabrotas");
    return { success: true, message: "Wort erfolgreich gelöscht." };
  } catch (e) {
    const error = e as Error;
    return { success: false, error: `Fehler beim Löschen: ${error.message}` };
  }
}

const BulkAddPalabrotasSchema = z.object({
  wordList: z.string().min(1, "Die Wortliste darf nicht leer sein."),
});

export async function bulkAddPalabrotasAction(
  prevState: PalabrotaState,
  formData: FormData
): Promise<PalabrotaState> {
    const session = await getSession();
    if (!session) {
        return { success: false, error: "Nicht authentifiziert" };
    }
    const validatedFields = BulkAddPalabrotasSchema.safeParse(Object.fromEntries(formData.entries()));
    if (!validatedFields.success) {
        const errorMessages = validatedFields.error.errors.map((e) => e.message).join(". ");
        return { success: false, error: errorMessages };
    }

    try {
        const { wordList } = validatedFields.data;
        const pairs = wordList.split(';').map(p => p.trim()).filter(p => p);
        let addedCount = 0;

        for (const pair of pairs) {
            const parts = pair.split(' ').map(p => p.trim());
            if (parts.length >= 2) {
                const de = parts[0];
                const es = parts.slice(1).join(' '); // Spanish part can have spaces

                const newPalabrota = {
                    de,
                    es,
                    wortart: "N/A",
                    anwendung: "N/A",
                    synonyme: "N/A",
                    beispiel: "N/A",
                    pfeiferFaktor: 3,
                };
                await addPalabrota(newPalabrota, session.user.id);
                addedCount++;
            }
        }
        revalidatePath("/admin/palabrotas");
        revalidatePath("/lp-palabrotas");
        return { success: true, message: `${addedCount} Wörter erfolgreich per Massen-Import hinzugefügt.` };

    } catch (e) {
        const error = e as Error;
        return { success: false, error: `Fehler beim Massen-Import: ${error.message}` };
    }
}
