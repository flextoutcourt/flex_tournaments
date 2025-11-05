import { auth } from './auth';
import { AuthenticationError, AuthorizationError } from './errors';
import type { Session } from 'next-auth';

/**
 * Extended session with user details
 */
export interface AuthSession extends Session {
  user: {
    id: string;
    email: string;
    name?: string | null;
    role: string;
  };
}

/**
 * Require authentication - throws AuthenticationError if not authenticated
 */
export async function requireAuth(): Promise<AuthSession> {
  const session = await auth();
  
  if (!session || !session.user) {
    throw new AuthenticationError('Vous devez être connecté pour effectuer cette action.');
  }

  return session as AuthSession;
}

/**
 * Require admin role - throws AuthorizationError if not admin
 */
export async function requireAdmin(): Promise<AuthSession> {
  const session = await requireAuth();
  
  if (session.user.role !== 'ADMIN') {
    throw new AuthorizationError(
      "Vous devez être administrateur pour effectuer cette action."
    );
  }

  return session;
}

/**
 * Check if user is authenticated (returns null if not)
 */
export async function getAuthSession(): Promise<AuthSession | null> {
  const session = await auth();
  return session && session.user ? (session as AuthSession) : null;
}
