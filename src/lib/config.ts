/**
 * Get the session secret from environment variable
 * Throws an error in production if not set
 */
export function getSessionSecret(): string {
  const secret = process.env.NEXTAUTH_SECRET;
  
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('NEXTAUTH_SECRET environment variable is required in production');
    }
    console.warn('NEXTAUTH_SECRET not set. Using default for development only.');
    return 'default-secret-change-this-for-development-only';
  }
  
  return secret;
}

export const SESSION_COOKIE_NAME = 'oidc_session';
