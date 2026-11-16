'use client';

import { signInAnonymously, signOut, type Auth, type User } from 'firebase/auth';
import { createDiagnosedWorthaftAuth } from '@/lib/worthaft-diagnosed-auth';

/** Only call from an explicit Worthaft feedback or suggestion submission. */
export const ensureWorthaftAuth = createDiagnosedWorthaftAuth<Auth, User>({
  ready: auth => auth.authStateReady(),
  currentUser: auth => auth.currentUser,
  signIn: async auth => (await signInAnonymously(auth)).user,
  isAnonymous: user => user.isAnonymous,
  sameUser: (a, b) => a.uid === b.uid,
  refresh: user => user.getIdToken(true),
  signOut,
});
