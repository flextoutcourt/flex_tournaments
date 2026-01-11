/**
 * PHASE 2 (SCAFFOLD ONLY): tmi.js Vote Integration
 *
 * This module will:
 * 1. Connect to Twitch chat via tmi.js
 * 2. Parse vote messages from chat (e.g., "!vote A")
 * 3. Forward votes to POST /api/votes/[tournamentId]
 *
 * CURRENTLY DISABLED - Enable via ENABLE_TMI=true environment variable
 *
 * The SSE broadcasting happens automatically when the vote is POSTed.
 * No need to touch SSE directly from this module.
 *
 * Usage (when enabled):
 * ```
 * import { startTmiVoteListener } from '@/server/twitch/tmiVotes';
 *
 * // In your server initialization
 * if (process.env.ENABLE_TMI === 'true') {
 *   startTmiVoteListener({
 *     tournamentId: 'tournament-123',
 *     channels: ['channel1', 'channel2'],
 *   });
 * }
 * ```
 */

import tmi from 'tmi.js';

export interface TmiVoteListenerOptions {
  tournamentId: string;
  channels: string[];
  voteEndpoint?: string; // Default: http://localhost:3000/api/votes
  username?: string; // Twitch bot username
  token?: string; // Twitch OAuth token (from env: TWITCH_BOT_TOKEN)
}

let tmiClient: tmi.Client | null = null;

/**
 * Initialize tmi.js client and listen for votes in chat
 * Only enabled if ENABLE_TMI=true
 */
export async function startTmiVoteListener(
  options: TmiVoteListenerOptions
): Promise<void> {
  if (process.env.ENABLE_TMI !== 'true') {
    console.log('[TMI] Vote listener disabled (ENABLE_TMI !== "true")');
    return;
  }

  const {
    tournamentId,
    channels,
    voteEndpoint = 'http://localhost:3000',
    username = process.env.TWITCH_BOT_USERNAME || 'flex_bot',
    token = process.env.TWITCH_BOT_TOKEN,
  } = options;

  if (!token) {
    console.error('[TMI] TWITCH_BOT_TOKEN not set, cannot start listener');
    return;
  }

  try {
    tmiClient = new tmi.Client({
      options: { debug: true },
      identity: {
        username,
        password: `oauth:${token}`,
      },
      channels,
    });

    await tmiClient.connect();
    console.log(`[TMI] Connected to Twitch chat, listening in: ${channels.join(', ')}`);

    // Listen for chat messages
    tmiClient.on('message', async (channel, tags, message, self) => {
      if (self) return; // Ignore our own messages

      // Parse vote command: !vote A, !vote B, etc.
      const voteMatch = message.match(/^!vote\s+(\S+)$/i);
      if (!voteMatch) return;

      const vote = voteMatch[1].toUpperCase();
      const username = tags['display-name'] || tags.username || 'anonymous';
      const userId = tags['user-id'];

      console.log(
        `[TMI] Vote received from ${username}: "${vote}" in ${channel}`
      );

      // Forward to vote API endpoint
      try {
        const response = await fetch(
          `${voteEndpoint}/api/votes/${tournamentId}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId,
              username,
              vote,
              ts: Date.now(),
            }),
          }
        );

        if (!response.ok) {
          console.error(
            `[TMI] Failed to post vote: ${response.status} ${response.statusText}`
          );
        }
      } catch (error) {
        console.error('[TMI] Error forwarding vote to API:', error);
      }
    });

    console.log('[TMI] Vote listener started successfully');
  } catch (error) {
    console.error('[TMI] Failed to start vote listener:', error);
    throw error;
  }
}

/**
 * Stop the tmi.js client
 */
export async function stopTmiVoteListener(): Promise<void> {
  if (tmiClient) {
    await tmiClient.disconnect();
    tmiClient = null;
    console.log('[TMI] Vote listener stopped');
  }
}

/**
 * Get the current tmi.js client instance
 */
export function getTmiClient(): tmi.Client | null {
  return tmiClient;
}

/**
 * TODO (Phase 2): When enabling this module:
 * 1. Add environment variables to .env.local:
 *    - ENABLE_TMI=true
 *    - TWITCH_BOT_USERNAME=your_bot_username
 *    - TWITCH_BOT_TOKEN=your_oauth_token
 *
 * 2. Call startTmiVoteListener() from your server initialization (e.g., in a Next.js API route or custom server)
 *
 * 3. Test with a stress test:
 *    ```bash
 *    # This will send 100 POST requests to the API endpoint
 *    node scripts/test-vote-generation.js 100
 *    ```
 */
