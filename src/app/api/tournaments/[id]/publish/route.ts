import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/authMiddleware';
import { successResponse, handleApiError } from '@/lib/apiResponse';
import { logActivity, getIpFromRequest, getUserAgentFromRequest } from '@/services/logService';

/**
 * PATCH /api/tournaments/[id]/publish
 * Publish a tournament (change status from SETUP to LIVE)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const { id } = await params;

    // Get the tournament
    const tournament = await prisma.tournament.findUnique({
      where: { id },
    });

    if (!tournament) {
      return NextResponse.json(
        { error: 'Tournoi non trouvé' },
        { status: 404 }
      );
    }

    // Check if user is the creator
    if (tournament.createdById !== session.user.id) {
      return NextResponse.json(
        { error: 'Vous n\'êtes pas autorisé à publier ce tournoi' },
        { status: 403 }
      );
    }

    // Check if tournament is already published
    if (tournament.status === 'LIVE') {
      return NextResponse.json(
        { error: 'Ce tournoi est déjà publié' },
        { status: 400 }
      );
    }

    // Update tournament status
    const updatedTournament = await prisma.tournament.update({
      where: { id },
      data: {
        status: 'LIVE',
      },
    });

    // Log the activity
    await logActivity({
      userId: session.user.id,
      action: 'tournament_published',
      description: `Tournoi "${tournament.title}" publié et passé en mode LIVE`,
      entityType: 'tournament',
      entityId: id,
      ipAddress: getIpFromRequest(request),
      userAgent: getUserAgentFromRequest(request),
    });

    return successResponse(updatedTournament);
  } catch (error) {
    return handleApiError(error);
  }
}
