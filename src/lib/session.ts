import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
import type { SessionData } from '@/types/oidc';
import { getSessionSecret, SESSION_COOKIE_NAME } from './config';

/**
 * Create a new session and set it as a cookie
 */
export async function createSession(sessionData: SessionData): Promise<void> {
  const secret = new TextEncoder().encode(getSessionSecret());
  
  const token = await new SignJWT(sessionData)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(sessionData.expiresAt)
    .sign(secret);

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: sessionData.expiresAt - Math.floor(Date.now() / 1000),
    path: '/',
  });
}

/**
 * Get session data from cookie
 */
export async function getSession(): Promise<SessionData | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME);

  if (!token) {
    return null;
  }

  try {
    const secret = new TextEncoder().encode(getSessionSecret());
    const { payload } = await jwtVerify(token.value, secret);
    return payload as unknown as SessionData;
  } catch (error) {
    console.error('Failed to verify session:', error);
    return null;
  }
}

/**
 * Delete session cookie
 */
export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

/**
 * Check if session is valid and not expired
 */
export async function isSessionValid(): Promise<boolean> {
  const session = await getSession();
  
  if (!session) {
    return false;
  }

  const now = Math.floor(Date.now() / 1000);
  return session.expiresAt > now;
}
