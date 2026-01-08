/**
 * useYouTubeApi Hook - YouTube IFrame API management
 * Delegates API loading to YouTubeService
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { YouTubeService } from '@/lib/services/youtubeService';

/**
 * Hook to manage YouTube API readiness
 */
export function useYouTubeApi() {
  const [ytApiReady, setYtApiReady] = useState(
    typeof window !== 'undefined' && YouTubeService.isAPIReady()
  );

  useEffect(() => {
    // Load API (idempotent - safe to call multiple times)
    YouTubeService.loadAPI();

    const handleApiReady = () => {
      console.log('YouTube API ready');
      setYtApiReady(true);
    };

    if (YouTubeService.isAPIReady()) {
      handleApiReady();
    } else {
      window.addEventListener('youtubeApiReadyEvent', handleApiReady);
      return () => {
        window.removeEventListener('youtubeApiReadyEvent', handleApiReady);
      };
    }
  }, []);

  return { ytApiReady };
}

/**
 * Hook to manage YouTube player instances
 */
export function useYouTubePlayers(
  videoId1: string | null | undefined,
  videoId2: string | null | undefined,
  ytApiReady: boolean,
  player1ContainerId: string = 'youtube-player-1',
  player2ContainerId: string = 'youtube-player-2'
) {
  const [playerError, setPlayerError] = useState<string | null>(null);
  const player1Ref = React.useRef<YT.Player | null>(null);
  const player2Ref = React.useRef<YT.Player | null>(null);

  useEffect(() => {
    if (!ytApiReady) {
      console.log('YouTube API not ready - cleaning up players');
      if (player1Ref.current) {
        try {
          player1Ref.current.destroy();
        } catch (e) {
          console.warn('Error destroying player 1:', e);
        }
        player1Ref.current = null;
      }
      if (player2Ref.current) {
        try {
          player2Ref.current.destroy();
        } catch (e) {
          console.warn('Error destroying player 2:', e);
        }
        player2Ref.current = null;
      }
      return;
    }

    let isMounted = true;

    const initPlayers = async () => {
      // Create or update player 1
      if (videoId1) {
        try {
          const player1 = await YouTubeService.createPlayer(player1ContainerId, videoId1);
          if (isMounted) {
            player1Ref.current = player1;
          } else {
            player1.destroy();
          }
        } catch (e) {
          console.error('Error creating player 1:', e);
          if (isMounted) {
            setPlayerError("Erreur lors du chargement du lecteur YouTube 1");
          }
        }
      } else {
        if (player1Ref.current) {
          try {
            player1Ref.current.destroy();
          } catch (e) {
            console.warn('Error destroying player 1:', e);
          }
          player1Ref.current = null;
        }
      }

      // Create or update player 2
      if (videoId2) {
        try {
          const player2 = await YouTubeService.createPlayer(player2ContainerId, videoId2);
          if (isMounted) {
            player2Ref.current = player2;
          } else {
            player2.destroy();
          }
        } catch (e) {
          console.error('Error creating player 2:', e);
          if (isMounted) {
            setPlayerError("Erreur lors du chargement du lecteur YouTube 2");
          }
        }
      } else {
        if (player2Ref.current) {
          try {
            player2Ref.current.destroy();
          } catch (e) {
            console.warn('Error destroying player 2:', e);
          }
          player2Ref.current = null;
        }
      }
    };

    initPlayers();

    return () => {
      isMounted = false;
      if (player1Ref.current) {
        try {
          player1Ref.current.destroy();
        } catch (e) {
          console.warn('Error destroying player 1:', e);
        }
        player1Ref.current = null;
      }
      if (player2Ref.current) {
        try {
          player2Ref.current.destroy();
        } catch (e) {
          console.warn('Error destroying player 2:', e);
        }
        player2Ref.current = null;
      }
    };
  }, [videoId1, videoId2, ytApiReady, player1ContainerId, player2ContainerId]);

  return { player1Ref, player2Ref, playerError, setPlayerError };
}