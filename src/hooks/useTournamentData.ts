// app/tournament/[id]/live/hooks/useTournamentData.ts
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Item } from '../types';
import { getYouTubeVideoId } from '../utils/youtubeUtils';

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
      const storedData = sessionStorage.getItem(`tournamentData_${tournamentId}`);
      if (!storedData) {
        throw new Error("Données du tournoi non trouvées. Veuillez relancer depuis la page du tournoi.");
      }
      const data: any = JSON.parse(storedData);
      if (!data.items || data.items.length < 2 || !data.title) {
        throw new Error("Données du tournoi invalides ou participants insuffisants (minimum 2).");
      }
      setTournamentTitle(data.title);
      setTournamentMode(data.mode ?? 'STANDARD');
      setTournamentCategories(data.categories ?? null);
      setInitialItems(data.items.map((item: any) => ({
        ...item,
        youtubeVideoId: getYouTubeVideoId(item.youtubeUrl)
      })));
    } catch (e: any) {
      setDataError(e.message || "Erreur lors de la récupération des données du tournoi.");
      console.error("Erreur chargement sessionStorage:", e);
    } finally {
      setIsLoadingData(false);
    }
  }, [tournamentId]);

  return { tournamentId, tournamentTitle, initialItems, isLoadingData, dataError, setDataError, tournamentMode, tournamentCategories };
}