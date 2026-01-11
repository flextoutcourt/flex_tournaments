/**
 * useTmiClient Hook - Orchestrates TMI services for tournament voting
 * 
 * Responsibilities:
 * - Manages TMI connection lifecycle
 * - Coordinates vote handling and deduplication
 * - Handles moderator commands
 * - Pure orchestration - all business logic delegated to services
 */

import { useState, useEffect, useRef } from 'react';
import { UseTmiClientProps, CurrentMatch, VotePayload } from '@/types/tmi';
import { VOTE_KEYWORDS_ITEM1, VOTE_KEYWORDS_ITEM2 } from '../constants';
import { TmiConnectionService } from '@/lib/services/tmiConnectionService';
import { VoteService } from '@/lib/services/voteService';
import { VoteDuplicationService } from '@/lib/services/voteDuplicationService';
import { TmiMessageHandlerService } from '@/lib/services/tmiMessageHandler';

export function useTmiClient({
  liveTwitchChannel,
  isTournamentActive,
  tournamentWinner,
  activeMatch,
  currentMatchIndex,
  onScoreUpdate,
  onModifyScore,
  onVoteReceived,
  tournamentId,
}: UseTmiClientProps) {
  // Service instances
  const connectionServiceRef = useRef<TmiConnectionService | null>(null);
  const voteServiceRef = useRef<VoteService | null>(null);
  const deduplicationServiceRef = useRef<VoteDuplicationService | null>(null);
  const messageHandlerServiceRef = useRef<TmiMessageHandlerService | null>(null);

  // State
  const [isTmiConnected, setIsTmiConnected] = useState(false);
  const [tmiError, setTmiError] = useState<string | null>(null);

  // Initialize services
  useEffect(() => {
    console.log('[useTmiClient] Initializing services, tournamentId:', tournamentId);
    if (!connectionServiceRef.current) {
      connectionServiceRef.current = new TmiConnectionService();
    }
    if (!voteServiceRef.current && tournamentId) {
      voteServiceRef.current = new VoteService(tournamentId);
      console.log('[useTmiClient] VoteService initialized');
    }
    if (!deduplicationServiceRef.current) {
      deduplicationServiceRef.current = new VoteDuplicationService();
    }
    if (!messageHandlerServiceRef.current) {
      messageHandlerServiceRef.current = new TmiMessageHandlerService();
    }
  }, [tournamentId]);

  // Update match in deduplication service
  useEffect(() => {
    if (deduplicationServiceRef.current && activeMatch) {
      const matchId = `${activeMatch.roundNumber}-${activeMatch.matchNumberInRound}-${activeMatch.item1.id}-${activeMatch.item2.id}`;
      deduplicationServiceRef.current.setCurrentMatch(matchId);
    }
  }, [activeMatch]);

  // Manage TMI connection
  useEffect(() => {
    console.log('[useTmiClient] Connection effect running:', {
      liveTwitchChannel,
      tournamentWinner,
      willConnect: !!liveTwitchChannel && !tournamentWinner,
    });

    // Disconnect if tournament has ended or no channel
    if (!liveTwitchChannel || tournamentWinner) {
      console.log('[useTmiClient] ⚠️ Disconnecting TMI');
      if (connectionServiceRef.current) {
        connectionServiceRef.current.disconnect();
        setIsTmiConnected(false);
      }
      return;
    }

    let isMounted = true;

    const connect = async () => {
      console.log('[useTmiClient] 🔌 Starting TMI connection to:', liveTwitchChannel);
      if (connectionServiceRef.current && isMounted) {
        const success = await connectionServiceRef.current.connect(liveTwitchChannel);
        if (isMounted) {
          console.log('[useTmiClient] Connection result:', { success, channel: liveTwitchChannel });
          setIsTmiConnected(success);
          if (!success) {
            const state = connectionServiceRef.current.getState();
            console.error('[useTmiClient] ❌ Connection failed:', state.error);
            setTmiError(state.error);
          } else {
            console.log('[useTmiClient] ✅ TMI connected to:', liveTwitchChannel);
            setTmiError(null);
          }
        }
      }
    };

    connect();

    return () => {
      console.log('[useTmiClient] Cleanup: marking unmounted');
      isMounted = false;
      if (connectionServiceRef.current) {
        connectionServiceRef.current.disconnect();
        setIsTmiConnected(false);
      }
    };
  }, [liveTwitchChannel, tournamentWinner]);

  // Handle chat messages
  useEffect(() => {
    const client = connectionServiceRef.current?.getClient();
    
    console.log('[useTmiClient] Message handler effect triggered:', {
      hasClient: !!client,
      isReady: connectionServiceRef.current?.isReady(),
      hasActiveMatch: !!activeMatch,
      hasTournamentId: !!tournamentId,
      activeMatchId: activeMatch?.item1?.id,
    });
    
    // Need: client, active match, tournament id, and tournament not ended
    if (!client || !activeMatch || !tournamentId || tournamentWinner) {
      console.log('[useTmiClient] ⚠️ Skipping message handler - missing requirements:', {
        hasClient: !!client,
        hasActiveMatch: !!activeMatch,
        hasTournamentId: !!tournamentId,
        hasTournamentWinner: !!tournamentWinner,
      });
      return;
    }

    console.log('[useTmiClient] ✅ Attaching message listener to TMI client');

    const messageHandler = (
      channel: string,
      tags: any,
      message: string,
      self: boolean
    ) => {
      if (self || !tags.username) {
        if (self) console.log('[useTmiClient] Ignoring self message');
        if (!tags.username) console.log('[useTmiClient] Ignoring message without username');
        return;
      }

      const username = tags.username.toLowerCase();
      const messageHandler = messageHandlerServiceRef.current;
      const voteService = voteServiceRef.current;
      const deduplicationService = deduplicationServiceRef.current;

      console.log('[useTmiClient] 📨 Received message from', username, ':', message, {
        hasMessageHandler: !!messageHandler,
        hasVoteService: !!voteService,
        hasDedup: !!deduplicationService,
        serviceRefs: {
          messageHandler: !!messageHandlerServiceRef.current,
          voteService: !!voteServiceRef.current,
          dedup: !!deduplicationServiceRef.current,
        }
      });

      if (!messageHandler || !voteService || !deduplicationService) {
        console.warn('[useTmiClient] ❌ Missing services', {
          hasMessageHandler: !!messageHandler,
          hasVoteService: !!voteService,
          hasDedup: !!deduplicationService,
        });
        return;
      }

      // Handle moderator commands
      if (messageHandler.isModerator(username)) {
        const command = messageHandler.parseModeratorCommand(message);
        if (command) {
          const votedItem = command.voteNumber === '1' ? 'item1' : 'item2';
          const amount =
            command.type === 'set'
              ? command.targetScore! - (votedItem === 'item1'
                  ? activeMatch.item1.score
                  : activeMatch.item2.score)
              : command.type === 'add'
              ? command.amount
              : -command.amount;

          onModifyScore(currentMatchIndex, votedItem, amount);
          console.log(`[TMI MOD] 🎯 ${command.type} ${amount} votes to ${votedItem}`);
          return;
        }
      }

      // Check for duplicate vote
      if (deduplicationService.hasVoted(username)) {
        console.log('[useTmiClient] ⏭️ Duplicate vote from', username, '- skipping');
        return;
      }

      // Regular vote for item 1
      if (messageHandler.isVoteKeyword(message, VOTE_KEYWORDS_ITEM1)) {
        console.log('[useTmiClient] 🗳️ Vote for item1 from', username);
        deduplicationService.markAsVoted(username);
        const payload = voteService.createVotePayload('1', username);
        console.log('[useTmiClient] 📤 Sending vote payload:', payload);
        voteService.sendVote(payload).catch((err) => {
          console.error('[TMI] ❌ Failed to send vote:', err);
        });
        return;
      }

      // Regular vote for item 2
      if (messageHandler.isVoteKeyword(message, VOTE_KEYWORDS_ITEM2)) {
        console.log('[useTmiClient] 🗳️ Vote for item2 from', username);
        deduplicationService.markAsVoted(username);
        const payload = voteService.createVotePayload('2', username);
        console.log('[useTmiClient] 📤 Sending vote payload:', payload);
        voteService.sendVote(payload).catch((err) => {
          console.error('[TMI] ❌ Failed to send vote:', err);
        });
        return;
      }

      // Super vote
      if (messageHandler.isSuperVote(message)) {
        deduplicationService.markAsVoted(username);
        const voteValue = messageHandler.extractSuperVoteValue(message);
        if (voteValue) {
          const payloads = voteService.createSuperVotePayloads(voteValue, username);
          voteService.sendVotes(payloads).catch((err) => {
            console.error('[TMI] Failed to send super votes:', err);
          });
        }
        return;
      }
    };

    client.on('message', messageHandler);

    return () => {
      if (client) {
        client.removeListener('message', messageHandler);
      }
    };
  }, [
    isTournamentActive,
    activeMatch,
    tournamentId,
    tournamentWinner,
    currentMatchIndex,
    onModifyScore,
  ]);

  return {
    tmiClient: connectionServiceRef.current?.getClient() || null,
    isTmiConnected,
    tmiError,
    setTmiError,
    votedUsers: new Map(),
    superVotesThisMatch: new Set(),
  };
}
