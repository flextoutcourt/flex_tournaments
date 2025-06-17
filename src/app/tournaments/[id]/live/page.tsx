// app/tournament/[id]/live/page.tsx
'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { FaStopCircle } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useTournamentData } from '@/hooks/useTournamentData';
import { useTournamentLogic } from '@/hooks/useTournamentLogic';
import { useYouTubeApi, useYouTubePlayers } from '@/hooks/useYoutubeApi';
import { useTmiClient } from '@/hooks/useTmiClient';
import { AVAILABLE_TOURNAMENT_SIZES } from '@/constants';
import LoadingSpinner from '@/components/Shared/LoadingSpinner';
import ErrorDisplay from '@/components/Tournament/ErrorDisplay';
import PreTournamentSetup from '@/components/Tournament/PreTournamentSetup';
import TournamentWinnerDisplay from '@/components/Tournament/TournamentWinnerDisplay';
import ActiveMatchView from '@/components/Tournament/ActiveMatchView';
import NoMatchScreen from '@/components/Tournament/NoMatchScreen';
import TournamentHeader from '@/components/Tournament/Navigation/Header';
import { Toaster } from 'react-hot-toast';

// Styles globaux pour les confettis (ou mettez-les dans un fichier CSS global)
const GlobalStyles = () => (
  <style jsx global>{`
    .confetti-container { overflow: hidden; }
    .confetti {
      position: absolute;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      animation-name: fall;
      animation-timing-function: linear;
      animation-iteration-count: infinite;
      pointer-events: none;
    }
    @keyframes fall {
      0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
      100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
    }
  `}</style>
);


