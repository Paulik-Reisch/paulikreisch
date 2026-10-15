
import { LoginForm } from './login-form';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';

function AdminIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" className="w-16 h-16 text-muted-foreground">
            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M23.02 14.06q.49-.05.983-.049c5.523 0 10 4.477 10 10s-4.477 10-10 10q-.493 0-.984-.048" strokeWidth="2" /><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M12.202 34.01q.316.37.655.72l-1.23 2.816a1.5 1.5 0 0 0 .458 1.788a19.4 19.4 0 0 0 4.631 2.65a1.5 1.5 0 0 0 1.766-.502l1.81-2.455a14.9 14.9 0 0 0 7.421 0l1.811 2.455a1.5 1.5 0 0 0 1.766.502a19.4 19.4 0 0 0 4.63-2.65a1.5 1.5 0 0 0 .46-1.788l-1.23-2.816a15.5 15.5 0 0 0 3.742-6.428l3.003-.338a1.5 1.5 0 0 0 1.315-1.263c.123-.804.28-1.693.287-2.686c.005-.993-.14-1.875-.25-2.67a1.5 1.5 0 0 0-1.32-1.285l-3.033-.34a15.5 15.5 0 0 0-3.73-6.459l1.22-2.795a1.5 1.5 0 0 0-.455-1.783a19.4 19.4 0 0 0-4.616-2.664a1.5 1.5 0 0 0-1.771.498l-1.809 2.451a15.16 15.16 0 0 0-7.441.028l-1.81-2.455a1.5 1.5 0 0 0-1.766-.502a19.4 19.4 0 0 0-4.631 2.65a1.5 1.5 0 0 0-.46 1.787l1.231 2.816q-.339.351-.654.72" strokeWidth="2" /><rect width="20" height="20" x="4.503" y="14.011" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" rx="2" ry="2" strokeWidth="2" /><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M17.134 25.98h-5.262m-1.304 3.866l3.935-11.671l3.935 11.67" strokeWidth="2" />
        </svg>
    )
}

export default async function AdminLoginPage() {
  const session = await getSession();
  if (session) {
    redirect("/admin");
  }

  return (
    <div className="internal-dashboard">
      <div className="flex min-h-screen flex-col items-center justify-center bg-muted/20 p-4">
        <div className="w-full max-w-md flex flex-col items-center text-center">
          <div className="flex flex-col items-center justify-center text-center mb-12">
              <AdminIcon />
              <h1 className="font-semibold text-2xl mt-4">Paulik &amp; Reisch</h1>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
