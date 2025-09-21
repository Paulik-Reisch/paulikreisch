import { LoginForm } from './login-form';
import { BookHeart } from 'lucide-react';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';

export default async function AdminLoginPage() {
  const session = await getSession();
  if (session) {
    redirect("/admin");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-md">
         <div className="flex flex-col items-center justify-center text-center mb-8">
            <BookHeart className="w-16 h-16 text-primary mb-4" />
            <h1 className="font-headline text-3xl font-bold">Admin-Bereich</h1>
            <p className="text-muted-foreground">Bitte authentifizieren Sie sich, um fortzufahren.</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
