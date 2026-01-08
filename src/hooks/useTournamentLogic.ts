/**
 * useTournamentLogic Hook - Tournament state management
 * Delegates business logic to TournamentLogicService
 */

'use client';

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { Item, CurrentMatch, MatchParticipant } from '../types';
import { TournamentLogicService, TournamentState } from '@/lib/services/tournamentLogicService';

interface UseTournamentLogicProps {
  initialItems: Item[];
  onTournamentError: (message: string) => void;
  twoCategoryMode?: boolean;
  tournamentId?: string | null;
  categoryA?: string | null;
  categoryB?: string | null;
}

export function useTournamentLogic({
  initialItems,
  onTournamentError,
  twoCategoryMode = false,
  tournamentId = null,
  categoryA = null,
  categoryB = null,
}: UseTournamentLogicProps) {
  const getStorageKey = useCallback(() => (tournamentId ? `tournamentState_${tournamentId}` : null), [tournamentId]);

  // State management using single object for clarity
  const [state, setState] = useState<TournamentState>(() => {
    const storageKey = getStorageKey();
    const saved = TournamentLogicService.loadState(storageKey);
    return (
      saved || {
        matches: [],
        currentMatchIndex: 0,
        advancingToNextRound: [],
        tournamentWinner: null,
        secondPlace: null,
        thirdPlace: null,
        currentRoundNumber: 1,
        isTournamentActive: false,
        selectedItemCountOption: 'all',
        participantsForThisRun: [],
        categoryAWins: 0,
        categoryBWins: 0,
      }
    );
  });

  // Auto-save state to localStorage with debouncing
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    // Clear previous timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Debounce save by 500ms
    saveTimeoutRef.current = setTimeout(() => {
      const storageKey = getStorageKey();
      if (storageKey) {
        TournamentLogicService.saveState(storageKey, state);
      }
    }, 500);

    // Cleanup on unmount
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [state, getStorageKey]);

  // Get active match
  const activeMatch = useMemo(() => {
    if (!state.isTournamentActive || state.tournamentWinner || state.matches.length === 0 || state.currentMatchIndex >= state.matches.length) {
      return null;
    }
    return state.matches[state.currentMatchIndex];
  }, [state.isTournamentActive, state.tournamentWinner, state.matches, state.currentMatchIndex]);

  // Start tournament
  const startTournament = useCallback(() => {
    onTournamentError('');

    try {
      const result = TournamentLogicService.initializeTournament(
        initialItems,
        state.selectedItemCountOption,
        twoCategoryMode,
        categoryA,
        categoryB
      );

      if (result) {
        setState((prev) => ({ ...prev, ...result }));
      }
    } catch (e: any) {
      onTournamentError(e.message);
    }
  }, [initialItems, state.selectedItemCountOption, onTournamentError, twoCategoryMode, categoryA, categoryB]);

  // Declare winner and advance
  const handleDeclareWinnerAndNext = useCallback(() => {
    if (state.tournamentWinner) return;

    // Ask which item won (since we need to know which one)
    // This is handled by the caller passing winnerKey
    // For now, we'll need to expose a handler that takes the winner key
  }, [state.tournamentWinner]);

  // Internal: Update state when winner is declared
  const _handleWinner = useCallback(
    (winnerKey: 'item1' | 'item2') => {
      const updates = TournamentLogicService.handleWinner(state, winnerKey, twoCategoryMode, categoryA, categoryB);

      if (updates) {
        setState((prev) => ({ ...prev, ...updates }));
      }
    },
    [state, twoCategoryMode, categoryA, categoryB]
  );

  // Stop tournament
  const handleStopTournament = useCallback(() => {
    setState((prev) => ({
      ...prev,
      ...TournamentLogicService.resetTournament(),
    }));
    TournamentLogicService.clearState(getStorageKey());
    onTournamentError('');
  }, [getStorageKey, onTournamentError]);

  // Update score
  const updateScore = useCallback((matchIndex: number, itemKey: 'item1' | 'item2') => {
    setState((prev) => TournamentLogicService.updateScore(prev, matchIndex, itemKey));
  }, []);

  // Modify score by amount
  const modifyScore = useCallback((matchIndex: number, itemKey: 'item1' | 'item2', amount: number) => {
    setState((prev) => TournamentLogicService.modifyScore(prev, matchIndex, itemKey, amount));
  }, []);

  // Expose public interface
  return {
    // State
    matches: state.matches,
    currentMatchIndex: state.currentMatchIndex,
    advancingToNextRound: state.advancingToNextRound,
    tournamentWinner: state.tournamentWinner,
    secondPlace: state.secondPlace,
    thirdPlace: state.thirdPlace,
    currentRoundNumber: state.currentRoundNumber,
    isTournamentActive: state.isTournamentActive,
    selectedItemCountOption: state.selectedItemCountOption,
    participantsForThisRun: state.participantsForThisRun,
    categoryAWins: state.categoryAWins,
    categoryBWins: state.categoryBWins,
    activeMatch,

    // State setters
    setTournamentWinner: (item: Item | null) => setState((prev) => ({ ...prev, tournamentWinner: item })),
    setIsTournamentActive: (active: boolean) => setState((prev) => ({ ...prev, isTournamentActive: active })),
    setSelectedItemCountOption: (option: string) => setState((prev) => ({ ...prev, selectedItemCountOption: option })),
    setMatches: (matches: CurrentMatch[]) => setState((prev) => ({ ...prev, matches })),

    // Actions
    startTournament,
    handleDeclareWinnerAndNext: _handleWinner,
    handleStopTournament,
    updateScore,
    modifyScore,
  };
}