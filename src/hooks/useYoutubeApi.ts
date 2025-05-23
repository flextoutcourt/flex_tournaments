// app/tournament/[id]/live/hooks/useYouTubeApi.ts
import { useState, useEffect, useRef, MutableRefObject } from 'react';
import { loadYouTubeAPIScript } from '../utils/youtubeUtils'; // Assurez-vous que le chemin est correct

// Appeler une fois au chargement du module pour initier le chargement du script
loadYouTubeAPIScript();

export function useYouTubeApi() {
  const [ytApiReady, setYtApiReady] = useState(
    typeof window !== 'undefined' && window.isYouTubeApiReadyState === true
  );

  useEffect(() => {
    const handleApiReady = () => {
      console.log("YT API Listener (Hook): API est prête.");
      setYtApiReady(true);
    };

    if (window.isYouTubeApiReadyState) {
      handleApiReady();
    } else {
      console.log("YT API Listener (Hook): Ajout de l'écouteur d'événement pour 'youtubeApiReadyEvent'.");
      window.addEventListener('youtubeApiReadyEvent', handleApiReady);
    }
    return () => {
      console.log("YT API Listener (Hook): Suppression de l'écouteur d'événement pour 'youtubeApiReadyEvent'.");
      window.removeEventListener('youtubeApiReadyEvent', handleApiReady);
    };
  }, []);

  return { ytApiReady };
}


export function useYouTubePlayers(
    videoId1: string | null | undefined, 
    videoId2: string | null | undefined, 
    ytApiReady: boolean,
    player1ContainerId: string = 'youtube-player-1',
    player2ContainerId: string = 'youtube-player-2'
) {
    const player1Ref = useRef<YT.Player | null>(null);
    const player2Ref = useRef<YT.Player | null>(null);
    const [playerError, setPlayerError] = useState<string | null>(null);

    useEffect(() => {
        const cleanupAndDestroyPlayer = (playerRef: MutableRefObject<YT.Player | null>, playerName: string) => {
            if (playerRef.current && typeof playerRef.current.destroy === 'function') {
                try {
                    const iframe = playerRef.current.getIframe();
                    if (iframe && document.body.contains(iframe)) {
                        playerRef.current.destroy();
                        console.log(`YT Player Hook: ${playerName} détruit.`);
                    } else {
                        console.log(`YT Player Hook: Iframe de ${playerName} non trouvée. Destruction annulée.`);
                    }
                } catch (e) {
                    console.warn(`YT Player Hook: Erreur destruction ${playerName}`, e);
                }
                playerRef.current = null;
            }
        };

        const updateOrCreatePlayer = (
            elementId: string, 
            videoIdToLoad: string | null | undefined, 
            playerRef: MutableRefObject<YT.Player | null>
        ) => {
            const targetElement = document.getElementById(elementId);
            if (!targetElement) {
                console.error(`YT Player Hook: Élément cible ${elementId} NON TROUVÉ.`);
                cleanupAndDestroyPlayer(playerRef, `Player pour cible manquante ${elementId}`);
                return;
            }

            if (typeof YT === 'undefined' || typeof YT.Player === 'undefined') {
                console.error(`YT Player Hook: YT.Player non défini. Cible: ${elementId}`);
                setPlayerError("L'API YouTube n'a pas pu être chargée. Veuillez rafraîchir.");
                return;
            }
            setPlayerError(null); // Clear previous error

            if (videoIdToLoad) {
                if (playerRef.current) {
                    console.log(`YT Player Hook: Lecteur existant ${elementId}. Load: ${videoIdToLoad}`);
                    try {
                        playerRef.current.loadVideoById(videoIdToLoad);
                    } catch (e) {
                        console.error(`YT Player Hook: Erreur loadVideoById ${elementId}. Recréation.`, e);
                        cleanupAndDestroyPlayer(playerRef, `Recréation ${elementId}`);
                        while (targetElement.firstChild) { targetElement.removeChild(targetElement.firstChild); }
                        playerRef.current = new YT.Player(elementId, { videoId: videoIdToLoad, playerVars: { origin: window.location.origin, autoplay: 0, controls: 1, modestbranding: 1, rel: 0, showinfo: 0, fs: 1 }, events: {/*...*/}});
                    }
                } else {
                    console.log(`YT Player Hook: Création lecteur ${elementId} avec videoId ${videoIdToLoad}.`);
                    while (targetElement.firstChild) { targetElement.removeChild(targetElement.firstChild); }
                    try {
                        playerRef.current = new YT.Player(elementId, {
                            videoId: videoIdToLoad, height: '100%', width: '100%',
                            playerVars: { autoplay: 0, controls: 1, modestbranding: 1, rel: 0, showinfo: 0, fs: 1, origin: window.location.origin },
                            events: {
                                'onReady': () => console.log(`YT Player: Lecteur ${elementId} prêt. Vidéo: ${videoIdToLoad}`),
                                'onError': (event) => console.error(`YT Player: Erreur ${elementId}:`, event.data, `ID: ${videoIdToLoad}`)
                            }
                        });
                    } catch (e) {
                        console.error(`YT Player Hook: Erreur instanciation YT.Player ${elementId}`, e);
                    }
                }
            } else {
                console.log(`YT Player Hook: Pas de videoId pour ${elementId}. Nettoyage.`);
                cleanupAndDestroyPlayer(playerRef, `Player ${elementId} (pas de videoId)`);
            }
        };

        if (!ytApiReady) {
            console.log("YT Player Hook: API non prête. Nettoyage et retour.");
            cleanupAndDestroyPlayer(player1Ref, "Player 1 (API non prête)");
            cleanupAndDestroyPlayer(player2Ref, "Player 2 (API non prête)");
            return;
        }
        
        const rafId = requestAnimationFrame(() => {
            updateOrCreatePlayer(player1ContainerId, videoId1, player1Ref);
            updateOrCreatePlayer(player2ContainerId, videoId2, player2Ref);
        });

        return () => {
            cancelAnimationFrame(rafId);
            console.log("YT Player Hook: Nettoyage principal.");
            cleanupAndDestroyPlayer(player1Ref, "Player 1 (nettoyage principal)");
            cleanupAndDestroyPlayer(player2Ref, "Player 2 (nettoyage principal)");
        };
    }, [videoId1, videoId2, ytApiReady, player1ContainerId, player2ContainerId]);

    return { player1Ref, player2Ref, playerError, setPlayerError };
}