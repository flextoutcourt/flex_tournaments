import { NextRequest, NextResponse } from 'next/server';
import { TournamentPersistenceService } from '@/lib/services/tournamentPersistenceService';
import { apiResponse } from '@/lib/apiResponse';

/**
 * GET /api/users/[userId]/tournament-sessions
 * Get all active tournament sessions for a user (for "Continue Tournament" feature)
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = params.userId;
    const requestingUserId = req.headers.get('x-user-id');

    // Users can only view their own sessions
    if (userId !== requestingUserId) {
      return apiResponse.error('Unauthorized', 403);
    }

    const sessions = await TournamentPersistenceService.getActiveSessionsForUser(userId);

    return apiResponse.success({
      sessions: sessions.map((session) => ({
        id: session.id,
        tournamentId: session.tournamentId,
        tournament: {
          id: session.tournament.id,
          title: session.tournament.title,
          description: session.tournament.description,
          mode: session.tournament.mode,
          status: session.tournament.status,
          currentMatchIndex: session.tournament.currentMatchIndex,
          currentRoundNumber: session.tournament.currentRoundNumber,
        },
        twitchChannel: session.twitchChannel,
        startedAt: session.startedAt,
        lastActivityAt: session.lastActivityAt,
      })),
    });
  } catch (error) {
    console.error('[Tournament Sessions] Error fetching sessions:', error);
    return apiResponse.error('Failed to fetch tournament sessions', 500);
  }
}

/**
 * POST /api/tournaments/[id]/sessions
 * Start or resume a tournament session
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: tournamentId } = params;
    const userId = req.headers.get('x-user-id');

    if (!userId) {
      return apiResponse.error('User not authenticated', 401);
    }

    const body = await req.json();
    const { twitchChannel, deviceId } = body;

    const session = await TournamentPersistenceService.startTournamentSession(
      tournamentId,
      userId,
      twitchChannel,
      deviceId
    );

    return apiResponse.success({
      message: 'Tournament session started',
      session: {
        id: session.id,
        tournamentId: session.tournamentId,
        userId: session.userId,
        isActive: session.isActive,
        startedAt: session.startedAt,
        twitchChannel: session.twitchChannel,
      },
    });
  } catch (error) {
    console.error('[Tournament Sessions] Error starting session:', error);
    return apiResponse.error('Failed to start tournament session', 500);
  }
}
