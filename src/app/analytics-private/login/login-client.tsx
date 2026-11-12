'use client';
import { useState, useTransition } from 'react';
import { analyticsLoginAction } from '../actions';
import { Button } from '@/components/ui/button';
export function AnalyticsLoginClient() {
  const [error, setError] = useState('');
  const [pending, start] = useTransition();
  return <form className="space-y-5" onSubmit={event => {
    event.preventDefault(); setError('');
    const form = new FormData(event.currentTarget);
    const email = String(form.get('email') ?? ''); const password = String(form.get('password') ?? '');
    start(async () => {
      let token: string;
      try {
        const [{ getAuth, signInWithEmailAndPassword, setPersistence, inMemoryPersistence, signOut }, { app }] = await Promise.all([import('firebase/auth'), import('@/app/firebase')]);
        const auth = getAuth(app);
        await setPersistence(auth, inMemoryPersistence);
        const credential = await signInWithEmailAndPassword(auth, email, password);
        token = await credential.user.getIdToken();
        await signOut(auth);
      } catch { setError('Anmeldung fehlgeschlagen. Bitte Zugang und Freigabe dieser Adresse prüfen.'); return; }
      const result = await analyticsLoginAction(token);
      if (result.error) setError(result.error);
    });
  }}>
    <label className="block text-sm font-medium">E-Mail<input name="email" type="email" required autoComplete="username" disabled={pending} className="mt-2 block w-full rounded-lg border bg-background p-3 text-foreground" /></label>
    <label className="block text-sm font-medium">Passwort<input name="password" type="password" required autoComplete="current-password" disabled={pending} className="mt-2 block w-full rounded-lg border bg-background p-3 text-foreground" /></label>
    {error && <p role="alert" className="rounded-lg border border-red-400 p-3 text-sm">{error}</p>}
    <Button className="w-full" type="submit" disabled={pending}>{pending ? 'Wird angemeldet …' : 'Bei Analytics anmelden'}</Button>
  </form>;
}
