import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { AdminService } from '@/services/adminService';

/**
 * POST /api/admin/users/[id]/kick
 * 
 * Disconnects/kicks a user by invalidating all their active sessions
 * GDPR Compliant: Logs the action for audit trail
 */
export async function POST(
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

    // Prevent admins from kicking themselves
    if (session.user.id === userId) {
      return NextResponse.json(
        { error: 'Vous ne pouvez pas vous déconnecter vous-même' },
        { status: 400 }
      );
    }

    // Invalidate all active sessions for this user
    await prisma.userSession.updateMany(
      {
        where: {
          userId: userId,
          isActive: true,
        },
      },
      {
        isActive: false,
        expiresAt: new Date(), // Expire immediately
      }
    );

    // Log the action for audit trail
    await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        action: 'user_kicked',
        description: `Utilisateur ${userId} déconnecté de force`,
        entityType: 'user',
        entityId: userId,
      },
    });

    return NextResponse.json({
      message: 'Utilisateur déconnecté avec succès',
    });
  } catch (error) {
    console.error('Error kicking user:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la déconnexion de l\'utilisateur' },
      { status: 500 }
    );
  }
}
