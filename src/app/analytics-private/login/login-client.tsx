'use client';
import { useState, useTransition } from 'react';
import { analyticsLoginAction } from '../actions';
import {PasswordInput} from '@/components/ui/password-input';
import {loginFailureMessage} from '@/lib/login-errors';
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
      } catch(error) { setError(loginFailureMessage(error)); return; }
      const result = await analyticsLoginAction(token);
      if (result.error) setError(result.error);
    });
  }}>
    <label className="block text-sm font-medium">E-Mail<input name="email" type="email" required autoComplete="username" disabled={pending} className="mt-2 block w-full rounded-lg border bg-background p-3 text-foreground" /></label>
    <div><label htmlFor="analytics-password" className="block text-sm font-medium mb-2">Passwort</label><PasswordInput id="analytics-password" name="password" required autoComplete="current-password" disabled={pending} className="block w-full rounded-lg border bg-background p-3 text-foreground" /></div>
    {error && <p role="alert" className="rounded-lg border border-red-400 p-3 text-sm">{error}</p>}
    <Button className="w-full" type="submit" disabled={pending}>{pending ? 'Wird angemeldet …' : 'Bei Analytics anmelden'}</Button>
  </form>;
}
