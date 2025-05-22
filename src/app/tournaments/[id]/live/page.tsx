// app/tournament/[id]/live/page.tsx
'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import tmi from 'tmi.js';
import { FaTwitch, FaPlayCircle, FaStopCircle, FaTrophy, FaUserFriends, FaClipboardList, FaRegFrown, FaSpinner, FaArrowRight, FaYoutube, FaUsersCog } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion'; 

interface Item {
  id: string;
  name: string;
  youtubeUrl?: string | null;
}

interface TournamentData {
  items: Item[];
  title: string;
}

interface MatchParticipant {
  id: string;
  name: string;
  score: number;
  youtubeUrl?: string | null;
  youtubeVideoId?: string | null; 
}

interface CurrentMatch {
  item1: MatchParticipant;
  item2: MatchParticipant;
  roundNumber: number;
  matchNumberInRound: number;
}

interface GenerateMatchesResult {
  matches: CurrentMatch[];
  byeParticipant: Item | null;
}

const VOTE_KEYWORDS_ITEM1 = ["1", "un", "uno", "one"];
const VOTE_KEYWORDS_ITEM2 = ["2", "deux", "dos", "two"];

const AVAILABLE_TOURNAMENT_SIZES = [8, 16, 32, 64, 128, 256, 512];


function getYouTubeVideoId(url?: string | null): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

// Animation Variants pour Framer Motion
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
};

const scoreVariants = {
  initial: { scale: 0.8, opacity: 0.5 },
  animate: { scale: 1, opacity: 1, transition: { type: "spring", stiffness: 400, damping: 10 } },
};

const winnerMessageVariants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: { opacity: 1, scale: 1, transition: { type: "spring", delay: 0.2, duration: 0.8, bounce: 0.4 } },
};

// YouTube Player API global setup
const YOUTUBE_API_SCRIPT_URL = "https://www.youtube.com/iframe_api"; // URL standard de l'API Iframe

if (typeof window !== 'undefined') {
  // S'assurer que la fonction onYouTubeIframeAPIReady est définie globalement AVANT d'ajouter le script
  if (typeof (window as any).onYouTubeIframeAPIReady !== 'function') {
    (window as any).onYouTubeIframeAPIReady = () => {
      console.log(`GLOBAL: onYouTubeIframeAPIReady (from ${YOUTUBE_API_SCRIPT_URL}) a été appelée.`);
      (window as any).isYouTubeApiReadyState = true; 
      window.dispatchEvent(new Event('youtubeApiReadyEvent')); 
      console.log(`GLOBAL: Événement 'youtubeApiReadyEvent' distribué.`);
    };
  }

  // Ajouter le script seulement s'il n'est pas déjà là
  if (!document.querySelector(`script[src="${YOUTUBE_API_SCRIPT_URL}"]`)) {
    const tag = document.createElement('script');
    tag.src = YOUTUBE_API_SCRIPT_URL;
    tag.async = true; 
    const firstScriptTag = document.getElementsByTagName('script')[0];
    if (firstScriptTag && firstScriptTag.parentNode) {
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        console.log(`GLOBAL: Ajout du script API YouTube : ${YOUTUBE_API_SCRIPT_URL}`);
    } else {
        document.head.appendChild(tag); 
        console.log(`GLOBAL: Ajout du script API YouTube (fallback sur head) : ${YOUTUBE_API_SCRIPT_URL}`);
    }
  } else {
    console.log(`GLOBAL: Le script API YouTube ${YOUTUBE_API_SCRIPT_URL} est déjà présent.`);
    // Si le script est là mais que l'API n'est pas prête (ex: HMR, ou si onYouTubeIframeAPIReady a été défini après le chargement du script)
    // et que l'objet YT est déjà disponible, on peut considérer l'API comme prête.
    if (typeof YT !== 'undefined' && YT.Player && !(window as any).isYouTubeApiReadyState) {
        console.log("GLOBAL: Objet YT existe mais le drapeau isYouTubeApiReadyState n'est pas défini. Définition et distribution de l'événement.");
        (window as any).isYouTubeApiReadyState = true;
        window.dispatchEvent(new Event('youtubeApiReadyEvent'));
    }
  }
}


