/**
 * Vote Service - Handles all vote API communication
 */

import { VotePayload } from '@/types/tmi';

const API_TIMEOUT = 5000; // 5 second timeout

export class VoteService {
  private tournamentId: string;

  constructor(tournamentId: string) {
    this.tournamentId = tournamentId;
  }

  /**
   * Send a single vote to the API
   */
  async sendVote(vote: VotePayload): Promise<boolean> {
    if (!this.tournamentId) {
      console.warn('[VoteService] No tournamentId provided');
      return false;
    }

    // Validate vote payload
    if (!vote || typeof vote.vote !== 'string') {
      console.error('[VoteService] Invalid vote payload:', vote);
      return false;
    }

    try {
      const bodyStr = JSON.stringify(vote);
      if (!bodyStr || bodyStr === '{}') {
        console.error('[VoteService] Empty vote payload serialization');
        return false;
      }
      
      console.log('[VoteService] 📤 Sending vote:', {
        tournamentId: this.tournamentId,
        username: vote.username,
        vote: vote.vote,
        bodyLength: bodyStr.length,
      });
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

      const response = await fetch(`/api/votes/${this.tournamentId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: bodyStr,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        console.log('[VoteService] ✅ Vote sent successfully');
        return true;
      }

      if (response.status === 429) {
        console.warn('[VoteService] ⏱️ Rate limited');
      } else {
        const data = await response.json().catch(() => ({}));
        console.error('[VoteService] ❌ Error:', { status: response.status, data });
      }

      return false;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.error('[VoteService] ⏱️ Request timeout');
      } else {
        console.error('[VoteService] 🌐 Network error:', error);
      }
      return false;
    }
  }

  /**
   * Send multiple votes (for super votes)
   */
  async sendVotes(votes: VotePayload[]): Promise<boolean[]> {
    return Promise.all(votes.map(vote => this.sendVote(vote)));
  }

  /**
   * Generate standard vote payload
   */
  createVotePayload(voteValue: '1' | '2', username: string): VotePayload {
    return {
      vote: voteValue,
      username,
      userId: `twitch-${username}`,
      ts: Date.now(),
    };
  }

  /**
   * Create super vote payloads (2 votes)
   */
  createSuperVotePayloads(voteValue: '1' | '2', username: string): VotePayload[] {
    const payload = this.createVotePayload(voteValue, username);
    return [payload, payload];
  }
}
