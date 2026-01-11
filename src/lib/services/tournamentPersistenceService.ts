import { prisma } from '@/lib/prisma';
import { Tournament, TournamentSession, Vote } from '@prisma/client';

/**
 * Service for persisting tournament state to the database
 * Handles saving/loading tournament progress, votes, and cross-device resume
 */

export interface TournamentStateData {
  currentMatchIndex: number;
  currentRoundNumber: number;
  tournamentWinnerId?: string | null;
  matches?: any[]; // Complex match data stored as JSON
  participants?: any[];
  scores?: Record<string, number>;
}

export class TournamentPersistenceService {
  /**
   * Start a new tournament session for a user
   * Creates or updates the TournamentSession record with user's progress
   */
  static async startTournamentSession(
    tournamentId: string,
    userId: string,
    twitchChannel?: string,
    deviceId?: string
  ): Promise<TournamentSession> {
    console.log('[Session] Starting tournament session:', { tournamentId, userId, twitchChannel });
    
    return prisma.tournamentSession.upsert({
      where: {
        tournamentId_userId: {
          tournamentId,
          userId,
        },
      },
      create: {
        tournamentId,
        userId,
        twitchChannel,
        deviceId,
        isActive: true,
      },
      update: {
        isActive: true,
        twitchChannel: twitchChannel || undefined,
        lastActivityAt: new Date(),
      },
    });
  }

  /**
   * Get or create a tournament session for a user
   * Useful for resuming tournaments on different devices
   */
  static async getOrCreateSession(
    tournamentId: string,
    userId: string
  ): Promise<TournamentSession> {
    const session = await prisma.tournamentSession.findUnique({
      where: {
        tournamentId_userId: {
          tournamentId,
          userId,
        },
      },
    });
    
    if (session) {
      console.log('[Session] Found existing session:', { sessionId: session.id, tournamentId });
      return session;
    }
    
    console.log('[Session] Creating new session for user:', { userId, tournamentId });
    return this.startTournamentSession(tournamentId, userId);
  }

  /**
   * Save user's tournament progress to their session
   * Each user has their own session with their progress tracking
   */
  static async saveTournamentProgress(
    tournamentId: string,
    userId: string,
    state: TournamentStateData
  ): Promise<TournamentSession> {
    console.log('[Session] Saving tournament progress:', {
      tournamentId,
      userId,
      currentMatchIndex: state.currentMatchIndex,
      currentRoundNumber: state.currentRoundNumber,
    });

    try {
      const session = await prisma.tournamentSession.upsert({
        where: {
          tournamentId_userId: {
            tournamentId,
            userId,
          },
        },
        create: {
          tournamentId,
          userId,
          isActive: !state.tournamentWinnerId,
          currentMatchIndex: state.currentMatchIndex,
          currentRoundNumber: state.currentRoundNumber,
          tournamentWinnerId: state.tournamentWinnerId,
          stateJson: {
            matches: state.matches || [],
            participants: state.participants || [],
            scores: state.scores || {},
          },
        },
        update: {
          isActive: !state.tournamentWinnerId,
          currentMatchIndex: state.currentMatchIndex,
          currentRoundNumber: state.currentRoundNumber,
          tournamentWinnerId: state.tournamentWinnerId,
          stateJson: {
            matches: state.matches || [],
            participants: state.participants || [],
            scores: state.scores || {},
          },
          lastActivityAt: new Date(),
        },
      });
      
      console.log('[Session] Progress saved successfully to TournamentSession');
      return session;
    } catch (error) {
      console.error('[Session] Failed to save progress:', error);
      throw error;
    }
  }

