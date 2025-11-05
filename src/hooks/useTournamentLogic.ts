// app/tournament/[id]/live/hooks/useTournamentLogic.ts
import { useState, useCallback, useMemo, useEffect } from 'react';
import { Item, CurrentMatch, MatchParticipant } from '../types';
import { shuffleArray } from '../utils/arrayUtils';
import { generateMatches } from '@/utils/tournamentHelper';

interface UseTournamentLogicProps {
  initialItems: Item[];
  onTournamentError: (message: string) => void;
  twoCategoryMode?: boolean;
  tournamentId?: string | null;
}

interface TournamentState {
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
}

export function useTournamentLogic({ initialItems, onTournamentError, twoCategoryMode = false, tournamentId = null }: UseTournamentLogicProps) {
  const getStorageKey = () => tournamentId ? `tournamentState_${tournamentId}` : null;

  // Initialize state from localStorage if available
  const [matches, setMatches] = useState<CurrentMatch[]>([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [advancingToNextRound, setAdvancingToNextRound] = useState<Item[]>([]);
  const [tournamentWinner, setTournamentWinner] = useState<Item | null>(null);
  const [secondPlace, setSecondPlace] = useState<MatchParticipant | null>(null);
  const [thirdPlace, setThirdPlace] = useState<MatchParticipant | null>(null);
  const [currentRoundNumber, setCurrentRoundNumber] = useState(1);
  const [isTournamentActive, setIsTournamentActive] = useState(false);
  const [selectedItemCountOption, setSelectedItemCountOption] = useState<string>("all");
  const [participantsForThisRun, setParticipantsForThisRun] = useState<Item[]>([]);
  const [isStateRestored, setIsStateRestored] = useState(false);

  // Restore state from localStorage on mount
  useEffect(() => {
    const storageKey = getStorageKey();
    if (!storageKey || isStateRestored) return;

    try {
      const savedState = localStorage.getItem(storageKey);
      if (savedState) {
        const state: TournamentState = JSON.parse(savedState);
        console.log('Restoring tournament state:', state);
        
        setMatches(state.matches);
        setCurrentMatchIndex(state.currentMatchIndex);
        setAdvancingToNextRound(state.advancingToNextRound);
        setTournamentWinner(state.tournamentWinner);
        setSecondPlace(state.secondPlace || null);
        setThirdPlace(state.thirdPlace || null);
        setCurrentRoundNumber(state.currentRoundNumber);
        setIsTournamentActive(state.isTournamentActive);
        setSelectedItemCountOption(state.selectedItemCountOption);
        setParticipantsForThisRun(state.participantsForThisRun);
      }
    } catch (error) {
      console.error('Error restoring tournament state:', error);
    } finally {
      setIsStateRestored(true);
    }
  }, [tournamentId, isStateRestored]);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (!isStateRestored) return; // Don't save until we've attempted restore
    
    const storageKey = getStorageKey();
    if (!storageKey) return;

    const state: TournamentState = {
      matches,
      currentMatchIndex,
      advancingToNextRound,
      tournamentWinner,
      secondPlace,
      thirdPlace,
      currentRoundNumber,
      isTournamentActive,
      selectedItemCountOption,
      participantsForThisRun,
    };

    try {
      localStorage.setItem(storageKey, JSON.stringify(state));
      console.log('Tournament state saved');
    } catch (error) {
      console.error('Error saving tournament state:', error);
    }
  }, [matches, currentMatchIndex, advancingToNextRound, tournamentWinner, secondPlace, thirdPlace, currentRoundNumber, isTournamentActive, selectedItemCountOption, participantsForThisRun, isStateRestored]);

  const activeMatch = useMemo(() => {
    if (!isTournamentActive || tournamentWinner || matches.length === 0 || currentMatchIndex >= matches.length) {
      return null;
    }
    return matches[currentMatchIndex];
  }, [isTournamentActive, tournamentWinner, matches, currentMatchIndex]);

  const startTournament = useCallback(() => {
    onTournamentError(""); // Clear previous errors
    let participants: Item[];
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
      participants = shuffleArray([...initialItems]);
    } else if (selectedItemCountOption === "all") {
      participants = shuffleArray([...initialItems]);
    } else {
      participants = shuffleArray([...initialItems]).slice(0, numSelected);
    }
    
    if (participants.length < 2) { 
      onTournamentError("Sélection invalide, pas assez de participants pour démarrer.");
      return;
    }

    console.log(`Début du tournoi avec ${participants.length} participants.`);
    
    setParticipantsForThisRun(participants);
    setCurrentRoundNumber(1);
    setTournamentWinner(null);
    setSecondPlace(null);
    setThirdPlace(null);
    setIsTournamentActive(true);

  const { matches: firstRoundMatches, byeParticipant: firstRoundBye } = generateMatches(participants, 1, twoCategoryMode);
    setMatches(firstRoundMatches);
    setCurrentMatchIndex(0);
    setAdvancingToNextRound(firstRoundBye ? [firstRoundBye] : []);
    
    if (firstRoundMatches.length === 0 && firstRoundBye) {
      setTournamentWinner(firstRoundBye);
      setIsTournamentActive(false);
      console.log(`🏆 VAINQUEUR (bye initial unique): ${firstRoundBye.name} 🏆`);
    }
  }, [initialItems, selectedItemCountOption, onTournamentError, twoCategoryMode]);

  const handleDeclareWinnerAndNext = useCallback((winnerKey: 'item1' | 'item2') => {
    if (!activeMatch || tournamentWinner) return;

    const winnerOfMatch = winnerKey === 'item1' ? activeMatch.item1 : activeMatch.item2;
    const loserOfMatch = winnerKey === 'item1' ? activeMatch.item2 : activeMatch.item1;
    // Keep as MatchParticipant for podium tracking
    const loserParticipant: MatchParticipant = loserOfMatch;
    // Convert winner to Item for advancers array
    const winnerItem: Item = { id: winnerOfMatch.id, name: winnerOfMatch.name, youtubeUrl: winnerOfMatch.youtubeUrl, youtubeVideoId: winnerOfMatch.youtubeVideoId, category: winnerOfMatch.category };
    
    const currentRoundAdvancers = [...advancingToNextRound, winnerItem];

    // Track losers from semi-finals (when advancing to final with 2 people)
    if (currentMatchIndex < matches.length - 1) {
      setAdvancingToNextRound(currentRoundAdvancers);
      // If this round will produce exactly 2 advancers (semi-final), track the loser for 3rd place
      if (matches.length === 2 && currentMatchIndex === 0) {
        setThirdPlace(loserParticipant); // First semi-final loser
      } else if (matches.length === 2 && currentMatchIndex === 1) {
        // Second semi-final loser - could track both, but we'll just keep the most recent
        // In a real scenario, you might want to track both and let them compete
      }
      setCurrentMatchIndex(prev => prev + 1);
    } else {
      if (currentRoundAdvancers.length === 0 && matches.length > 0) {
        onTournamentError("Erreur critique: Aucun participant n'avance.");
        setIsTournamentActive(false);
        return;
      }
      if (currentRoundAdvancers.length === 1) {
        // This is the final! Track the podium
        setTournamentWinner(currentRoundAdvancers[0]);
        setSecondPlace(loserParticipant); // Loser of final = 2nd place
        setIsTournamentActive(false);
        console.log(`🏆 VAINQUEUR DU TOURNOI: ${currentRoundAdvancers[0].name} 🏆`);
        console.log(`🥈 DEUXIÈME PLACE: ${loserParticipant.name}`);
        
        // Clear saved state when tournament ends with a winner
        const storageKey = getStorageKey();
        if (storageKey) {
          try {
            localStorage.removeItem(storageKey);
            console.log('Tournament state cleared - winner declared');
          } catch (error) {
            console.error('Error clearing tournament state:', error);
          }
        }
      } else if (currentRoundAdvancers.length > 1) {
        const nextRound = currentRoundNumber + 1;
        setCurrentRoundNumber(nextRound);
        
  const { matches: nextMatchesGenerated, byeParticipant: nextRoundBye } = generateMatches(currentRoundAdvancers, nextRound, twoCategoryMode);
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
    setSecondPlace(null);
    setThirdPlace(null);
    setCurrentRoundNumber(1);
    setParticipantsForThisRun([]);
    onTournamentError(""); // Clear errors
    
    // Clear saved state from localStorage
    const storageKey = getStorageKey();
    if (storageKey) {
      try {
        localStorage.removeItem(storageKey);
        console.log('Tournament state cleared');
      } catch (error) {
        console.error('Error clearing tournament state:', error);
      }
    }
  }, [onTournamentError, tournamentId]);

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
    secondPlace,
    thirdPlace,
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