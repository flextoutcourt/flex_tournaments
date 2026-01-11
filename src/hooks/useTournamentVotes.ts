/**
 * useTournamentVotes Hook - Tournament SSE voting system
 * Delegates SSE connection and vote batching to SSEVoteService
 */

'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { SSEVoteService, Vote } from '@/lib/services/sseVoteService';

export interface UseTournamentVotesOptions {
  tournamentId: string;
  onBatchVotes?: (votes: Vote[]) => void;
  autoConnect?: boolean;
  subscribeUrl?: string;
  batchWindowMs?: number;
}

/**
 * Hook to connect to tournament SSE and receive votes
 */
export function useTournamentVotes({
  tournamentId,
  onBatchVotes,
  autoConnect = true,
  subscribeUrl,
  batchWindowMs = 20,
}: UseTournamentVotesOptions) {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [voteCount, setVoteCount] = useState(0);
  const serviceRef = useRef<SSEVoteService | null>(null);

  // Initialize service (only once)
  useEffect(() => {
    if (!serviceRef.current) {
      serviceRef.current = new SSEVoteService({
        tournamentId,
        subscribeUrl,
        batchWindowMs,
      });
    }
  }, [tournamentId, subscribeUrl, batchWindowMs]);

  // Auto-connect and handle batch votes
  useEffect(() => {
    console.log('[useTournamentVotes] ============ EFFECT RUNNING ============');
    console.log('[useTournamentVotes] Conditions:', {
      autoConnect,
      hasServiceRef: !!serviceRef.current,
      tournamentId,
      hasOnBatchVotes: !!onBatchVotes,
    });
    
    if (!autoConnect || !serviceRef.current || !tournamentId) {
      console.log('[useTournamentVotes] ⚠️  Skipping auto-connect:', {
        autoConnect,
        hasService: !!serviceRef.current,
        tournamentId,
      });
      return;
    }

    console.log('[useTournamentVotes] 🔌 CONNECTING to SSE for tournament:', tournamentId);

    const handleBatch = (batch: Vote[]) => {
      console.log('[useTournamentVotes] 📥 Batch received:', {
        batchSize: batch.length,
        hasCallback: !!onBatchVotes,
      });
      setVoteCount((prev) => prev + batch.length);
      if (onBatchVotes) {
        console.log('[useTournamentVotes] Calling onBatchVotes callback');
        onBatchVotes(batch);
      }
    };

    serviceRef.current.connect(handleBatch).then((connected) => {
      console.log('[useTournamentVotes] ✅ Connection attempt finished:', {
        connected,
        tournamentId,
      });
      if (connected) {
        setIsConnected(true);
        setError(null);
        console.log('[useTournamentVotes] ✅ SSE CONNECTED for tournament:', tournamentId);
      } else {
        setIsConnected(false);
        setError('Failed to connect to vote stream');
        console.error('[useTournamentVotes] ❌ SSE CONNECTION FAILED for tournament:', tournamentId);
      }
    });

    return () => {
      console.log('[useTournamentVotes] Cleanup: disconnecting and flushing');
      // Flush any pending votes
      if (serviceRef.current) {
        serviceRef.current.flushPending();
      }
    };
  }, [autoConnect, tournamentId]);

  // Expose public methods
  const connect = useCallback(async () => {
    if (!serviceRef.current) return;
    const handleBatch = (batch: Vote[]) => {
      setVoteCount((prev) => prev + batch.length);
      onBatchVotes?.(batch);
    };
    const connected = await serviceRef.current.connect(handleBatch);
    setIsConnected(connected);
  }, [onBatchVotes]);

  const disconnect = useCallback(() => {
    serviceRef.current?.disconnect();
    setIsConnected(false);
  }, []);

  const forceReconnect = useCallback(async () => {
    serviceRef.current?.disconnect();
    setIsConnected(false);
    setTimeout(() => {
      connect();
    }, 100);
  }, [connect]);

  const clearVotes = useCallback(() => {
    setVoteCount(0);
  }, []);

  const flushPendingVotes = useCallback(() => {
    serviceRef.current?.flushPending();
  }, []);

  return {
    isConnected,
    error,
    votes: voteCount,
    connect,
    disconnect,
    forceReconnect,
    clearVotes,
    flushPendingVotes,
  };
}