  /**
   * Record a vote with deduplication check
   * Prevents the same user from voting on the same match twice
   */
  static async recordVote(
    tournamentId: string,
    itemId: string,
    matchIndex: number,
    userId?: string,
    twitchUsername?: string
  ): Promise<Vote | null> {
    try {
      console.log('[Vote] Recording vote:', { tournamentId, itemId, matchIndex, userId, twitchUsername });

      // Check for existing vote from this user on this match
      let existingVote = null;
      
      if (userId) {
        existingVote = await prisma.vote.findFirst({
          where: {
            tournamentId,
            matchIndex,
            userId,
          },
        });
      } else if (twitchUsername) {
        existingVote = await prisma.vote.findFirst({
          where: {
            tournamentId,
            matchIndex,
            twitchUsername,
          },
        });
      }

      // If user already voted for this match, update it instead of creating duplicate
      if (existingVote) {
        console.log('[Vote] Updating existing vote:', existingVote.id);
        return prisma.vote.update({
          where: { id: existingVote.id },
          data: {
            itemId: itemId,
          },
        });
      }

      // Create new vote - only include userId if provided, otherwise leave as null
      console.log('[Vote] Creating new vote');
      const newVote = await prisma.vote.create({
        data: {
          tournamentId,
          itemId,
          matchIndex: matchIndex || null,
          ...(userId && { userId }),
          ...(twitchUsername && { twitchUsername }),
        },
      });
      
      console.log('[Vote] ✓ Vote created successfully:', newVote.id);
      return newVote;
    } catch (error: any) {
      console.error('[Vote] ✗ Error recording vote:', error);
      // Handle constraint violations gracefully
      if (error.code === 'P2003') {
        console.warn(`Foreign key constraint: ${error.message}`);
        return null;
      }
      if (error.code === 'P2002') {
        console.warn(`Duplicate vote attempt: ${userId || twitchUsername} already voted on match ${matchIndex}`);
        return null;
      }
      throw error;
    }
  }

  /**
   * Get all votes for a specific match in a tournament
   * Useful for tallying votes to determine winner
   */
  static async getMatchVotes(
    tournamentId: string,
    matchIndex: number
  ) {
    const votes = await prisma.vote.findMany({
      where: {
        tournamentId,
        matchIndex,
      },
      include: {
        item: true,
      },
    });

    // Tally votes by item
    const voteTally: Record<string, number> = {};
    votes.forEach((vote) => {
      voteTally[vote.itemId] = (voteTally[vote.itemId] || 0) + 1;
    });

    return {
      votes,
      voteTally,
      totalVotes: votes.length,
    };
  }

  /**
   * Get votes from a specific user for a tournament
   * Useful for displaying user's voting history
   */
  static async getUserTournamentVotes(
    userId: string,
    tournamentId: string
  ) {
    return prisma.vote.findMany({
      where: {
        userId,
        tournamentId,
      },
      include: {
        item: true,
      },
      orderBy: {
        matchIndex: 'asc',
      },
    });
  }

  /**
   * End a tournament session for a user
   */
  static async endTournamentSession(
    tournamentId: string,
    userId: string
  ): Promise<TournamentSession> {
    return prisma.tournamentSession.update({
      where: {
        tournamentId_userId: {
          tournamentId,
          userId,
        },
      },
      data: {
        isActive: false,
        endedAt: new Date(),
      },
    });
  }

  /**
   * Get all active tournament sessions for a user
   * Useful for showing "continue tournament" options
   */
  static async getActiveSessionsForUser(userId: string) {
    return prisma.tournamentSession.findMany({
      where: {
        userId,
        isActive: true,
      },
      include: {
        tournament: {
          include: {
            items: true,
          },
        },
      },
    });
  }

  /**
   * Check if user has already voted for a specific match
   */
  static async hasUserVotedForMatch(
    userId: string,
    tournamentId: string,
    matchIndex: number
  ): Promise<boolean> {
    const vote = await prisma.vote.findFirst({
      where: {
        userId,
        tournamentId,
        matchIndex,
      },
    });
    return !!vote;
  }

  /**
   * Get user's vote for a specific match (if any)
   */
  static async getUserMatchVote(
    userId: string,
    tournamentId: string,
    matchIndex: number
  ) {
    return prisma.vote.findFirst({
      where: {
        userId,
        tournamentId,
        matchIndex,
      },
      include: {
        item: true,
      },
    });
  }
}
