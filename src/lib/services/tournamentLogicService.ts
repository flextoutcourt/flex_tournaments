/**
 * TournamentLogicService - Pure tournament logic
 * Encapsulates state management and match generation logic
 */

import { Item, CurrentMatch, MatchParticipant } from '@/app/tournament/[id]/live/types';
import { shuffleArray } from '@/utils/arrayUtils';
import { generateMatches } from '@/utils/tournamentHelper';

export interface TournamentState {
  matches: CurrentMatch[];
  currentMatchIndex: number;
  advancingToNextRound: Item[];
  tournamentWinner: Item | null;
  secondPlace: MatchParticipant | null;
  thirdPlace: MatchParticipant | null;
  currentRoundNumber: number;
  isTournamentActive: boolean;
  selectedItemCountOption: string;
  participantsForThisRun: Item[];
  categoryAWins: number;
  categoryBWins: number;
}

export class TournamentLogicService {
  /**
   * Load state from localStorage
   */
  static loadState(storageKey: string | null): TournamentState | null {
    if (!storageKey) return null;
    
    // Only access localStorage on client side
    if (typeof window === 'undefined') return null;

    try {
      const savedState = localStorage.getItem(storageKey);
      if (!savedState) return null;
      return JSON.parse(savedState) as TournamentState;
    } catch (error) {
      console.error('Error loading tournament state:', error);
      return null;
    }
  }

