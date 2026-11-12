import 'server-only';
import {getStorage} from 'firebase-admin/storage';
import { getApps, initializeApp, applicationDefault, type App } from 'firebase-admin/app';
import { getAuth, type Auth } from 'firebase-admin/auth';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';

/**
 * Server-seitiges Firebase Admin SDK. Laueft auf Firebase App Hosting mit der
 * dortigen Standard-Credential (Application Default Credentials) - kein
 * Service-Account-Key noetig. Umgeht die Firestore-Security-Rules und ist
 * deshalb ausschliesslich in Server Actions / server-only Modulen zu verwenden.
 */
function getAdminApp(): App {
  const existing = getApps();
  if (existing.length > 0) return existing[0];
  return initializeApp({ credential: applicationDefault() });
}

export function getAdminAuth(): Auth {
  return getAuth(getAdminApp());
}

export function getAdminDb(): Firestore {
  return getFirestore(getAdminApp());
}

export function getAdminStorage() { return getStorage(getAdminApp()); }
