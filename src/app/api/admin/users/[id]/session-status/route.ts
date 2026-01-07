import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { AdminService } from '@/services/adminService';

/**
 * GET /api/admin/users/[id]/session-status
 * 
 * Checks if a user currently has active sessions
 * Returns login status and session details
 */
export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
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

    const userId = params.id;

    // Check for active sessions
    const activeSessions = await prisma.userSession.findMany(
      {
        where: {
          userId: userId,
          isActive: true,
          expiresAt: {
            gt: new Date(), // Not expired
          },
        },
        select: {
          id: true,
          loginAt: true,
          lastActivity: true,
          expiresAt: true,
          ipAddress: true,
          userAgent: true,
        },
      }
    );

    const isLoggedIn = activeSessions.length > 0;

    // Get the most recent session if any
    const mostRecentSession = activeSessions.length > 0 
      ? activeSessions.reduce((latest: typeof activeSessions[0], current: typeof activeSessions[0]) =>
          new Date(current.loginAt) > new Date(latest.loginAt) ? current : latest
        )
      : null;

    return NextResponse.json({
      data: {
        isLoggedIn,
        sessionCount: activeSessions.length,
        mostRecentSession: mostRecentSession ? {
          loginAt: mostRecentSession.loginAt,
          lastActivity: mostRecentSession.lastActivity,
          expiresAt: mostRecentSession.expiresAt,
          ipAddress: mostRecentSession.ipAddress,
        } : null,
      },
    });
  } catch (error) {
    console.error('Error checking session status:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la vérification du statut' },
      { status: 500 }
    );
  }
}
