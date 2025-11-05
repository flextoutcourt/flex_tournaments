import { STORAGE_KEYS } from '@/constants/tournament';

/**
 * Tournament state structure for persistence
 */
export interface TournamentState {
  matches: any[];
  currentMatchIndex: number;
  advancingToNextRound: any[];
  tournamentWinner: any | null;
  currentRoundNumber: number;
  isTournamentActive: boolean;
  selectedItemCountOption: string;
  participantsForThisRun: any[];
}

/**
 * Tournament storage utility for managing localStorage operations
 */
export class TournamentStorage {
  /**
   * Check if localStorage is available
   */
  private static isAvailable(): boolean {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Save tournament state to localStorage
   */
  static saveState(tournamentId: string, state: TournamentState): boolean {
    if (!this.isAvailable()) {
      console.warn('localStorage is not available');
      return false;
    }

    try {
      const key = STORAGE_KEYS.TOURNAMENT_STATE(tournamentId);
      localStorage.setItem(key, JSON.stringify(state));
      console.log('Tournament state saved for:', tournamentId);
      return true;
    } catch (error) {
      console.error('Error saving tournament state:', error);
      return false;
    }
  }

  /**
   * Load tournament state from localStorage
   */
  static loadState(tournamentId: string): TournamentState | null {
    if (!this.isAvailable()) {
      console.warn('localStorage is not available');
      return null;
    }

    try {
      const key = STORAGE_KEYS.TOURNAMENT_STATE(tournamentId);
      const savedState = localStorage.getItem(key);
      
      if (!savedState) {
        return null;
      }

      const state = JSON.parse(savedState) as TournamentState;
      console.log('Tournament state loaded for:', tournamentId);
      return state;
    } catch (error) {
      console.error('Error loading tournament state:', error);
      return null;
    }
  }

  /**
   * Check if a saved state exists for a tournament
   */
  static hasState(tournamentId: string): boolean {
    if (!this.isAvailable()) {
      return false;
    }

    try {
      const key = STORAGE_KEYS.TOURNAMENT_STATE(tournamentId);
      return localStorage.getItem(key) !== null;
    } catch (error) {
      console.error('Error checking tournament state:', error);
      return false;
    }
  }

  /**
   * Clear tournament state from localStorage
   */
  static clearState(tournamentId: string): boolean {
    if (!this.isAvailable()) {
      return false;
    }

    try {
      const key = STORAGE_KEYS.TOURNAMENT_STATE(tournamentId);
      localStorage.removeItem(key);
      console.log('Tournament state cleared for:', tournamentId);
      return true;
    } catch (error) {
      console.error('Error clearing tournament state:', error);
      return false;
    }
  }

  /**
   * Clear all tournament states from localStorage
   */
  static clearAllStates(): boolean {
    if (!this.isAvailable()) {
      return false;
    }

    try {
      const keys = Object.keys(localStorage);
      const tournamentKeys = keys.filter(key => key.startsWith('tournamentState_'));
      
      tournamentKeys.forEach(key => localStorage.removeItem(key));
      console.log(`Cleared ${tournamentKeys.length} tournament states`);
      return true;
    } catch (error) {
      console.error('Error clearing all tournament states:', error);
      return false;
    }
  }
}
