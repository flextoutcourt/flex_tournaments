// app/tournament/[id]/live/page.tsx
'use client';

import React, { useState, useEffect, useCallback, useMemo, useTransition } from 'react';
import { flushSync } from 'react-dom';
import { useSearchParams } from 'next/navigation';
import { FaStopCircle } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useTournamentData } from '@/hooks/useTournamentData';
import { useTournamentLogic } from '@/hooks/useTournamentLogic';
import { useYouTubeApi, useYouTubePlayers } from '@/hooks/useYoutubeApi';
import { useTmiClient } from '@/hooks/useTmiClient';
import { useTournamentVotes } from '@/hooks/useTournamentVotes';
import { useTournamentPersistence } from '@/hooks/useTournamentPersistence';
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
  const [showFirstRoundRecap, setShowFirstRoundRecap] = useState(false);
  const [lastRoundNumber, setLastRoundNumber] = useState(1);

  // Ref to store the vote animation trigger function
  const animateVoteToTargetRef = React.useRef<((itemId: 'item1' | 'item2') => void) | null>(null);

  // Wrapper callback that always uses the current ref value
  const handleVoteReceived = React.useCallback((itemId: 'item1' | 'item2') => {
    if (animateVoteToTargetRef.current) {
      animateVoteToTargetRef.current(itemId);
    }
  }, []);

  // Hook pour les données initiales
  const { tournamentId, tournamentTitle, initialItems, isLoadingData, dataError: _dataError, tournamentMode, tournamentCategories } = useTournamentData();

  // Extract category names for display
  const categoryA = tournamentCategories?.[0];
  const categoryB = tournamentCategories?.[1];

  // Hook pour la logique du tournoi
  const {
    matches, currentMatchIndex, tournamentWinner, secondPlace, thirdPlace, selectedItemCountOption, setSelectedItemCountOption,
    activeMatch, startTournament, handleDeclareWinnerAndNext, handleStopTournament, updateScore, modifyScore, categoryAWins, categoryBWins, isTournamentActive, currentRoundNumber,
  } = useTournamentLogic({ 
    initialItems, 
    onTournamentError: setPageError, 
    twoCategoryMode: tournamentMode === 'TWO_CATEGORY',
    tournamentId,
    categoryA: categoryA || null,
    categoryB: categoryB || null,
  });

  // Hook pour l'API YouTube et les players
  const { ytApiReady } = useYouTubeApi(); // Initialise et vérifie si l'API YT est prête
  const { player1Ref, player2Ref, playerError: _playerError } = useYouTubePlayers(
    activeMatch?.item1?.youtubeVideoId,
    activeMatch?.item2?.youtubeVideoId,
    ytApiReady
  );
  
  // Hook pour TMI
  const { isTmiConnected, tmiError: _tmiError, superVotesThisMatch, votedUsers } = useTmiClient({
    liveTwitchChannel,
    isTournamentActive,
    tournamentWinner,
    activeMatch,
    currentMatchIndex,
    onScoreUpdate: updateScore,
    onModifyScore: modifyScore,
    onVoteReceived: handleVoteReceived,
    tournamentId,
  });

  // Hook for persisting tournament state to database per user
  useTournamentPersistence({
    tournamentId,
    currentMatchIndex,
    currentRoundNumber,
    tournamentWinner,
    matches,
    twitchChannel: liveTwitchChannel || undefined,
  });

  // Ref to store current match index for use in vote callback
  const currentMatchIndexRef = React.useRef(currentMatchIndex);
  const totalVotesProcessedRef = React.useRef(0);
  
  // Update ref when currentMatchIndex changes
  React.useEffect(() => {
    currentMatchIndexRef.current = currentMatchIndex;
  }, [currentMatchIndex]);

  // Memoize batch votes handler to prevent unnecessary reconnects
  const handleBatchVotes = React.useCallback((batchVotes: any) => {
    console.log('[TournamentLivePage] 📊 handleBatchVotes called:', {
      batchSize: batchVotes.length,
      votes: batchVotes.map((v: any) => ({ username: v.username, vote: v.vote })),
    });
    // Process entire batch at once - animations handle individual updates
    flushSync(() => {
      batchVotes.forEach((vote: any) => {
        const itemId = vote.vote === '1' ? 'item1' : 'item2';
        totalVotesProcessedRef.current++;
        console.log('[TournamentLivePage] Processing vote:', {
          username: vote.username,
          vote: vote.vote,
          itemId,
          totalProcessed: totalVotesProcessedRef.current,
        });
        updateScore(currentMatchIndexRef.current, itemId);
      });
    });
  }, [updateScore]);

  // Hook for SSE vote subscription with batching (auto-connects on init)
  const { isConnected: isVotesConnected, votes, forceReconnect, flushPendingVotes } = useTournamentVotes({
    tournamentId: tournamentId || '',
    autoConnect: !!tournamentId,
    batchWindowMs: 20, // Faster batching (20ms window)
    onBatchVotes: handleBatchVotes,
  });

  // Flush pending votes when match changes and page is ready
  useEffect(() => {
    if (activeMatch && !matches[currentMatchIndex]?.isProcessing) {
      flushPendingVotes();
    }
  }, [activeMatch?.id, currentMatchIndex, matches, flushPendingVotes]);

  // Reconnect vote listener when tournament starts
  useEffect(() => {
    if (isTournamentActive && tournamentId) {
      forceReconnect();
    }
  }, [isTournamentActive, tournamentId, forceReconnect]);

  // Combiner les erreurs pour l'affichage
  useEffect(() => {
    if (_dataError) setPageError(_dataError);
    else if (_playerError) setPageError(_playerError);
    // tmiError est géré dans TournamentHeader mais pourrait aussi être mis ici
  }, [_dataError, _playerError]);

  // Show modal for Twitch channel - either for tournament restoration or first load
  useEffect(() => {
    // Wait for data to load before checking
    if (isLoadingData) return;
    
    console.log('[TournamentLivePage] Channel modal check:', {
      hasShownRestoreNotification,
      isTournamentActive,
      hasMatchesLength: matches.length,
      urlChannel,
      liveTwitchChannel,
      showChannelModal,
    });

    // Scenario 1: Tournament was restored from localStorage
    if (!hasShownRestoreNotification && isTournamentActive && matches.length > 0) {
      console.log('[TournamentLivePage] Showing modal for tournament restoration');
      setShowChannelModal(true);
      setHasShownRestoreNotification(true);
    }
    // Scenario 2: First load - no channel from URL and tournament not active
    else if (!hasShownRestoreNotification && !isTournamentActive && !urlChannel && !liveTwitchChannel && !showChannelModal) {
      console.log('[TournamentLivePage] Showing modal for first-time channel selection');
      setShowChannelModal(true);
      setHasShownRestoreNotification(true);
    }
  }, [matches.length, hasShownRestoreNotification, urlChannel, liveTwitchChannel, isLoadingData, isTournamentActive, showChannelModal]);

  // Detect when first round ends and show recap
  useEffect(() => {
    if (tournamentMode === 'TWO_CATEGORY' && currentRoundNumber > lastRoundNumber && lastRoundNumber === 1) {
      setShowFirstRoundRecap(true);
    }
    setLastRoundNumber(currentRoundNumber);
  }, [tournamentMode, currentRoundNumber, lastRoundNumber]);

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
    console.log('[TournamentLivePage] Channel confirmed:', channel);
    setLiveTwitchChannel(channel);
    setShowChannelModal(false);
    
    toast.success('Canal Twitch connecté ! Les votes sont maintenant actifs.', {
      duration: 4000,
      position: 'top-center',
      icon: '✅',
    });
  }, []);

  const handleChannelCancel = useCallback(() => {
    setShowChannelModal(false);
    
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
  if (_dataError && initialItems.length === 0) {
      // Si initialItems est vide à cause d'une erreur de chargement, on ne peut pas continuer.
      return <ErrorDisplay message={_dataError} onClose={() => window.close()} />;
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
            tmiError={_tmiError}
            generalError={pageError && activeMatch ? pageError : null}
            isVotesConnected={isVotesConnected}
            voteCount={votes.length}
          />
      </div>

      {/* Category Counters - Only for TWO_CATEGORY mode and first round */}
      {tournamentMode === 'TWO_CATEGORY' && isTournamentActive && currentRoundNumber === 1 && (
        <div className="bg-gradient-to-r from-slate-800/40 to-slate-900/40 border-b border-slate-700/50 backdrop-blur-sm">
          <div className="max-w-[1800px] mx-auto px-4 md:px-8 py-4 flex justify-center gap-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-3 bg-gradient-to-br from-blue-900/30 to-blue-800/20 border border-blue-500/30 rounded-lg px-6 py-3"
            >
              <span className="text-sm font-semibold text-blue-300">{categoryA}</span>
              <div className="w-16 h-12 bg-blue-600/20 border-2 border-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-2xl font-bold text-blue-300">{categoryAWins}</span>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-3 bg-gradient-to-br from-pink-900/30 to-pink-800/20 border border-pink-500/30 rounded-lg px-6 py-3"
            >
              <span className="text-sm font-semibold text-pink-300">{categoryB}</span>
              <div className="w-16 h-12 bg-pink-600/20 border-2 border-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-2xl font-bold text-pink-300">{categoryBWins}</span>
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {/* First Round Recap Modal */}
      <AnimatePresence>
        {showFirstRoundRecap && tournamentMode === 'TWO_CATEGORY' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowFirstRoundRecap(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-purple-500/30 rounded-2xl p-8 max-w-2xl w-full shadow-2xl"
            >
              {/* Header */}
              <div className="text-center mb-8">
                <h2 className="text-4xl font-black bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent mb-2">
                  🏁 Fin de la 1ère Salve
                </h2>
                <p className="text-gray-400">Résumé des scores par catégorie</p>
              </div>

              {/* Scores */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                {/* Category A */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-gradient-to-br from-blue-600/20 to-blue-500/10 border-2 border-blue-500/40 rounded-xl p-6 text-center"
                >
                  <div className="text-4xl mb-2">🎵</div>
                  <p className="text-blue-300 text-sm font-semibold mb-3">{categoryA}</p>
                  <div className="text-5xl font-black text-blue-300">{categoryAWins}</div>
                  <p className="text-gray-400 text-xs mt-2">victoire{categoryAWins !== 1 ? 's' : ''}</p>
                </motion.div>

                {/* Category B */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-gradient-to-br from-pink-600/20 to-pink-500/10 border-2 border-pink-500/40 rounded-xl p-6 text-center"
                >
                  <div className="text-4xl mb-2">🎸</div>
                  <p className="text-pink-300 text-sm font-semibold mb-3">{categoryB}</p>
                  <div className="text-5xl font-black text-pink-300">{categoryBWins}</div>
                  <p className="text-gray-400 text-xs mt-2">victoire{categoryBWins !== 1 ? 's' : ''}</p>
                </motion.div>
              </div>

              {/* Leader */}
              <div className="mb-8 text-center">
                {categoryAWins > categoryBWins ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="inline-block"
                  >
                    <div className="bg-gradient-to-r from-blue-600/40 to-blue-500/30 border-2 border-blue-500/50 rounded-lg px-6 py-3">
                      <p className="text-blue-300 font-bold">🎵 {categoryA} est en tête!</p>
                    </div>
                  </motion.div>
                ) : categoryBWins > categoryAWins ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="inline-block"
                  >
                    <div className="bg-gradient-to-r from-pink-600/40 to-pink-500/30 border-2 border-pink-500/50 rounded-lg px-6 py-3">
                      <p className="text-pink-300 font-bold">🎸 {categoryB} est en tête!</p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="inline-block"
                  >
                    <div className="bg-gradient-to-r from-purple-600/40 to-indigo-500/30 border-2 border-purple-500/50 rounded-lg px-6 py-3">
                      <p className="text-purple-300 font-bold">⚖️ C'est l'égalité parfaite!</p>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Continue Button */}
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                onClick={() => setShowFirstRoundRecap(false)}
                className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg transition-all hover:scale-105 active:scale-95"
              >
                <span className="flex items-center justify-center gap-2">
                  <span>🚀 Continuer le tournoi</span>
                </span>
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
                superVotesThisMatch={superVotesThisMatch}
                animateVoteToTargetRef={animateVoteToTargetRef}
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