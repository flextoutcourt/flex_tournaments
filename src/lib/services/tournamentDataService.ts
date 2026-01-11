/**
 * Tournament Data Service - Handles tournament data loading and caching
 * Abstracts sessionStorage and data parsing logic
 */

import { Item, TournamentConfig } from '@/types/tournament';
import { getYouTubeVideoId } from '@/utils/youtubeUtils';

export interface TournamentDataResult {
  id: string;
  title: string;
  mode: string;
  items: Item[];
  categories: string[] | null;
}

export class TournamentDataService {
  /**
   * Load tournament data from sessionStorage
   */
  static loadFromSession(tournamentId: string): TournamentDataResult | null {
    if (!tournamentId) return null;

    try {
      const storedData = sessionStorage.getItem(`tournamentData_${tournamentId}`);
      if (!storedData) return null;

      const data = JSON.parse(storedData);
      return TournamentDataService.validate(data);
    } catch (error) {
      console.error('[TournamentDataService] Failed to load from session:', error);
      return null;
    }
  }

  /**
   * Validate tournament data structure
   */
  static validate(data: any): TournamentDataResult {
    if (!data?.items || data.items.length < 2) {
      throw new Error(
        'Données du tournoi invalides ou participants insuffisants (minimum 2).'
      );
    }

    if (!data.title) {
      throw new Error('Données du tournoi invalides: titre manquant.');
    }

    return {
      id: data.id || 'unknown',
      title: data.title,
      mode: data.mode || 'STANDARD',
      categories: data.categories || null,
      items: TournamentDataService.enrichItems(data.items),
    };
  }

  /**
   * Enrich items with processed YouTube video IDs
   */
  static enrichItems(items: any[]): Item[] {
    return items.map((item) => ({
      ...item,
      youtubeVideoId: item.youtubeUrl
        ? getYouTubeVideoId(item.youtubeUrl)
        : undefined,
    }));
  }

  /**
   * Save tournament data to sessionStorage
   */
  static saveToSession(tournamentId: string, data: TournamentConfig): void {
    try {
      sessionStorage.setItem(
        `tournamentData_${tournamentId}`,
        JSON.stringify(data)
      );
    } catch (error) {
      console.error('[TournamentDataService] Failed to save to session:', error);
    }
  }

  /**
   * Clear tournament data from sessionStorage
   */
  static clearSession(tournamentId: string): void {
    try {
      sessionStorage.removeItem(`tournamentData_${tournamentId}`);
    } catch (error) {
      console.error('[TournamentDataService] Failed to clear session:', error);
    }
  }
}
