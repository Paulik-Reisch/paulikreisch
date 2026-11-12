import { SignJWT, jwtVerify } from 'jose';
import { ANALYTICS_HOST } from './management-hosts';
export async function encodeAnalyticsSession(email: string, key: Uint8Array, now = new Date()): Promise<string> {
  const issued = Math.floor(now.getTime() / 1000);
  return new SignJWT({ email }).setProtectedHeader({ alg: 'HS256' }).setAudience(ANALYTICS_HOST)
    .setIssuedAt(issued).setExpirationTime(issued + 24 * 60 * 60).sign(key);
}
export async function decodeAnalyticsSession(input: string, key: Uint8Array, now = new Date()): Promise<{ email: string } | null> {
  try {
    const { payload } = await jwtVerify(input, key, { algorithms: ['HS256'], audience: ANALYTICS_HOST, currentDate: now });
    return typeof payload.email === 'string' && payload.email.length > 0 ? { email: payload.email } : null;
  } catch { return null; }
}
