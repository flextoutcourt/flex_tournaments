import { NextRequest, NextResponse } from 'next/server';
import { TournamentPersistenceService } from '@/lib/services/tournamentPersistenceService';
import { apiResponse } from '@/lib/apiResponse';

/**
 * GET /api/tournaments/[id]/matches/[matchIndex]/vote-check
 * Check if user has already voted for this match (deduplication)
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string; matchIndex: string } }
) {
  try {
    const { id: tournamentId, matchIndex } = params;
    const userId = req.headers.get('x-user-id');
    const twitchUsername = req.nextUrl.searchParams.get('twitch');

    const matchIndexNum = parseInt(matchIndex);
    if (isNaN(matchIndexNum)) {
      return apiResponse.error('Invalid match index', 400);
    }

    // Check if user has voted
    let hasVoted = false;
    let existingVote = null;

    if (userId) {
      hasVoted = await TournamentPersistenceService.hasUserVotedForMatch(
        userId,
        tournamentId,
        matchIndexNum
      );
      
      if (hasVoted) {
        existingVote = await TournamentPersistenceService.getUserMatchVote(
          userId,
          tournamentId,
          matchIndexNum
        );
      }
    } else if (twitchUsername) {
      // For Twitch votes, check in database
      // This would require tracking Twitch username somewhere
      // For now, we'll rely on SSE deduplication
    }

    return apiResponse.success({
      hasVoted,
      existingVote: existingVote ? {
        id: existingVote.id,
        itemId: existingVote.itemId,
        itemName: existingVote.item?.name,
      } : null,
    });
  } catch (error) {
    console.error('[Vote Check] Error checking vote:', error);
    return apiResponse.error('Failed to check vote status', 500);
  }
}

/**
 * POST /api/tournaments/[id]/matches/[matchIndex]/vote
 * Record a vote with deduplication
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string; matchIndex: string } }
) {
  try {
    const { id: tournamentId, matchIndex } = params;
    const userId = req.headers.get('x-user-id');
    const body = await req.json();
    const { itemId, twitchUsername } = body;

    const matchIndexNum = parseInt(matchIndex);
    if (isNaN(matchIndexNum)) {
      return apiResponse.error('Invalid match index', 400);
    }

    if (!itemId) {
      return apiResponse.error('Missing itemId', 400);
    }

    // Record vote with deduplication (updates if already voted)
    const vote = await TournamentPersistenceService.recordVote(
      tournamentId,
      itemId,
      matchIndexNum,
      userId,
      twitchUsername
    );

    if (!vote) {
      return apiResponse.error('Failed to record vote', 400);
    }

    // Get updated vote tally for the match
    const { voteTally, totalVotes } = await TournamentPersistenceService.getMatchVotes(
      tournamentId,
      matchIndexNum
    );

    return apiResponse.success({
      message: 'Vote recorded',
      vote: {
        id: vote.id,
        itemId: vote.itemId,
      },
      matchVoteTally: voteTally,
      matchTotalVotes: totalVotes,
    });
  } catch (error) {
    console.error('[Vote Recording] Error recording vote:', error);
    return apiResponse.error('Failed to record vote', 500);
  }
}