  /**
   * Save state to localStorage
   */
  static saveState(storageKey: string | null, state: TournamentState): void {
    if (!storageKey) return;
    
    // Only access localStorage on client side
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(storageKey, JSON.stringify(state));
    } catch (error) {
      console.error('Error saving tournament state:', error);
    }
  }

  /**
   * Clear state from localStorage
   */
  static clearState(storageKey: string | null): void {
    if (!storageKey) return;

    try {
      localStorage.removeItem(storageKey);
    } catch (error) {
      console.error('Error clearing tournament state:', error);
    }
  }

  /**
   * Initialize tournament from items
   */
  static initializeTournament(
    initialItems: Item[],
    selectedItemCount: string,
    twoCategoryMode: boolean = false,
    categoryA: string | null = null,
    categoryB: string | null = null
  ): Partial<TournamentState> | null {
    if (initialItems.length < 2) {
      throw new Error('Au moins 2 participants sont requis pour démarrer.');
    }

    const numSelected = selectedItemCount === 'all' ? initialItems.length : parseInt(selectedItemCount);
    if (numSelected < 2) {
      throw new Error('Veuillez sélectionner au moins 2 participants pour ce tournoi.');
    }

    let participants: Item[];
    if (numSelected > initialItems.length) {
      participants = shuffleArray([...initialItems]);
    } else if (selectedItemCount === 'all') {
      participants = shuffleArray([...initialItems]);
    } else {
      participants = shuffleArray([...initialItems]).slice(0, numSelected);
    }

    if (participants.length < 2) {
      throw new Error('Sélection invalide, pas assez de participants pour démarrer.');
    }

    console.log(`Début du tournoi avec ${participants.length} participants.`);

    const orderedCats =
      twoCategoryMode && categoryA && categoryB ? ([categoryA, categoryB] as [string, string]) : undefined;
    const { matches: firstRoundMatches, byeParticipant: firstRoundBye } = generateMatches(
      participants,
      1,
      twoCategoryMode,
      orderedCats
    );

    const state: Partial<TournamentState> = {
      participantsForThisRun: participants,
      currentRoundNumber: 1,
      tournamentWinner: null,
      secondPlace: null,
      thirdPlace: null,
      isTournamentActive: true,
      categoryAWins: 0,
      categoryBWins: 0,
      matches: firstRoundMatches,
      currentMatchIndex: 0,
      advancingToNextRound: firstRoundBye ? [firstRoundBye] : [],
    };

    // Handle case where first round produces immediate winner (bye only)
    if (firstRoundMatches.length === 0 && firstRoundBye) {
      state.tournamentWinner = firstRoundBye;
      state.isTournamentActive = false;
      console.log(`🏆 VAINQUEUR (bye initial unique): ${firstRoundBye.name} 🏆`);
    }

    return state;
  }

  /**
   * Handle winner declaration and advance to next round
   */
  static handleWinner(
    state: TournamentState,
    winnerKey: 'item1' | 'item2',
    twoCategoryMode: boolean = false,
    categoryA: string | null = null,
    categoryB: string | null = null
  ): Partial<TournamentState> | null {
    const { activeMatch, matches, currentMatchIndex, advancingToNextRound, currentRoundNumber } = state;

    if (!state.matches[state.currentMatchIndex]) return null;

    const activeMatch2 = state.matches[state.currentMatchIndex];
    const winnerOfMatch = winnerKey === 'item1' ? activeMatch2.item1 : activeMatch2.item2;
    const loserOfMatch = winnerKey === 'item1' ? activeMatch2.item2 : activeMatch2.item1;

    const loserParticipant: MatchParticipant = loserOfMatch;
    const winnerItem: Item = {
      id: winnerOfMatch.id,
      name: winnerOfMatch.name,
      youtubeUrl: winnerOfMatch.youtubeUrl,
      youtubeVideoId: winnerOfMatch.youtubeVideoId,
      category: winnerOfMatch.category,
    };

    console.log('Winner declared:', {
      twoCategoryMode,
      winnerCategory: winnerOfMatch.category,
      winnerName: winnerOfMatch.name,
    });

    const updates: Partial<TournamentState> = {};

    // Increment category counters in TWO_CATEGORY mode
    if (twoCategoryMode && winnerOfMatch.category) {
      const normalizedWinnerCategory = winnerOfMatch.category.trim().toLowerCase();
      const normalizedCategoryA = categoryA?.trim().toLowerCase();
      const normalizedCategoryB = categoryB?.trim().toLowerCase();

      if (normalizedWinnerCategory === normalizedCategoryA) {
        updates.categoryAWins = (state.categoryAWins || 0) + 1;
      } else if (normalizedWinnerCategory === normalizedCategoryB) {
        updates.categoryBWins = (state.categoryBWins || 0) + 1;
      }
    }

    const currentRoundAdvancers = [...advancingToNextRound, winnerItem];

    // Not the last match of this round
    if (currentMatchIndex < matches.length - 1) {
      updates.advancingToNextRound = currentRoundAdvancers;
      if (matches.length === 2 && currentMatchIndex === 0) {
        updates.thirdPlace = loserParticipant;
      }
      updates.currentMatchIndex = currentMatchIndex + 1;
    } else {
      // Last match of this round
      if (currentRoundAdvancers.length === 1) {
        // Final complete - winner found
        updates.tournamentWinner = currentRoundAdvancers[0];
        updates.secondPlace = loserParticipant;
        updates.isTournamentActive = false;
        console.log(`🏆 VAINQUEUR DU TOURNOI: ${currentRoundAdvancers[0].name} 🏆`);
        console.log(`🥈 DEUXIÈME PLACE: ${loserParticipant.name}`);
      } else if (currentRoundAdvancers.length > 1) {
        // Generate next round
        const nextRound = currentRoundNumber + 1;
        const orderedCats =
          twoCategoryMode && categoryA && categoryB ? ([categoryA, categoryB] as [string, string]) : undefined;
        const { matches: nextMatches, byeParticipant: nextBye } = generateMatches(
          currentRoundAdvancers,
          nextRound,
          twoCategoryMode,
          orderedCats
        );

        updates.currentRoundNumber = nextRound;
        updates.matches = nextMatches;
        updates.currentMatchIndex = 0;
        updates.advancingToNextRound = nextBye ? [nextBye] : [];

        if (nextMatches.length === 0 && nextBye) {
          updates.tournamentWinner = nextBye;
          updates.isTournamentActive = false;
          console.log(`🏆 VAINQUEUR (par bye au round ${nextRound}): ${nextBye.name} 🏆`);
        }
      } else {
        updates.isTournamentActive = false;
      }
    }

    return updates;
  }

  /**
   * Update score in a match
   */
  static updateScore(state: TournamentState, matchIndex: number, itemKey: 'item1' | 'item2'): TournamentState {
    if (matchIndex >= state.matches.length || !state.matches[matchIndex]) {
      return state;
    }

    return {
      ...state,
      matches: state.matches.map((match, index) => {
        if (index === matchIndex) {
          const updatedMatch = { ...match };
          if (itemKey === 'item1') {
            updatedMatch.item1 = { ...match.item1, score: match.item1.score + 1 };
          } else {
            updatedMatch.item2 = { ...match.item2, score: match.item2.score + 1 };
          }
          return updatedMatch;
        }
        return match;
      }),
    };
  }

  /**
   * Modify score by amount (can be negative)
   */
  static modifyScore(state: TournamentState, matchIndex: number, itemKey: 'item1' | 'item2', amount: number): TournamentState {
    if (matchIndex >= state.matches.length || !state.matches[matchIndex]) {
      return state;
    }

    return {
      ...state,
      matches: state.matches.map((match, index) => {
        if (index === matchIndex) {
          const updatedMatch = { ...match };
          if (itemKey === 'item1') {
            const newScore = Math.max(0, match.item1.score + amount);
            updatedMatch.item1 = { ...match.item1, score: newScore };
          } else {
            const newScore = Math.max(0, match.item2.score + amount);
            updatedMatch.item2 = { ...match.item2, score: newScore };
          }
          return updatedMatch;
        }
        return match;
      }),
    };
  }

  /**
   * Reset tournament state
   */
  static resetTournament(): Partial<TournamentState> {
    return {
      matches: [],
      currentMatchIndex: 0,
      advancingToNextRound: [],
      tournamentWinner: null,
      secondPlace: null,
      thirdPlace: null,
      currentRoundNumber: 1,
      isTournamentActive: false,
      participantsForThisRun: [],
      categoryAWins: 0,
      categoryBWins: 0,
    };
  }
}
