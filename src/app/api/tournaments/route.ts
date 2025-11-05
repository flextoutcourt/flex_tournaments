import { NextRequest } from 'next/server';
import { tournamentCreateSchema } from '@/lib/validations/tournament';
import { TournamentService } from '@/services/tournamentService';
import { requireAdmin } from '@/lib/authMiddleware';
import { successResponse, handleApiError } from '@/lib/apiResponse';

/**
 * POST /api/tournaments
 * Create a new tournament (Admin only)
 */
export async function POST(request: NextRequest) {
  try {
    // Require admin authentication
    const session = await requireAdmin();

    const body = await request.json();

    // Validate input
    const validatedData = tournamentCreateSchema.parse(body);

    // Create tournament
    const tournament = await TournamentService.createTournament(
      validatedData,
      session.user.id
    );

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
