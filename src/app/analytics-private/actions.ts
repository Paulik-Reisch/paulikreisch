'use server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getAdminAuth } from '@/lib/firebase-admin';
import { isAdminEmail } from '@/lib/admin-allowlist';
import { ANALYTICS_COOKIE, analyticsSessionKey, assertAnalyticsOrigin } from '@/lib/analytics-session';
import { encodeAnalyticsSession } from '@/lib/analytics-session-token';
export type AnalyticsLoginResult = { error: string | null };
export async function analyticsLoginAction(idToken: string): Promise<AnalyticsLoginResult> {
  await assertAnalyticsOrigin();
  if (typeof idToken !== 'string' || idToken.length < 1 || idToken.length > 16000) return { error: 'Anmeldung unvollständig.' };
  let email: string;
  try {
    const decoded = await getAdminAuth().verifyIdToken(idToken, true);
    if (!decoded.email || decoded.email_verified !== true || !isAdminEmail(decoded.email)
      || typeof decoded.auth_time !== 'number' || Date.now() / 1000 - decoded.auth_time > 300) {
      return { error: 'Dieses Konto ist nicht freigegeben oder die Anmeldung ist zu alt.' };
    }
    email = decoded.email;
  } catch { return { error: 'Anmeldung konnte nicht bestätigt werden.' }; }
  const value = await encodeAnalyticsSession(email, analyticsSessionKey());
  (await cookies()).set(ANALYTICS_COOKIE, value, { httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 86400 });
  redirect('/');
}
export async function analyticsLogoutAction(): Promise<void> {
  await assertAnalyticsOrigin();
  (await cookies()).set(ANALYTICS_COOKIE, '', { httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 0 });
  redirect('/login');
}
