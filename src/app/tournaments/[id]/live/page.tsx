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
import TwitchChannelModal from '@/components/Tournament/TwitchChannelModal';
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
  const urlChannel = searchParams.get('channel');

  const [pageError, setPageError] = useState<string | null>(null); // Erreurs générales de la page
  const [showConfetti, setShowConfetti] = useState(false);
  const [hasShownRestoreNotification, setHasShownRestoreNotification] = useState(false);
  const [showChannelModal, setShowChannelModal] = useState(false);
  const [liveTwitchChannel, setLiveTwitchChannel] = useState<string | null>(urlChannel);

  // Hook pour les données initiales
  const { tournamentId, tournamentTitle, initialItems, isLoadingData, dataError, setDataError: setTournamentDataError, tournamentMode } = useTournamentData();

  // Hook pour la logique du tournoi
  const {
    matches, currentMatchIndex, tournamentWinner, secondPlace, thirdPlace, setTournamentWinner, currentRoundNumber,
    isTournamentActive, setIsTournamentActive, selectedItemCountOption, setSelectedItemCountOption,
    activeMatch, startTournament, handleDeclareWinnerAndNext, handleStopTournament, updateScore,
  } = useTournamentLogic({ 
    initialItems, 
    onTournamentError: setPageError, 
    twoCategoryMode: tournamentMode === 'TWO_CATEGORY',
    tournamentId
  });

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

  // Show modal for Twitch channel when tournament is restored
  useEffect(() => {
    // Wait for data to load before checking
    if (isLoadingData) return;
    
    console.log('Restore check:', { 
      hasShownRestoreNotification, 
      isTournamentActive, 
      matchesLength: matches.length, 
      urlChannel,
      liveTwitchChannel,
      isLoadingData
    });
    
    if (!hasShownRestoreNotification && isTournamentActive && matches.length > 0) {
      // Tournament was restored from localStorage
      console.log('Tournament restored - opening modal for channel confirmation');
      setShowChannelModal(true);
      setHasShownRestoreNotification(true);
    }
  }, [isTournamentActive, matches.length, hasShownRestoreNotification, urlChannel, liveTwitchChannel, isLoadingData]);


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

  const handleChannelConfirm = useCallback((channel: string) => {
    setLiveTwitchChannel(channel);
    setShowChannelModal(false);
    
    const { toast } = require('react-hot-toast');
    toast.success('Tournoi restauré ! Vous pouvez reprendre là où vous vous êtes arrêté.', {
      duration: 4000,
      position: 'top-center',
      icon: '🔄',
    });
  }, []);

  const handleChannelCancel = useCallback(() => {
    setShowChannelModal(false);
    
    const { toast } = require('react-hot-toast');
    toast('Vous pouvez continuer sans connexion Twitch, mais les votes ne seront pas comptabilisés.', {
      duration: 5000,
      position: 'top-center',
      icon: '⚠️',
    });
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
  // Only require channel if tournament is not active (starting new tournament)
  if (!tournamentId || (!liveTwitchChannel && !isTournamentActive && !showChannelModal)) {
      return <ErrorDisplay message="ID du tournoi ou canal Twitch manquant dans l'URL." onClose={() => window.close()} />;
  }

  if (tournamentWinner) {
    return (
      // Un conteneur similaire à PreTournamentSetup pour centrer l'affichage du vainqueur
      <div className="min-h-screen text-white flex flex-col items-center justify-center p-4">
        <GlobalStyles />
        
        {/* Twitch Channel Modal */}
        <TwitchChannelModal
          isOpen={showChannelModal}
          onConfirm={handleChannelConfirm}
          onCancel={handleChannelCancel}
          defaultChannel={urlChannel || ''}
        />
        
        {/* Vous pouvez ajouter un TournamentHeader simplifié ici si vous le souhaitez */}
        <TournamentWinnerDisplay
          winner={tournamentWinner}
          secondPlace={secondPlace}
          thirdPlace={thirdPlace}
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
      <>
        {/* Twitch Channel Modal */}
        <TwitchChannelModal
          isOpen={showChannelModal}
          onConfirm={handleChannelConfirm}
          onCancel={handleChannelCancel}
          defaultChannel={urlChannel || ''}
        />
        
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
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex flex-col">
      <GlobalStyles />
      <Toaster position='bottom-center' />
      
      {/* Twitch Channel Modal */}
      <TwitchChannelModal
        isOpen={showChannelModal}
        onConfirm={handleChannelConfirm}
        onCancel={handleChannelCancel}
        defaultChannel={urlChannel || ''}
      />
      
      {/* Header Section */}
      <div className="border-b border-slate-800/50 backdrop-blur-sm sticky top-0 z-50 bg-slate-900/80">
          <TournamentHeader
            title={tournamentTitle}
            liveTwitchChannel={liveTwitchChannel}
            isTmiConnected={isTmiConnected}
            tmiError={tmiError}
            generalError={pageError && activeMatch ? pageError : null}
          />
      </div>

      {/* Main Arena */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 md:px-8 py-8 md:py-12">
        <div className="w-full max-w-[1800px]">
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
              <NoMatchScreen />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Control Bar */}
      {isTournamentActive && !tournamentWinner && (
        <div className="border-t border-slate-800/50 bg-slate-900/80 backdrop-blur-sm">
          <div className="max-w-[1800px] mx-auto px-4 md:px-8 py-6 flex justify-center">
            <motion.button
              onClick={handleStopTournament}
              className="px-10 py-4 bg-gradient-to-r from-slate-800 to-slate-900 hover:from-red-900/40 hover:to-slate-900 border-2 border-slate-700 hover:border-red-500/50 text-gray-300 hover:text-white font-bold rounded-xl shadow-xl flex items-center gap-3 transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FaStopCircle className="text-2xl text-red-400" /> 
              <div className="flex flex-col items-start">
                <span className="text-lg">Arrêter le Tournoi</span>
                <span className="text-xs text-gray-500 font-normal">Réinitialiser et recommencer</span>
              </div>
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
}