export default function TournamentLivePage() {
  const params = useParams();
  const searchParams = useSearchParams();

  const tournamentId = typeof params.id === 'string' ? params.id : null;
  const liveTwitchChannel = searchParams.get('channel');

  const [tournamentTitle, setTournamentTitle] = useState<string | null>(null);
  const [initialItems, setInitialItems] = useState<Item[]>([]); 
  
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [tmiClient, setTmiClient] = useState<tmi.Client | null>(null);
  const [isTmiConnected, setIsTmiConnected] = useState(false);

  const [matches, setMatches] = useState<CurrentMatch[]>([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [advancingToNextRound, setAdvancingToNextRound] = useState<Item[]>([]); 
  const [tournamentWinner, setTournamentWinner] = useState<Item | null>(null);
  const [currentRoundNumber, setCurrentRoundNumber] = useState(1);
  const [isTournamentActive, setIsTournamentActive] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false); 

  const [ytApiReady, setYtApiReady] = useState(typeof window !== 'undefined' && (window as any).isYouTubeApiReadyState === true);
  const player1Ref = useRef<YT.Player | null>(null);
  const player2Ref = useRef<YT.Player | null>(null);

  const [selectedItemCountOption, setSelectedItemCountOption] = useState<string>("all"); 

  const activeMatch = useMemo(() => {
    if (!isTournamentActive || tournamentWinner || matches.length === 0 || currentMatchIndex >= matches.length) {
      return null;
    }
    return matches[currentMatchIndex];
  }, [isTournamentActive, tournamentWinner, matches, currentMatchIndex]);

  const generateKeywords = useCallback((itemName: string): string[] => {
    if (!itemName) return [];
    const nameParts = itemName.toLowerCase().split(/[\s-]+/); 
    const keywords = [...nameParts.filter(part => part.length > 1)]; 
    if (keywords.length === 0 && nameParts.length > 0) { 
        keywords.push(nameParts[0]);
    }
    return keywords.slice(0, 3); 
  }, []);

  useEffect(() => {
    if (tournamentWinner) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 7000); 
      return () => clearTimeout(timer);
    }
  }, [tournamentWinner]);


  // Listener for YouTube API ready event
  useEffect(() => {
    const handleApiReady = () => {
        console.log("YT API Listener (Component): API est prête.");
        setYtApiReady(true);
    };

    if ((window as any).isYouTubeApiReadyState) { 
        console.log("YT API Listener (Component): API était déjà prête à l'initialisation.");
        handleApiReady();
    } else {
        console.log("YT API Listener (Component): Ajout de l'écouteur d'événement pour 'youtubeApiReadyEvent'.");
        window.addEventListener('youtubeApiReadyEvent', handleApiReady);
    }
    return () => {
        console.log("YT API Listener (Component): Suppression de l'écouteur d'événement pour 'youtubeApiReadyEvent'.");
        window.removeEventListener('youtubeApiReadyEvent', handleApiReady);
    };
  }, []);


  // Initialize and destroy YouTube players
  useEffect(() => {
    const videoId1 = activeMatch?.item1?.youtubeVideoId;
    const videoId2 = activeMatch?.item2?.youtubeVideoId;

    const cleanupPlayer = (playerRef: React.MutableRefObject<YT.Player | null>, playerName: string) => {
        if (playerRef.current && typeof playerRef.current.destroy === 'function') {
            try {
                if (playerRef.current.getIframe() && document.body.contains(playerRef.current.getIframe())) {
                    playerRef.current.destroy();
                    console.log(`YT Player Effect: ${playerName} détruit.`);
                } else {
                    console.log(`YT Player Effect: Iframe de ${playerName} non trouvée ou déjà retirée du DOM. Destruction annulée.`);
                }
            } catch (e) {
                console.warn(`YT Player Effect: Erreur lors de la destruction de ${playerName}`, e);
            }
            playerRef.current = null;
        }
    };

    if (!ytApiReady) {
      console.log("YT Player Effect: API non prête. Nettoyage des joueurs existants.");
      cleanupPlayer(player1Ref, "Player 1");
      cleanupPlayer(player2Ref, "Player 2");
      return;
    }

    if (!activeMatch) {
      console.log("YT Player Effect: Pas de match actif. Nettoyage des joueurs existants.");
      cleanupPlayer(player1Ref, "Player 1");
      cleanupPlayer(player2Ref, "Player 2");
      return;
    }
    
    console.log(`YT Player Effect: Exécution. API Prête: ${ytApiReady}. Match: ${activeMatch.item1.name} (ID1: ${videoId1}) vs ${activeMatch.item2.name} (ID2: ${videoId2})`);

    const createPlayer = (elementId: string, videoIdToLoad: string | null | undefined, playerRef: React.MutableRefObject<YT.Player | null>) => {
      const targetElement = document.getElementById(elementId);
      
      cleanupPlayer(playerRef, `Ancien ${elementId}`); 

      if (videoIdToLoad && targetElement) {
        console.log(`YT Player Effect: Tentative de création du lecteur pour ${elementId} avec videoId ${videoIdToLoad}. Élément trouvé:`, targetElement);
        if (typeof YT === 'undefined' || typeof YT.Player === 'undefined') {
            console.error(`YT Player Effect: Objet YT ou YT.Player non défini lors de la tentative de création du lecteur pour ${elementId}. L'API a peut-être échoué à se charger.`);
            setError("L'API YouTube n'a pas pu être chargée correctement. Veuillez rafraîchir la page.");
            return;
        }
        try {
            playerRef.current = new YT.Player(elementId, {
              videoId: videoIdToLoad,
              height: '100%',
              width: '100%',
              playerVars: {
                autoplay: 0, controls: 1, modestbranding: 1, rel: 0, showinfo: 0, fs: 1,
                origin: typeof window !== 'undefined' ? window.location.origin : '', 
              },
              events: {
                'onReady': (event) => console.log(`YT Player: Lecteur ${elementId} prêt. Vidéo: ${videoIdToLoad}`),
                'onError': (event) => console.error(`YT Player: Erreur du lecteur ${elementId}:`, event.data, `Video ID: ${videoIdToLoad}`)
              }
            });
        } catch (e) {
            console.error(`YT Player Effect: Erreur lors de l'instanciation de YT.Player pour ${elementId} avec videoId ${videoIdToLoad}:`, e);
        }
      } else if (videoIdToLoad && !targetElement) {
        console.error(`YT Player Effect: Élément cible ${elementId} NON TROUVÉ dans le DOM pour la vidéo ${videoIdToLoad}. Le lecteur ne sera pas créé.`);
      } else if (!videoIdToLoad) {
        console.log(`YT Player Effect: Pas de videoId pour ${elementId}, lecteur non créé (déjà nettoyé).`);
      }
    };
    
    let rafId: number;
    const initializePlayers = () => {
        console.log("YT Player Effect: Initialisation des lecteurs via requestAnimationFrame.");
        createPlayer('youtube-player-1', videoId1, player1Ref);
        createPlayer('youtube-player-2', videoId2, player2Ref);
    };

    if (videoId1 || videoId2) {
        rafId = requestAnimationFrame(initializePlayers);
    } else { 
        cleanupPlayer(player1Ref, "Player 1 (pas de videoId1)");
        cleanupPlayer(player2Ref, "Player 2 (pas de videoId2)");
    }

    return () => {
      if (typeof cancelAnimationFrame === 'function') cancelAnimationFrame(rafId); 
      console.log("YT Player Effect: Fonction de nettoyage exécutée (changement de dépendance ou démontage).");
      cleanupPlayer(player1Ref, "Player 1 au nettoyage");
      cleanupPlayer(player2Ref, "Player 2 au nettoyage");
    };
  }, [activeMatch?.item1?.youtubeVideoId, activeMatch?.item2?.youtubeVideoId, ytApiReady]); 


  // 1. Charger les données initiales depuis sessionStorage
  useEffect(() => {
    if (!tournamentId || !liveTwitchChannel) {
      setError("Informations de tournoi ou de canal Twitch manquantes dans l'URL.");
      setIsLoadingData(false);
      return;
    }

    try {
      const storedData = sessionStorage.getItem(`tournamentData_${tournamentId}`);
      if (!storedData) {
        throw new Error("Données du tournoi non trouvées. Veuillez relancer depuis la page du tournoi.");
      }
      const data: TournamentData = JSON.parse(storedData);
      if (!data.items || data.items.length < 2 || !data.title) { 
        throw new Error("Données du tournoi invalides ou participants insuffisants (minimum 2).");
      }
      setTournamentTitle(data.title);
      setInitialItems(data.items.map(item => ({
        ...item, 
        youtubeVideoId: getYouTubeVideoId(item.youtubeUrl)
      })));
    } catch (e: any) {
      setError(e.message || "Erreur lors de la récupération des données du tournoi.");
      console.error("Erreur chargement sessionStorage:", e);
    } finally {
      setIsLoadingData(false);
    }
  }, [tournamentId, liveTwitchChannel]);

  // 2. Gérer la connexion/déconnexion TMI.js
  useEffect(() => {
    if (!isTournamentActive || !liveTwitchChannel || tournamentWinner) {
      if (tmiClient) {
        console.log("TMI.js: Déconnexion...");
        tmiClient.disconnect();
        setTmiClient(null);
        setIsTmiConnected(false);
      }
      return;
    }

    console.log(`TMI.js: Tentative de connexion au canal: ${liveTwitchChannel}`);
    const client = new tmi.Client({
      options: { debug: false }, 
      channels: [liveTwitchChannel],
    });

    client.on('connected', (address, port) => {
      console.log(`TMI.js: Connecté à ${address}:${port} sur ${liveTwitchChannel}`);
      setIsTmiConnected(true);
      setError(null); 
    });

    client.on('disconnected', (reason) => {
      console.warn(`TMI.js: Déconnecté. Raison: ${reason}`);
      setIsTmiConnected(false);
    });
    
    client.on('join', (channel, username, self) => {
        if(self) console.log(`TMI.js: Rejoint le canal ${channel}`);
    });

    client.connect().catch(err => {
      console.error("TMI.js: Erreur de connexion:", err);
      setError(`Impossible de se connecter au chat Twitch du canal "${liveTwitchChannel}". Vérifiez le nom et votre connexion.`);
      setIsTmiConnected(false);
    });

    setTmiClient(client);

    return () => {
      if (client && client.readyState() === 'OPEN') {
        console.log("TMI.js: Nettoyage, déconnexion...");
        client.disconnect();
      }
      setTmiClient(null);
      setIsTmiConnected(false);
    };
  }, [isTournamentActive, liveTwitchChannel, tournamentWinner]); 


  // 3. Écouter les messages TMI pour les votes
 useEffect(() => {
    if (!tmiClient || !isTmiConnected || !activeMatch || tournamentWinner) return;

    const item1Name = activeMatch.item1.name;
    const item2Name = activeMatch.item2.name;
    const item1VoteKeywords = [...VOTE_KEYWORDS_ITEM1, ...generateKeywords(item1Name)];
    const item2VoteKeywords = [...VOTE_KEYWORDS_ITEM2, ...generateKeywords(item2Name)];

    const messageHandler = (channel: string, tags: tmi.ChatUserstate, message: string, self: boolean) => {
      if (self || !activeMatch) return; 

      const messageLower = message.toLowerCase().trim();

      setMatches(prevMatches => {
        if (currentMatchIndex >= prevMatches.length || !prevMatches[currentMatchIndex]) {
          return prevMatches;
        }
        const updatedMatches = prevMatches.map((match, index) => {
            if (index === currentMatchIndex) {
                const currentMatchInUpdate = {...match, item1: {...match.item1}, item2: {...match.item2}};
                let voted = false;
                if (item1VoteKeywords.some(keyword => messageLower.includes(keyword))) {
                  currentMatchInUpdate.item1.score++;
                  voted = true;
                } else if (item2VoteKeywords.some(keyword => messageLower.includes(keyword))) {
                  currentMatchInUpdate.item2.score++;
                  voted = true;
                }
                return voted ? currentMatchInUpdate : match;
            }
            return match;
        });
        return updatedMatches; 
      });
    };

    tmiClient.on('message', messageHandler);
    console.log(`TMI.js: Écouteur de messages activé pour: ${item1Name} (kw: ${item1VoteKeywords.join(',')}) vs ${item2Name} (kw: ${item2VoteKeywords.join(',')})`);

    return () => {
      tmiClient.removeListener('message', messageHandler);
      console.log("TMI.js: Écouteur de messages désactivé.");
    };
  }, [tmiClient, isTmiConnected, activeMatch, currentMatchIndex, tournamentWinner, generateKeywords]);


  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const generateMatches = useCallback((participants: Item[], roundNum: number): GenerateMatchesResult => {
    console.log(`Génération des matchs pour Round ${roundNum} avec participants:`, participants.map(p => p.name));
    if (participants.length === 0) {
        return { matches: [], byeParticipant: null };
    }
    if (participants.length === 1) {
      return { matches: [], byeParticipant: participants[0] };
    }

    const shuffled = shuffleArray(participants);
    const newMatches: CurrentMatch[] = [];
    let byeParticipant: Item | null = null;

    for (let i = 0; i < shuffled.length; i += 2) {
      if (shuffled[i + 1]) {
        newMatches.push({
          item1: { ...shuffled[i], score: 0, youtubeVideoId: getYouTubeVideoId(shuffled[i].youtubeUrl) },
          item2: { ...shuffled[i + 1], score: 0, youtubeVideoId: getYouTubeVideoId(shuffled[i+1].youtubeUrl) },
          roundNumber: roundNum,
          matchNumberInRound: newMatches.length + 1,
        });
      } else {
        byeParticipant = shuffled[i];
      }
    }
    
    if (byeParticipant) {
      console.log(`generateMatches: ${byeParticipant.name} a un "bye" pour le round ${roundNum}.`);
    }
    console.log(`generateMatches: Round ${roundNum} généré avec ${newMatches.length} matchs. Bye: ${byeParticipant?.name || 'Aucun'}`);
    return { matches: newMatches, byeParticipant: byeParticipant };
  }, []);


  const startTournament = () => {
    setError(null);
    let participantsForThisRun: Item[];
    const numSelected = selectedItemCountOption === "all" ? initialItems.length : parseInt(selectedItemCountOption);

    if (initialItems.length < 2) {
        setError("Au moins 2 participants sont requis pour démarrer.");
        return;
    }
    if (numSelected < 2) {
        setError("Veuillez sélectionner au moins 2 participants pour ce tournoi.");
        return;
    }

    if (numSelected > initialItems.length) {
        console.warn(`Nombre sélectionné (${numSelected}) supérieur au nombre d'items disponibles (${initialItems.length}). Utilisation de tous les items disponibles.`);
        participantsForThisRun = shuffleArray([...initialItems]);
    } else if (selectedItemCountOption === "all") {
        participantsForThisRun = shuffleArray([...initialItems]);
    } else {
        participantsForThisRun = shuffleArray([...initialItems]).slice(0, numSelected);
    }
    
    if (participantsForThisRun.length < 2) { 
        setError("Sélection invalide, pas assez de participants pour démarrer.");
        return;
    }

    console.log(`Début du tournoi avec ${participantsForThisRun.length} participants sélectionnés:`, participantsForThisRun.map(i => i.name));
    
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
        console.log(`🏆 VAINQUEUR DU TOURNOI (par bye initial unique): ${firstRoundBye.name} 🏆`);
        return;
    }
    console.log("Tournoi démarré. Round 1:", firstRoundMatches, "Byes pour R1:", firstRoundBye ? [firstRoundBye.name] : "Aucun");
  };

  const handleDeclareWinnerAndNext = (winnerKey: 'item1' | 'item2') => {
    if (!activeMatch || tournamentWinner) return;

    const winnerOfMatch = winnerKey === 'item1' ? activeMatch.item1 : activeMatch.item2;
    const winnerItem: Item = { id: winnerOfMatch.id, name: winnerOfMatch.name, youtubeUrl: winnerOfMatch.youtubeUrl };

    console.log(`Déclaration Gagnant: Match R${currentRoundNumber} M${activeMatch.matchNumberInRound} - ${winnerItem.name} gagne contre ${winnerKey === 'item1' ? activeMatch.item2.name : activeMatch.item1.name}`);
    
    const currentRoundAdvancers = [...advancingToNextRound, winnerItem];

    if (currentMatchIndex < matches.length - 1) { 
      console.log("Passage au match suivant dans le même round.");
      setAdvancingToNextRound(currentRoundAdvancers); 
      setCurrentMatchIndex(prev => prev + 1);
    } else { 
      console.log(`Fin du Round ${currentRoundNumber}. Tous les qualifiés pour le prochain round: ${currentRoundAdvancers.map(w => w.name).join(', ')}`);
      
      if (currentRoundAdvancers.length === 0 && matches.length > 0) {
          setError("Erreur critique: Aucun participant n'avance malgré des matchs joués.");
          setIsTournamentActive(false);
          return;
      }

      if (currentRoundAdvancers.length === 1) { 
        setTournamentWinner(currentRoundAdvancers[0]);
        setIsTournamentActive(false);
        console.log(`🏆 VAINQUEUR DU TOURNOI: ${currentRoundAdvancers[0].name} 🏆`);
      } else if (currentRoundAdvancers.length > 1) { 
        const nextRound = currentRoundNumber + 1;
        console.log(`Préparation du Round ${nextRound} avec les participants:`, currentRoundAdvancers.map(p => p.name));
        setCurrentRoundNumber(nextRound);
        
        const { matches: nextMatchesGenerated, byeParticipant: nextRoundBye } = generateMatches(currentRoundAdvancers, nextRound);
        setMatches(nextMatchesGenerated);
        setCurrentMatchIndex(0);
        setAdvancingToNextRound(nextRoundBye ? [nextRoundBye] : []); 
        console.log(`Nouveau Round ${nextRound} généré. Matchs:`, nextMatchesGenerated, "Byes pour R"+nextRound+":", nextRoundBye ? [nextRoundBye.name] : "Aucun");

        if (nextMatchesGenerated.length === 0 && nextRoundBye) {
             setTournamentWinner(nextRoundBye); 
             setIsTournamentActive(false);
             console.log(`🏆 VAINQUEUR DU TOURNOI (par bye au round ${nextRound}): ${nextRoundBye.name} 🏆`);
        } else if (nextMatchesGenerated.length === 0 && !nextRoundBye ) {
             console.error("Erreur: Aucun match ni bye généré pour le round suivant malgré plusieurs participants qualifiés.");
             setError("Erreur lors de la génération du round suivant.");
             setIsTournamentActive(false);
        }
      } else { 
        console.log("Fin du tournoi, aucun participant n'avance (ou tournoi terminé).");
        setIsTournamentActive(false);
      }
    }
  };

  const handleStopLocalLaunch = () => {
    console.log("Arrêt et réinitialisation du tournoi local.");
    setIsTournamentActive(false); 
    setMatches([]);
    setCurrentMatchIndex(0);
    setAdvancingToNextRound([]); 
    setTournamentWinner(null);
    setCurrentRoundNumber(1);
    setError(null); 
  };

  const handleMouseEnterPlayer = (playerRef: React.MutableRefObject<YT.Player | null>) => {
    if (playerRef.current && typeof playerRef.current.playVideo === 'function') {
      playerRef.current.playVideo();
    }
  };

  const handleMouseLeavePlayer = (playerRef: React.MutableRefObject<YT.Player | null>) => {
    if (playerRef.current && typeof playerRef.current.pauseVideo === 'function') {
      playerRef.current.pauseVideo();
    }
  };

  const getValidTournamentSizes = useMemo(() => {
    if (initialItems.length === 0) return [];
    return AVAILABLE_TOURNAMENT_SIZES.filter(size => size <= initialItems.length);
  }, [initialItems]);


  if (isLoadingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-purple-900 text-white flex flex-col items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
            <FaSpinner className="animate-spin h-16 w-16 text-purple-300 mb-6" />
        </motion.div>
        <motion.p 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-2xl font-semibold"
        >
            Chargement du Tournoi...
        </motion.p>
      </div>
    );
  }

  if (error && !isTournamentActive) { 
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4 text-center">
        <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }}
            className="bg-gray-800 p-8 rounded-xl shadow-2xl"
        >
            <FaRegFrown className="h-20 w-20 text-red-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold mb-3 text-red-400">Erreur de Chargement</h1>
            <p className="text-red-300 max-w-md mb-6">{error}</p>
            <button 
                onClick={() => window.close()} 
                className="mt-6 px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow-lg transition-transform hover:scale-105"
            >
                Fermer cet onglet
            </button>
        </motion.div>
      </div>
    );
  }
  
  if (!isTournamentActive) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-purple-900 text-white flex flex-col items-center justify-center p-4 text-center">
        <motion.div 
            initial="hidden"
            animate="visible"
            variants={{ hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1, transition: { delay: 0.2, type: "spring", stiffness: 120 } } }}
            className="bg-gray-800/80 backdrop-blur-md p-10 rounded-2xl shadow-xl max-w-lg w-full"
        >
            <motion.div animate={{ rotate: [0, 10, -10, 10, 0], transition: { duration: 1, repeat: Infinity, repeatType: "mirror", ease:"easeInOut" } }}>
                <FaPlayCircle className="h-28 w-28 text-purple-400 mx-auto mb-8" />
            </motion.div>
            <h1 className="text-4xl font-bold mb-4 text-gray-100">{tournamentTitle || "Tournoi"}</h1>
            <p className="text-lg text-gray-300 mb-3">Prêt à lancer le tournoi sur le canal Twitch :</p>
            <p className="text-2xl font-semibold text-purple-300 bg-gray-700/50 px-4 py-2 rounded-md inline-block mb-8">{liveTwitchChannel || "Non spécifié"}</p>
            
            <div className="mb-6">
                <label htmlFor="itemCountSelect" className="block text-sm font-medium text-gray-300 mb-2">
                    <FaUsersCog className="inline-block mr-2 mb-0.5" /> Nombre de participants pour ce tournoi :
                </label>
                <select 
                    id="itemCountSelect"
                    value={selectedItemCountOption}
                    onChange={(e) => setSelectedItemCountOption(e.target.value)}
                    className="w-full max-w-xs mx-auto px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-gray-100 focus:ring-purple-500 focus:border-purple-500"
                    disabled={initialItems.length < 2}
                >
                    <option value="all">Tous ({initialItems.length})</option>
                    {getValidTournamentSizes.map(size => (
                        <option key={size} value={size.toString()}>{size} participants</option>
                    ))}
                </select>
                 {initialItems.length > 0 && parseInt(selectedItemCountOption) > initialItems.length && selectedItemCountOption !== "all" && (
                    <p className="text-xs text-yellow-400 mt-1">
                        Moins de {selectedItemCountOption} participants disponibles. Tous les {initialItems.length} participants seront utilisés.
                    </p>
                )}
            </div>

            {initialItems.length > 0 && <p className="text-md text-gray-400 mb-2">Participants totaux disponibles : <span className="font-bold text-gray-200">{initialItems.length}</span></p>}
            {error && <p className="text-red-300 max-w-md mb-4">{error}</p>} 
            <motion.button
              onClick={startTournament}
              disabled={initialItems.length < 2 || !liveTwitchChannel}
              className="w-full px-10 py-4 bg-gradient-to-r from-green-500 to-teal-500 text-white font-bold text-xl rounded-lg shadow-2xl transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
              whileHover={{ scale: 1.05, boxShadow: "0px 0px 15px rgba(50, 205, 50, 0.7)"}}
              whileTap={{ scale: 0.95 }}
            >
              DÉMARRER LE TOURNOI MAINTENANT
            </motion.button>
            {initialItems.length < 2 && <p className="text-sm text-yellow-400 mt-4">Au moins 2 participants sont requis.</p>}
            {!liveTwitchChannel && <p className="text-sm text-yellow-400 mt-4">Le canal Twitch est manquant dans l'URL.</p>}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 text-white flex flex-col items-center p-4 pt-6 md:pt-10 transition-all duration-500 ease-in-out">
      <motion.header 
        initial={{ opacity:0, y: -50 }}
        animate={{ opacity:1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="w-full max-w-5xl text-center mb-6 md:mb-10"
      >
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mb-3">
          {tournamentTitle}
        </h1>
        <div className="flex items-center justify-center text-md sm:text-lg text-gray-300 bg-gray-800/50 px-4 py-2 rounded-full shadow-md max-w-md mx-auto">
          <FaTwitch className="mr-2 text-purple-400 text-xl" /> Canal: <span className="font-semibold ml-1.5">{liveTwitchChannel}</span>
          <span className="mx-3 text-gray-600">|</span>
          {isTmiConnected ? 
            <span className="text-green-400 flex items-center"><div className="h-2.5 w-2.5 bg-green-500 rounded-full mr-2 animate-pulse"></div>Connecté au Chat</span> : 
            <span className="text-yellow-400 flex items-center"><FaSpinner className="animate-spin mr-2"/>Connexion...</span>
          }
        </div>
          {error && <p className="text-red-300 max-w-md mt-3 text-sm bg-red-900/50 p-2 rounded-md mx-auto">{error}</p>} 
      </motion.header>

      <AnimatePresence mode="wait">
        {tournamentWinner ? (
          <motion.div 
            key="winner"
            variants={winnerMessageVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="w-full max-w-lg bg-gray-800/90 backdrop-blur-sm p-8 md:p-12 rounded-2xl shadow-2xl text-center"
          >
            {showConfetti && (
              <div className="confetti-container fixed inset-0 pointer-events-none z-50">
                {[...Array(150)].map((_, i) => ( 
                  <div key={i} className="confetti" style={{
                    left: `${Math.random() * 100}%`,
                    backgroundColor: `hsl(${Math.random() * 360}, 80%, 70%)`,
                    animationDelay: `${Math.random() * 2}s`, 
                    animationDuration: `${4 + Math.random() * 4}s`, 
                    width: `${8 + Math.random() * 8}px`, 
                    height: `${8 + Math.random() * 8}px`,
                    opacity: Math.random() * 0.5 + 0.5, 
                    transform: `scale(${0.7 + Math.random() * 0.6}) rotate(${Math.random() * 720 - 360}deg)`
                  }}></div>
                ))}
              </div>
            )}
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, type: "spring", stiffness: 150 }}>
                <FaTrophy className="h-28 w-28 text-yellow-400 mx-auto mb-6" />
            </motion.div>
            <h2 className="text-3xl font-bold text-yellow-300 mb-4">VAINQUEUR DU TOURNOI !</h2>
            <motion.p 
                className="text-5xl font-extrabold text-white py-4 px-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg shadow-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
            >
              {tournamentWinner.name}
            </motion.p>
            <motion.button 
                onClick={() => window.close()} 
                className="mt-10 px-8 py-3 bg-gray-600 hover:bg-gray-500 text-white font-semibold rounded-lg shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                Fermer la Page
            </motion.button>
          </motion.div>
        ) : activeMatch ? (
          <motion.div 
            key={activeMatch.item1.id + activeMatch.item2.id + activeMatch.roundNumber + activeMatch.matchNumberInRound} // Clé plus unique pour forcer le re-render
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full max-w-4xl bg-gray-800/90 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-2xl"
          >
            <div className="text-center mb-6 md:mb-8">
              <p className="text-md text-purple-300 font-semibold tracking-wider uppercase">
                Round {activeMatch.roundNumber} <span className="text-gray-500 mx-1">•</span> Match {activeMatch.matchNumberInRound} / {matches.length}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-start">
              {/* Participant 1 Card */}
              <motion.div 
                className="bg-gray-700/70 p-5 md:p-6 rounded-xl shadow-xl flex flex-col transition-all duration-300 hover:shadow-purple-500/40"
                whileHover={{ y: -5 }}
                onMouseEnter={() => handleMouseEnterPlayer(player1Ref)}
                onMouseLeave={() => handleMouseLeavePlayer(player1Ref)}
              >
                <h2 className="text-2xl md:text-3xl font-bold text-gray-100 mb-3 truncate text-center" title={activeMatch.item1.name}>{activeMatch.item1.name}</h2>
                {activeMatch.item1.youtubeVideoId ? (
                  <motion.div 
                    className="aspect-video rounded-lg overflow-hidden mb-4 shadow-lg bg-black" 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                  >
                    {/* Clé unique pour forcer le re-montage du div si la vidéo change */}
                    <div key={`player1-${activeMatch.item1.youtubeVideoId}`} id="youtube-player-1" className="w-full h-full"></div>
                  </motion.div>
                ) : activeMatch.item1.youtubeUrl && (
                   <a href={activeMatch.item1.youtubeUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:underline mb-3 inline-flex items-center justify-center w-full py-2 bg-gray-600 rounded-md hover:bg-gray-500"><FaYoutube className="mr-2"/>Lien YouTube</a>
                )}
                <motion.p 
                    key={`score1-${activeMatch.item1.score}`} 
                    variants={scoreVariants} initial="initial" animate="animate"
                    className="text-7xl md:text-8xl font-bold text-purple-400 my-4 md:my-6 text-center"
                >
                    {activeMatch.item1.score}
                </motion.p>
                <motion.button
                  onClick={() => handleDeclareWinnerAndNext('item1')}
                  className="w-full mt-auto px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg shadow-lg"
                  whileHover={{ scale: 1.05, boxShadow: "0px 0px 12px rgba(96, 165, 250, 0.7)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  Déclarer Gagnant
                </motion.button>
              </motion.div>

              <div className="flex lg:hidden items-center justify-center my-4">
                  <p className="text-3xl font-black text-gray-600">VS</p>
              </div>

              {/* Participant 2 Card */}
              <motion.div 
                className="bg-gray-700/70 p-5 md:p-6 rounded-xl shadow-xl flex flex-col transition-all duration-300 hover:shadow-pink-500/40"
                whileHover={{ y: -5 }}
                onMouseEnter={() => handleMouseEnterPlayer(player2Ref)}
                onMouseLeave={() => handleMouseLeavePlayer(player2Ref)}
              >
                <h2 className="text-2xl md:text-3xl font-bold text-gray-100 mb-3 truncate text-center" title={activeMatch.item2.name}>{activeMatch.item2.name}</h2>
                {activeMatch.item2.youtubeVideoId ? (
                  <motion.div 
                    className="aspect-video rounded-lg overflow-hidden mb-4 shadow-lg bg-black" 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                  >
                     {/* Clé unique pour forcer le re-montage du div si la vidéo change */}
                    <div key={`player2-${activeMatch.item2.youtubeVideoId}`} id="youtube-player-2" className="w-full h-full"></div>
                  </motion.div>
                ) : activeMatch.item2.youtubeUrl && (
                   <a href={activeMatch.item2.youtubeUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:underline mb-3 inline-flex items-center justify-center w-full py-2 bg-gray-600 rounded-md hover:bg-gray-500"><FaYoutube className="mr-2"/>Lien YouTube</a>
                )}
                <motion.p 
                    key={`score2-${activeMatch.item2.score}`} 
                    variants={scoreVariants} initial="initial" animate="animate"
                    className="text-7xl md:text-8xl font-bold text-pink-400 my-4 md:my-6 text-center"
                >
                    {activeMatch.item2.score}
                </motion.p>
                <motion.button
                  onClick={() => handleDeclareWinnerAndNext('item2')}
                  className="w-full mt-auto px-4 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold rounded-lg shadow-lg"
                  whileHover={{ scale: 1.05, boxShadow: "0px 0px 12px rgba(239, 68, 68, 0.7)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  Déclarer Gagnant
                </motion.button>
              </motion.div>
            </div>
            <p className="text-center text-sm text-gray-400 mt-10 px-4">
              Votez dans le chat Twitch avec <code className="bg-gray-700 px-1.5 py-0.5 rounded text-purple-300">1</code> ou des mots-clés comme <code className="bg-gray-700 px-1.5 py-0.5 rounded text-purple-300">{activeMatch.item1.name ? generateKeywords(activeMatch.item1.name)[0] : ''}</code> pour {activeMatch.item1.name},
              <br className="sm:hidden"/> ou <code className="bg-gray-700 px-1.5 py-0.5 rounded text-pink-300">2</code> ou <code className="bg-gray-700 px-1.5 py-0.5 rounded text-pink-300">{activeMatch.item2.name ? generateKeywords(activeMatch.item2.name)[0] : ''}</code> pour {activeMatch.item2.name}.
            </p>
          </motion.div>
        ) : (
          <motion.div 
            key="no-match"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="text-center py-10"
          >
            <FaClipboardList className="h-20 w-20 text-gray-600 mx-auto mb-6" />
            <p className="text-2xl text-gray-500">Préparation du prochain match ou fin du tournoi...</p>
          </motion.div>
        )}
      </AnimatePresence>

      {isTournamentActive && !tournamentWinner && (
         <motion.button
            onClick={handleStopLocalLaunch}
            className="mt-12 px-8 py-3 bg-gray-700 hover:bg-gray-600 text-gray-300 font-medium rounded-lg shadow-lg flex items-center transition-colors"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
        >
            <FaStopCircle className="mr-2.5" /> Arrêter et Réinitialiser le Tournoi
        </motion.button>
      )}
      
      <style jsx global>{`
        /* Styles pour les confettis et animations */
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
    </div>
  );
}

