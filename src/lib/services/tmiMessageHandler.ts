/**
 * TMI Message Handler Service - Parses and processes chat messages
 */

import { ModeratorCommand } from '@/types/tmi';

export class TmiMessageHandlerService {
  private moderatorUsername: string = 'luniqueflex';

  /**
   * Parse moderator commands from message
   * Supported commands:
   * - ..add vote [1|2] [amount]
   * - ..remove vote [1|2] [amount]
   * - ..set vote [1|2] [score]
   */
  parseModeratorCommand(message: string): ModeratorCommand | null {
    const addMatch = message.match(/^\.\.add vote ([12]) (\d+)$/);
    const removeMatch = message.match(/^\.\.remove vote ([12]) (\d+)$/);
    const setMatch = message.match(/^\.\.set vote ([12]) (\d+)$/);

    if (addMatch) {
      return {
        type: 'add',
        voteNumber: addMatch[1] as '1' | '2',
        amount: parseInt(addMatch[2], 10),
      };
    }

    if (removeMatch) {
      return {
        type: 'remove',
        voteNumber: removeMatch[1] as '1' | '2',
        amount: parseInt(removeMatch[2], 10),
      };
    }

    if (setMatch) {
      return {
        type: 'set',
        voteNumber: setMatch[1] as '1' | '2',
        amount: 0,
        targetScore: parseInt(setMatch[2], 10),
      };
    }

    return null;
  }

  /**
   * Check if message is from moderator
   */
  isModerator(username: string): boolean {
    return username.toLowerCase() === this.moderatorUsername;
  }

  /**
   * Sanitize message - remove all non-alphanumeric characters
   * This handles zero-width characters, combining marks, and other invisible characters
   */
  private sanitizeMessage(message: string): string {
    return message
      .toLowerCase()
      .trim()
      // Remove ALL non-alphanumeric characters (dots, spaces, invisible chars, etc.)
      // Keep only: a-z, 0-9
      .replace(/[^a-z0-9]/g, '');
  }

  /**
   * Check if message is a vote keyword
   */
  isVoteKeyword(message: string, keywords: string[]): boolean {
    const normalizedMessage = this.sanitizeMessage(message);
    const isVote = keywords.some(keyword => normalizedMessage === keyword);
    if (!isVote) {
      console.log('[TmiMessageHandler] Message not a vote keyword. Got:', `"${normalizedMessage}"`, 'Expected one of:', keywords, 'Original:', `"${message}"`);
    }
    return isVote;
  }

  /**
   * Check if message is a special vote (super vote)
   */
  isSuperVote(message: string): boolean {
    const normalized = this.sanitizeMessage(message);
    return normalized === 'super1' || normalized === 'super2';
  }

  /**
   * Extract vote value from super vote message
   */
  extractSuperVoteValue(message: string): '1' | '2' | null {
    const normalized = this.sanitizeMessage(message);
    if (normalized === 'super1') return '1';
    if (normalized === 'super2') return '2';
    return null;
  }

  /**
   * Normalize message for comparison
   */
  normalizeMessage(message: string): string {
    return message.toLowerCase().trim();
  }
}

/**
 * Factory for creating message handler service
 */
export function createTmiMessageHandlerService(): TmiMessageHandlerService {
  return new TmiMessageHandlerService();
}
