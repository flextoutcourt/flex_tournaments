import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { TournamentPersistenceService } from '@/lib/services/tournamentPersistenceService';

/**
 * POST /api/tournament-session/[tournamentId]
 * Save user's tournament session/progress with complete state
 */
export async function POST(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ tournamentId: string }>;
  }
) {
  try {
    const { tournamentId } = await params;
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const userId = session.user.id;

    console.log('[SESSION API] Saving tournament session:', {
      tournamentId,
      userId,
      currentMatchIndex: body.currentMatchIndex,
      currentRoundNumber: body.currentRoundNumber,
      matchesCount: body.matches?.length,
    });

    // Get vote counts for current match to include in state
    let voteCountsForCurrentMatch = {};
    try {
      const matchVotes = await TournamentPersistenceService.getMatchVotes(
        tournamentId,
        body.currentMatchIndex
      );
      voteCountsForCurrentMatch = matchVotes.voteTally;
      console.log('[SESSION API] Vote tally for current match:', voteCountsForCurrentMatch);
    } catch (voteError) {
      console.warn('[SESSION API] Failed to get vote counts:', voteError);
    }

    // Prepare complete match state with passed/ongoing/current tracking
    const enrichedMatches = (body.matches || []).map((match: any, index: number) => ({
      index,
      item1: match.item1,
      item2: match.item2,
      winner: match.winner,
      votes1: match.votes1 || 0,
      votes2: match.votes2 || 0,
      passed: index < body.currentMatchIndex, // Matches before current are passed
      isCurrent: index === body.currentMatchIndex, // Current match
      isUpcoming: index > body.currentMatchIndex, // Matches after current are upcoming
      voteCounts: index === body.currentMatchIndex ? voteCountsForCurrentMatch : {},
    }));

    const result = await TournamentPersistenceService.saveTournamentProgress(
      tournamentId,
      userId,
      {
        currentMatchIndex: body.currentMatchIndex,
        currentRoundNumber: body.currentRoundNumber,
        tournamentWinnerId: body.tournamentWinnerId || null,
        matches: enrichedMatches,
        participants: body.participants || [],
        scores: body.scores || {},
      }
    );

    console.log('[SESSION API] ✓ Session saved successfully with state');

    return NextResponse.json({
      success: true,
      session: result,
    });
  } catch (error) {
    console.error('[SESSION API] ✗ Error saving session:', error);
    return NextResponse.json(
      { error: 'Failed to save session' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/tournament-session/[tournamentId]
 * Load user's tournament session/progress
 */
export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ tournamentId: string }>;
  }
) {
  try {
    const { tournamentId } = await params;
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    console.log('[SESSION API] Loading tournament session:', { tournamentId, userId });

    const result = await TournamentPersistenceService.getOrCreateSession(
      tournamentId,
      userId
    );

    return NextResponse.json({
      success: true,
      session: result,
    });
  } catch (error) {
    console.error('[SESSION API] ✗ Error loading session:', error);
    return NextResponse.json(
      { error: 'Failed to load session' },
      { status: 500 }
    );
  }
}