export default function TournamentLivePage() {
  const searchParams = useSearchParams();
  const liveTwitchChannel = searchParams.get('channel');

  const [pageError, setPageError] = useState<string | null>(null); // Erreurs générales de la page
  const [showConfetti, setShowConfetti] = useState(false);

  // Hook pour les données initiales
  const { tournamentId, tournamentTitle, initialItems, isLoadingData, dataError, setDataError: setTournamentDataError } = useTournamentData();

  // Hook pour la logique du tournoi
  const {
    matches, currentMatchIndex, tournamentWinner, setTournamentWinner, currentRoundNumber,
    isTournamentActive, setIsTournamentActive, selectedItemCountOption, setSelectedItemCountOption,
    activeMatch, startTournament, handleDeclareWinnerAndNext, handleStopTournament, updateScore,
  } = useTournamentLogic({ initialItems, onTournamentError: setPageError });

  // Hook pour l'API YouTube et les players
  const { ytApiReady } = useYouTubeApi(); // Initialise et vérifie si l'API YT est prête
  const { player1Ref, player2Ref, playerError, setPlayerError } = useYouTubePlayers(
    activeMatch?.item1?.youtubeVideoId,
    activeMatch?.item2?.youtubeVideoId,
    ytApiReady
  );
  
  // Hook pour TMI
  const { isTmiConnected, tmiError, setTmiError, votedUsers } = useTmiClient({
    liveTwitchChannel,
    isTournamentActive,
    tournamentWinner,
    activeMatch,
    currentMatchIndex,
    onScoreUpdate: updateScore,
  });

  // Combiner les erreurs pour l'affichage
  useEffect(() => {
    if (dataError) setPageError(dataError);
    else if (playerError) setPageError(playerError);
    // tmiError est géré dans TournamentHeader mais pourrait aussi être mis ici
  }, [dataError, playerError]);


  useEffect(() => {
    if (tournamentWinner) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 7000);
      return () => clearTimeout(timer);
    }
  }, [tournamentWinner]);

  const handleMouseEnterPlayer = useCallback((playerRef: React.MutableRefObject<YT.Player | null>) => {
    if (playerRef.current && typeof playerRef.current.playVideo === 'function') {
      playerRef.current.playVideo();
    }
  }, []);

  const handleMouseLeavePlayer = useCallback((playerRef: React.MutableRefObject<YT.Player | null>) => {
    if (playerRef.current && typeof playerRef.current.pauseVideo === 'function') {
      playerRef.current.pauseVideo();
    }
  }, []);

  const getValidTournamentSizes = useMemo(() => {
    if (initialItems.length === 0) return [];
    return AVAILABLE_TOURNAMENT_SIZES.filter(size => size <= initialItems.length);
  }, [initialItems]);

  // ----- Rendu ----- //
  if (isLoadingData) {
    return <LoadingSpinner />;
  }

  // Erreur bloquante avant le démarrage (e.g. sessionStorage)
  if (dataError && !isTournamentActive && initialItems.length === 0) {
      // Si initialItems est vide à cause d'une erreur de chargement, on ne peut pas continuer.
      return <ErrorDisplay message={dataError} onClose={() => window.close()} />;
  }
  if (!tournamentId || !liveTwitchChannel && !isTournamentActive) {
      return <ErrorDisplay message="ID du tournoi ou canal Twitch manquant dans l'URL." onClose={() => window.close()} />;
  }

  if (tournamentWinner) {
    return (
      // Un conteneur similaire à PreTournamentSetup pour centrer l'affichage du vainqueur
      <div className="min-h-screen text-white flex flex-col items-center justify-center p-4">
        <GlobalStyles />
        {/* Vous pouvez ajouter un TournamentHeader simplifié ici si vous le souhaitez */}
        <TournamentWinnerDisplay
          winner={tournamentWinner}
          showConfetti={showConfetti}
          onClosePage={() => {
            handleStopTournament(); // Ceci réinitialise tournamentWinner et isTournamentActive
            // Les appels setTournamentWinner(null) et setIsTournamentActive(false) ici sont redondants
            // car handleStopTournament s'en charge.
            // Le composant se re-rendra et affichera PreTournamentSetup.
          }}
        />
      </div>
    );
  }


  if (!isTournamentActive) {
    return (
      <PreTournamentSetup
        tournamentTitle={tournamentTitle}
        liveTwitchChannel={liveTwitchChannel}
        initialItems={initialItems}
        selectedItemCountOption={selectedItemCountOption}
        onSelectedItemCountChange={setSelectedItemCountOption}
        onStartTournament={startTournament}
        error={pageError}
        validTournamentSizes={getValidTournamentSizes} // Assurez-vous que la prop a été corrigée suite à l'erreur précédente
      />
    );
  }

  return (
    <div className="min-h-screen text-white flex flex-col items-center p-4 pt-6 md:pt-10 transition-all duration-500 ease-in-out">
      <GlobalStyles />
      <Toaster position='bottom-left' />
      <TournamentHeader
        title={tournamentTitle}
        liveTwitchChannel={liveTwitchChannel}
        isTmiConnected={isTmiConnected}
        tmiError={tmiError}
        generalError={pageError && activeMatch ? pageError : null}
      />

      <AnimatePresence mode="wait">
        {activeMatch ? (
          <ActiveMatchView
            activeMatch={activeMatch}
            matchesCount={matches.length}
            onDeclareWinner={handleDeclareWinnerAndNext}
            onMouseEnterPlayer={handleMouseEnterPlayer}
            onMouseLeavePlayer={handleMouseLeavePlayer}
            player1Ref={player1Ref}
            player2Ref={player2Ref}
            votedUsers={votedUsers}
          />
        ) : (
          // Ce cas (isTournamentActive = true, mais pas d'activeMatch et pas de winner)
          // peut arriver brièvement entre les rounds ou si une erreur survient pendant la génération des matchs.
          <NoMatchScreen />
        )}
      </AnimatePresence>

      {/* Le bouton "Arrêter" ne s'affiche que si le tournoi est actif et qu'il n'y a pas encore de vainqueur */}
      {isTournamentActive && !tournamentWinner && (
        <motion.button
          onClick={handleStopTournament}
          className="mt-12 px-8 py-3 bg-gray-700 hover:bg-gray-600 text-gray-300 font-medium rounded-lg shadow-lg flex items-center transition-colors"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          <FaStopCircle className="mr-2.5" /> Arrêter et Réinitialiser
        </motion.button>
      )}
    </div>
  );
}