import { NextRequest } from 'next/server';
import { tournamentCreateSchema } from '@/lib/validations/tournament';
import { TournamentService } from '@/services/tournamentService';
import { requireAuth } from '@/lib/authMiddleware';
import { successResponse, handleApiError } from '@/lib/apiResponse';
import { logActivity, getIpFromRequest, getUserAgentFromRequest } from '@/services/logService';

/**
 * POST /api/tournaments
 * Create a new tournament (Authenticated users only)
 */
export async function POST(request: NextRequest) {
  try {
    // Require authentication (any logged-in user can create tournaments)
    const session = await requireAuth();

    const body = await request.json();

    // Validate input
    const validatedData = tournamentCreateSchema.parse(body);

    // Create tournament
    const tournament = await TournamentService.createTournament(
      validatedData,
      session.user.id
    );

    // Log the activity
    await logActivity({
      userId: session.user.id,
      action: 'tournament_created',
      description: `Tournoi "${validatedData.title}" créé`,
      entityType: 'tournament',
      entityId: tournament.id,
      ipAddress: getIpFromRequest(request),
      userAgent: getUserAgentFromRequest(request),
    });

    return successResponse(tournament, 201);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * GET /api/tournaments
 * Get all tournaments
 */
export async function GET() {
  try {
    const tournaments = await TournamentService.getAllTournaments();
    return successResponse(tournaments);
  } catch (error) {
    return handleApiError(error);
  }
}
