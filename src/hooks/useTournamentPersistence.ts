/**
 * useTournamentPersistence Hook
 * Handles saving tournament state to TournamentSession via API (per-user tracking)
 * Each user has their own session tracking their progress through the tournament
 */

'use client';

import { useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { CurrentMatch } from '@/types';

interface UseTournamentPersistenceProps {
  tournamentId?: string | null;
  currentMatchIndex: number;
  currentRoundNumber: number;
  tournamentWinner: any | null;
  matches: CurrentMatch[];
  twitchChannel?: string | null;
}

export function useTournamentPersistence({
  tournamentId,
  currentMatchIndex,
  currentRoundNumber,
  tournamentWinner,
  matches,
  twitchChannel,
}: UseTournamentPersistenceProps) {
  const { data: session } = useSession();
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedStateRef = useRef<string>('');

  useEffect(() => {
    // Only save if we have a tournament ID and user is logged in
    if (!tournamentId || !session?.user?.id) {
      return;
    }

    // Create hash of current state to detect changes
    const currentStateHash = JSON.stringify({
      currentMatchIndex,
      currentRoundNumber,
      tournamentWinnerId: tournamentWinner?.id,
      matchCount: matches.length,
    });

    // Only save if state actually changed
    if (currentStateHash === lastSavedStateRef.current) {
      return;
    }

    lastSavedStateRef.current = currentStateHash;

    // Clear previous timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Debounce by 500ms to batch rapid changes
    saveTimeoutRef.current = setTimeout(async () => {
      try {
        const userId = session.user.id;

        console.log('[Hook] Saving tournament session:', {
          tournamentId,
          userId,
          currentMatchIndex,
          currentRoundNumber,
          matchesCount: matches.length,
        });

        // Call API endpoint to save to database
        const response = await fetch(`/api/tournament-session/${tournamentId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            currentMatchIndex,
            currentRoundNumber,
            tournamentWinnerId: tournamentWinner?.id || null,
            matches: matches.map((m, i) => ({
              index: i,
              item1: m.item1,
              item2: m.item2,
              winner: m.winner,
              votes1: m.votes1 || 0,
              votes2: m.votes2 || 0,
            })),
            participants: [],
            scores: {},
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          console.error('[Hook] ✗ API error:', error);
          return;
        }

        const data = await response.json();
        console.log('[Hook] ✓ Session saved successfully');
      } catch (error) {
        console.error('[Hook] ✗ Failed to save session:', error);
      }
    }, 500);

    // Cleanup on unmount
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [tournamentId, session?.user?.id, currentMatchIndex, currentRoundNumber, tournamentWinner, matches]);

  return {
    // Return session info for component use if needed
    userId: session?.user?.id,
    userEmail: session?.user?.email,
  };
}
