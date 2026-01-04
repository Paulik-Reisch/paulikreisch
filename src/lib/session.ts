
import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secretKey = process.env.SESSION_SECRET || 'fallback-secret-key-for-development';
if (process.env.NODE_ENV === 'production' && secretKey === 'fallback-secret-key-for-development') {
    console.warn('Warning: Using fallback session secret in production. Please set a strong SESSION_SECRET environment variable.');
}
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    // This can happen if the token is invalid or expired
    console.error('Failed to decrypt session:', error);
    return null;
  }
}

export async function getSession() {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get("session");
  
  if (!sessionCookie?.value) return null;
  
  const decrypted = await decrypt(sessionCookie.value);
  if (!decrypted) return null;

  // Validate expires
  if (new Date(decrypted.expires) < new Date()) {
      return null;
  }

  return { user: { id: decrypted.user.id }, expires: decrypted.expires };
}
