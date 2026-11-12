'use client';

import { useState } from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { LogOut } from 'lucide-react';
import { app } from '@/app/firebase';
import { Button } from '@/components/ui/button';
import { completeLogout } from '@/lib/complete-logout';
import { logoutAction } from './actions';

export function LogoutButton() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function logout() {
    setPending(true);
    setError(null);
    try {
      await completeLogout(() => signOut(getAuth(app)), logoutAction);
    } catch (cause) {
      console.error('Admin logout failed', cause);
      setError('Abmelden fehlgeschlagen. Bitte erneut versuchen.');
      setPending(false);
    }
  }

  return (
    <div className="relative shrink-0">
      <form action={logout}>
        <Button type="submit" variant="outline" size="sm" disabled={pending}>
          <LogOut className="mr-2 h-4 w-4" />
          {pending ? 'Abmelden…' : 'Abmelden'}
        </Button>
      </form>
      {error && <p role="alert" className="absolute right-0 top-full z-50 mt-2 w-64 max-w-[calc(100vw-2rem)] rounded-md border bg-background p-3 text-sm text-destructive shadow-md">{error}</p>}
    </div>
  );
}
