/**
 * Vote Deduplication Service - Manages per-match vote tracking
 * Prevents users from voting multiple times in the same match
 */

export class VoteDuplicationService {
  private votedUsers: Set<string> = new Set();
  private currentMatchId: string | null = null;

  /**
   * Set the current match identifier
   * Automatically clears voted users when match changes
   */
  setCurrentMatch(matchId: string | null): void {
    if (matchId !== this.currentMatchId) {
      this.votedUsers.clear();
      this.currentMatchId = matchId;
    }
  }

  /**
   * Check if a user has already voted in this match
   */
  hasVoted(username: string): boolean {
    return this.votedUsers.has(username);
  }

  /**
   * Mark a user as voted
   */
  markAsVoted(username: string): void {
    this.votedUsers.add(username);
  }

  /**
   * Get count of voted users in current match
   */
  getVotedCount(): number {
    return this.votedUsers.size;
  }

  /**
   * Reset for new match
   */
  reset(): void {
    this.votedUsers.clear();
    this.currentMatchId = null;
  }
}

/**
 * Factory for creating deduplication service
 */
export function createVoteDuplicationService(): VoteDuplicationService {
  return new VoteDuplicationService();
}
