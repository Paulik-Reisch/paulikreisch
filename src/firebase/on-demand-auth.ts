'use client';

import { signInAnonymously, signOut, type Auth, type User } from 'firebase/auth';
import { createOnDemandSignIn } from '@/lib/on-demand-auth';

/** Only call from an explicit Worthaft feedback or suggestion submission. */
export const ensureWorthaftAuth = createOnDemandSignIn<Auth, User>(
  auth => auth.authStateReady(),
  auth => auth.currentUser,
  async auth => (await signInAnonymously(auth)).user,
  async (auth, user) => {
    if (!user.isAnonymous) return user;
    try {
      // Deleted anonymous accounts can still be cached in the visitor's browser.
      // Verify them only on submission, never on ordinary visits.
      await user.getIdToken(true);
      return auth.currentUser;
    } catch (error) {
      const code = (error as { code?: string }).code;
      if (
        ![
          'auth/user-token-expired',
          'auth/user-not-found',
          'auth/invalid-user-token',
          // Blockierte/instabile Verbindung zum Token-Refresh: gecachten
          // anonymen Account verwerfen und frisch anmelden, statt hart abzubrechen.
          'auth/network-request-failed',
          'auth/internal-error',
        ].includes(code ?? '')
      )
        throw error;
      if (auth.currentUser?.uid === user.uid) await signOut(auth);
      return auth.currentUser;
    }
  },
);
