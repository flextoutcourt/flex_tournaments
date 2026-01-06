import { auth } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { AdminService } from '@/services/adminService';

/**
 * Middleware to protect admin routes
 */
export async function adminAuthMiddleware(_request: NextRequest) {
  try {
    const session = await auth();

    // Check if user is authenticated
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentification requise' },
        { status: 401 }
      );
    }

    // Check if user is admin
    const isAdmin = await AdminService.isAdmin(session.user.id);
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Accès admin requis' },
        { status: 403 }
      );
    }

    return null; // Allow request to proceed
  } catch (_error) {
    return NextResponse.json(
      { error: 'Erreur lors de la vérification des droits' },
      { status: 500 }
    );
  }
}

/**
 * Wrapper for API route handlers to check admin authorization
 */
export function withAdminAuth(handler: (request: NextRequest) => Promise<Response>) {
  return async (_request: NextRequest) => {
    const authResponse = await adminAuthMiddleware(_request);
    if (authResponse) {
      return authResponse;
    }
    return handler(_request);
  };
}
