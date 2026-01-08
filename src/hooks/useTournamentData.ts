/**
 * useTournamentData Hook - Load tournament data from sessionStorage
 * Delegates to TournamentDataService for data loading
 */

'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Item } from '../types';
import { TournamentDataService } from '@/lib/services/tournamentDataService';

export function useTournamentData() {
  const params = useParams();
  const tournamentId = typeof params.id === 'string' ? params.id : null;

  const [tournamentTitle, setTournamentTitle] = useState<string | null>(null);
  const [initialItems, setInitialItems] = useState<Item[]>([]);
  const [tournamentMode, setTournamentMode] = useState<string | null>(null);
  const [tournamentCategories, setTournamentCategories] = useState<string[] | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [dataError, setDataError] = useState<string | null>(null);

  useEffect(() => {
    if (!tournamentId) {
      setDataError("ID du tournoi manquant dans l'URL.");
      setIsLoadingData(false);
      return;
    }

    try {
      const data = TournamentDataService.loadFromSession(tournamentId);
      TournamentDataService.validate(data);

      setTournamentTitle(data.title);
      setTournamentMode(data.mode ?? 'STANDARD');
      setTournamentCategories(data.categories ?? null);
      setInitialItems(TournamentDataService.enrichItems(data.items));
    } catch (e: any) {
      setDataError(e.message || 'Erreur lors de la récupération des données du tournoi.');
      console.error('Erreur chargement sessionStorage:', e);
    } finally {
      setIsLoadingData(false);
    }
  }, [tournamentId]);

  return {
    tournamentId,
    tournamentTitle,
    initialItems,
    isLoadingData,
    dataError,
    setDataError,
    tournamentMode,
    tournamentCategories,
  };
}