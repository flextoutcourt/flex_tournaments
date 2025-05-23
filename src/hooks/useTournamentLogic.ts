// app/tournament/[id]/live/hooks/useTournamentLogic.ts
import { useState, useCallback, useMemo } from 'react';
import { Item, CurrentMatch } from '../types';
import { shuffleArray } from '../utils/arrayUtils';
import { generateMatches } from '@/utils/tournamentHelper';

interface UseTournamentLogicProps {
  initialItems: Item[];
  onTournamentError: (message: string) => void;
}

export function useTournamentLogic({ initialItems, onTournamentError }: UseTournamentLogicProps) {
  const [matches, setMatches] = useState<CurrentMatch[]>([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [advancingToNextRound, setAdvancingToNextRound] = useState<Item[]>([]);
  const [tournamentWinner, setTournamentWinner] = useState<Item | null>(null);
  const [currentRoundNumber, setCurrentRoundNumber] = useState(1);
  const [isTournamentActive, setIsTournamentActive] = useState(false);
  const [selectedItemCountOption, setSelectedItemCountOption] = useState<string>("all");

  const activeMatch = useMemo(() => {
    if (!isTournamentActive || tournamentWinner || matches.length === 0 || currentMatchIndex >= matches.length) {
      return null;
    }
    return matches[currentMatchIndex];
  }, [isTournamentActive, tournamentWinner, matches, currentMatchIndex]);

  const startTournament = useCallback(() => {
    onTournamentError(""); // Clear previous errors
    let participantsForThisRun: Item[];
    const numSelected = selectedItemCountOption === "all" ? initialItems.length : parseInt(selectedItemCountOption);

    if (initialItems.length < 2) {
      onTournamentError("Au moins 2 participants sont requis pour démarrer.");
      return;
    }
    if (numSelected < 2) {
      onTournamentError("Veuillez sélectionner au moins 2 participants pour ce tournoi.");
      return;
    }

    if (numSelected > initialItems.length) {
      participantsForThisRun = shuffleArray([...initialItems]);
    } else if (selectedItemCountOption === "all") {
      participantsForThisRun = shuffleArray([...initialItems]);
    } else {
      participantsForThisRun = shuffleArray([...initialItems]).slice(0, numSelected);
    }
    
    if (participantsForThisRun.length < 2) { 
      onTournamentError("Sélection invalide, pas assez de participants pour démarrer.");
      return;
    }

    console.log(`Début du tournoi avec ${participantsForThisRun.length} participants.`);
    
    setCurrentRoundNumber(1);
    setTournamentWinner(null);
    setIsTournamentActive(true);

    const { matches: firstRoundMatches, byeParticipant: firstRoundBye } = generateMatches(participantsForThisRun, 1);
    setMatches(firstRoundMatches);
    setCurrentMatchIndex(0);
    setAdvancingToNextRound(firstRoundBye ? [firstRoundBye] : []);
    
    if (firstRoundMatches.length === 0 && firstRoundBye) {
      setTournamentWinner(firstRoundBye);
      setIsTournamentActive(false);
      console.log(`🏆 VAINQUEUR (bye initial unique): ${firstRoundBye.name} 🏆`);
    }
  }, [initialItems, selectedItemCountOption, onTournamentError]);

  const handleDeclareWinnerAndNext = useCallback((winnerKey: 'item1' | 'item2') => {
    if (!activeMatch || tournamentWinner) return;

    const winnerOfMatch = winnerKey === 'item1' ? activeMatch.item1 : activeMatch.item2;
    const winnerItem: Item = { id: winnerOfMatch.id, name: winnerOfMatch.name, youtubeUrl: winnerOfMatch.youtubeUrl, youtubeVideoId: winnerOfMatch.youtubeVideoId };
    
    const currentRoundAdvancers = [...advancingToNextRound, winnerItem];

    if (currentMatchIndex < matches.length - 1) {
      setAdvancingToNextRound(currentRoundAdvancers);
      setCurrentMatchIndex(prev => prev + 1);
    } else {
      if (currentRoundAdvancers.length === 0 && matches.length > 0) {
        onTournamentError("Erreur critique: Aucun participant n'avance.");
        setIsTournamentActive(false);
        return;
      }
      if (currentRoundAdvancers.length === 1) {
        setTournamentWinner(currentRoundAdvancers[0]);
        setIsTournamentActive(false);
        console.log(`🏆 VAINQUEUR DU TOURNOI: ${currentRoundAdvancers[0].name} 🏆`);
      } else if (currentRoundAdvancers.length > 1) {
        const nextRound = currentRoundNumber + 1;
        setCurrentRoundNumber(nextRound);
        
        const { matches: nextMatchesGenerated, byeParticipant: nextRoundBye } = generateMatches(currentRoundAdvancers, nextRound);
        setMatches(nextMatchesGenerated);
        setCurrentMatchIndex(0);
        setAdvancingToNextRound(nextRoundBye ? [nextRoundBye] : []);

        if (nextMatchesGenerated.length === 0 && nextRoundBye) {
          setTournamentWinner(nextRoundBye);
          setIsTournamentActive(false);
          console.log(`🏆 VAINQUEUR (par bye au round ${nextRound}): ${nextRoundBye.name} 🏆`);
        } else if (nextMatchesGenerated.length === 0 && !nextRoundBye ) {
          onTournamentError("Erreur lors de la génération du round suivant.");
          setIsTournamentActive(false);
        }
      } else {
        setIsTournamentActive(false); // Fin du tournoi, aucun qualifié
      }
    }
  }, [activeMatch, tournamentWinner, advancingToNextRound, matches, currentMatchIndex, currentRoundNumber, onTournamentError]);

  const handleStopTournament = useCallback(() => {
    setIsTournamentActive(false);
    setMatches([]);
    setCurrentMatchIndex(0);
    setAdvancingToNextRound([]);
    setTournamentWinner(null);
    setCurrentRoundNumber(1);
    onTournamentError(""); // Clear errors
  }, [onTournamentError]);

  const updateScore = useCallback((matchIndex: number, itemKey: 'item1' | 'item2') => {
    setMatches(prevMatches => {
      if (matchIndex >= prevMatches.length || !prevMatches[matchIndex]) {
        return prevMatches;
      }
      return prevMatches.map((match, index) => {
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
      });
    });
  }, []);

  return {
    matches,
    currentMatchIndex,
    advancingToNextRound,
    tournamentWinner,
    setTournamentWinner, // Exposer pour le showConfetti
    currentRoundNumber,
    isTournamentActive,
    setIsTournamentActive, // Exposer pour le showConfetti
    selectedItemCountOption,
    setSelectedItemCountOption,
    activeMatch,
    startTournament,
    handleDeclareWinnerAndNext,
    handleStopTournament,
    updateScore,
    setMatches // Pourrait être utile pour des cas spécifiques de reset/manipulation externe
  };
}