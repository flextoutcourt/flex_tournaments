import { NextRequest } from 'next/server';
import { TournamentPersistenceService } from '@/lib/services/tournamentPersistenceService';
import { apiResponse } from '@/lib/apiResponse';

/**
 * GET /api/tournaments/[id]/state
 * Load tournament state for a user (for cross-device resume)
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: tournamentId } = await params;
    const userId = req.headers.get('x-user-id');

    if (!userId) {
      return apiResponse.error('User not authenticated', 401);
    }

    const session = await TournamentPersistenceService.getOrCreateSession(tournamentId, userId);

    if (!session || !session.stateJson) {
      return apiResponse.success({
        currentMatchIndex: 0,
        currentRoundNumber: 0,
        tournamentWinnerId: null,
        matches: [],
        participants: [],
        scores: {},
      });
    }

    return apiResponse.success({
      currentMatchIndex: session.currentMatchIndex,
      currentRoundNumber: session.currentRoundNumber,
      tournamentWinnerId: session.tournamentWinnerId,
      ...(session.stateJson as any),
    });
  } catch (error) {
    console.error('[Tournament State] Error loading state:', error);
    return apiResponse.error('Failed to load tournament state', 500);
  }
}

/**
 * POST /api/tournaments/[id]/state
 * Save tournament state after each match
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: tournamentId } = await params;
    const userId = req.headers.get('x-user-id');

    if (!userId) {
      return apiResponse.error('User not authenticated', 401);
    }

    const body = await req.json();
    const {
      currentMatchIndex,
      currentRoundNumber,
      tournamentWinnerId,
      matches,
      participants,
      scores,
    } = body;

    if (currentMatchIndex === undefined || currentRoundNumber === undefined) {
      return apiResponse.error('Missing required fields', 400);
    }

    // Ensure user has an active session
    await TournamentPersistenceService.startTournamentSession(tournamentId, userId);

    // Save state
    const updatedSession = await TournamentPersistenceService.saveTournamentProgress(
      tournamentId,
      userId,
      {
        currentMatchIndex,
        currentRoundNumber,
        tournamentWinnerId,
        matches,
        participants,
        scores,
      }
    );

    return apiResponse.success({
      message: 'Tournament state saved',
      tournament: {
        id: updatedSession.tournamentId,
        currentMatchIndex: updatedSession.currentMatchIndex,
        currentRoundNumber: updatedSession.currentRoundNumber,
        tournamentWinnerId: updatedSession.tournamentWinnerId,
      },
    });
  } catch (error) {
    console.error('[Tournament State] Error saving state:', error);
    return apiResponse.error('Failed to save tournament state', 500);
  }
}
