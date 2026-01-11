import { NextRequest, NextResponse } from 'next/server';
import { broadcastVote } from '@/server/sse';
import { TournamentPersistenceService } from '@/lib/services/tournamentPersistenceService';
import { prisma } from '@/lib/prisma';

// In-memory rate limiter: tracks last vote time per user per tournament
// Format: { tournamentId-userId: lastVoteTimestamp }
const userVoteTimestamps = new Map<string, number>();
const VOTE_COOLDOWN_MS = 500; // Minimum 500ms between votes per user

/**
 * POST /api/votes/[tournamentId]
 *
 * Ingest votes and broadcast them to connected WebSocket clients.
 *
 * Request body:
 * {
 *   userId?: string,
 *   username?: string,
 *   vote: string,
 *   ts?: number
 * }
 *
 * Response:
 * { ok: true } or { error: 'Rate limited' }
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
    console.log('[VOTES] Received request:', {
      method: request.method,
      url: request.url,
      contentType: request.headers.get('content-type'),
      contentLength: request.headers.get('content-length'),
    });
    
    const { tournamentId } = await params;

    if (!tournamentId) {
      return NextResponse.json(
        { error: 'tournamentId is required' },
        { status: 400 }
      );
    }

    // Check if request has a body
    const contentLength = request.headers.get('content-length');
    if (!contentLength || contentLength === '0') {
      console.error('[VOTES] Empty request body received');
      return NextResponse.json(
        { error: 'Request body is required' },
        { status: 400 }
      );
    }

    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error('[VOTES] Failed to parse JSON:', parseError);
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    // Validate body
    if (typeof body.vote !== 'string' || body.vote.trim() === '') {
      return NextResponse.json(
        { error: 'vote field is required and must be non-empty string' },
        { status: 400 }
      );
    }

    // Rate limiting: enforce cooldown per user
    const userId = body.userId || body.username || 'anonymous';
    const rateLimitKey = `${tournamentId}-${userId}`;
    const lastVoteTime = userVoteTimestamps.get(rateLimitKey) || 0;
    const timeSinceLastVote = Date.now() - lastVoteTime;

    if (timeSinceLastVote < VOTE_COOLDOWN_MS) {
      return NextResponse.json(
        { error: 'Rate limited - wait before voting again' },
        { status: 429 }
      );
    }

    // Update last vote timestamp for this user
    userVoteTimestamps.set(rateLimitKey, Date.now());

    // Cleanup old timestamps (keep only recent ones to prevent memory leak)
    const cutoffTime = Date.now() - 60000; // Keep last 60 seconds
    for (const [key, timestamp] of userVoteTimestamps.entries()) {
      if (timestamp < cutoffTime) {
        userVoteTimestamps.delete(key);
      }
    }

    // Build vote object - minimal payload
    const vote = {
      tournamentId,
      userId: body.userId || undefined,
      username: body.username || undefined,
      vote: body.vote,
      timestamp: Date.now(),
    };

    // Broadcast immediately to connected SSE clients
    broadcastVote(vote);

    // Persist vote to database
    // If itemId not provided, try to determine it from the vote and tournament state
    try {
      let itemId = body.itemId;
      let matchIndex = body.matchIndex !== undefined ? body.matchIndex : 0;

      console.log('[VOTES] Attempting to persist vote:', {
        tournamentId,
        userId: body.userId,
        username: body.username,
        vote: body.vote,
        hasItemId: !!body.itemId,
        hasMatchIndex: body.matchIndex !== undefined,
      });

      // If we don't have itemId, try to determine it from the vote and tournament state
      if (!itemId) {
        try {
          console.log('[VOTES] Fetching tournament to resolve itemId:', tournamentId);
          const tournament = await prisma.tournament.findUnique({
            where: { id: tournamentId },
            include: { Items: true },
          });

          console.log('[VOTES] Tournament found:', {
            exists: !!tournament,
            itemsCount: tournament?.Items?.length || 0,
          });

          if (tournament && tournament.Items && tournament.Items.length >= 2) {
            // Determine itemId from vote number (1 or 2 maps to first or second item)
            const voteNum = parseInt(body.vote);
            if (!isNaN(voteNum) && voteNum >= 1 && voteNum <= tournament.Items.length) {
              itemId = tournament.Items[voteNum - 1]?.id;
              
              console.log('[VOTES] ✓ Resolved itemId from vote:', {
                voteNum,
                itemId,
                itemName: tournament.Items[voteNum - 1]?.name,
              });
            } else {
              console.warn('[VOTES] Invalid vote number:', { voteNum, itemsCount: tournament.Items.length });
            }
          } else {
            console.warn('[VOTES] Tournament not found or insufficient items:', {
              tournamentExists: !!tournament,
              itemsCount: tournament?.Items?.length || 0,
            });
          }
        } catch (contextError) {
          console.error('[VOTES] ✗ Failed to fetch tournament context:', contextError);
        }
      }

      // Now persist to database - itemId is required
      if (itemId && matchIndex !== undefined) {
        try {
          // Only pass userId if it's from an authenticated request (session)
          // For anonymous/Twitch votes, only use twitchUsername
          const result = await TournamentPersistenceService.recordVote(
            tournamentId,
            itemId,
            matchIndex,
            undefined, // Don't pass userId - it may not exist in database
            body.username || undefined // Use username/twitchUsername instead
          );
          
          if (result) {
            console.log('[VOTES] ✓ Vote persisted successfully:', {
              voteId: result.id,
              itemId,
              matchIndex,
              twitchUsername: body.username,
            });
          } else {
            console.warn('[VOTES] Vote was duplicate or failed:', {
              itemId,
              matchIndex,
              twitchUsername: body.username,
            });
          }
        } catch (dbError) {
          console.error('[VOTES] ✗ Database error persisting vote:', dbError);
        }
      } else {
        console.error('[VOTES] ✗ Cannot persist vote - missing required fields:', {
          hasItemId: !!itemId,
          hasMatchIndex: matchIndex !== undefined,
          matchIndex,
        });
      }
    } catch (error) {
      console.error('[VOTES] ✗ Error in vote persistence logic:', error);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;
    console.error('[VOTES] Error processing vote:', {
      message: errorMessage,
      stack: errorStack,
      error: error,
    });
    return NextResponse.json(
      { error: 'Failed to process vote' },
      { status: 500 }
    );
  }
}
