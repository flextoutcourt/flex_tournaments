import { NextRequest } from 'next/server';
import { tournamentUpdateSchema } from '@/lib/validations/tournament';
import { TournamentService } from '@/services/tournamentService';
import { successResponse, handleApiError, errorResponse } from '@/lib/apiResponse';
import { ValidationError } from '@/lib/errors';

/**
 * Extract tournament ID from request URL
 */
function getIdFromRequest(request: NextRequest): string {
  const pathname = request.nextUrl.pathname;
  const parts = pathname.split('/');
  return parts[parts.length - 1];
}

/**
 * GET /api/tournaments/[id]
 * Get a single tournament by ID
 */
export async function GET(request: NextRequest) {
  try {
    const id = getIdFromRequest(request);
    if (!id) {
      return errorResponse("L'ID du tournoi est manquant.", 400);
    }

    const tournament = await TournamentService.getTournamentById(id);
    return successResponse(tournament);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * PUT /api/tournaments/[id]
 * Update a tournament
 */
export async function PUT(request: NextRequest) {
  try {
    const id = getIdFromRequest(request);
    if (!id) {
      return errorResponse("L'ID du tournoi est manquant.", 400);
    }

    const body = await request.json();

    // Validate input
    const validatedData = tournamentUpdateSchema.parse(body);

    // Check if at least one field is provided
    if (!validatedData.title && validatedData.description === undefined) {
      throw new ValidationError(
        "Au moins un champ (title ou description) doit être fourni pour la mise à jour."
      );
    }

    // Update tournament
    const tournament = await TournamentService.updateTournament(id, validatedData);
    return successResponse(tournament);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/tournaments/[id]
 * Delete a tournament
 */
export async function DELETE(request: NextRequest) {
  try {
    const id = getIdFromRequest(request);
    if (!id) {
      return errorResponse("L'ID du tournoi est manquant.", 400);
    }

    await TournamentService.deleteTournament(id);
    return successResponse(null, 200, "Tournoi supprimé avec succès");
  } catch (error) {
    return handleApiError(error);
  }
}
