// app/tournament/[id]/live/hooks/useTmiClient.ts
import { useState, useEffect, useCallback } from 'react';
import tmi from 'tmi.js';
import { CurrentMatch } from '../types';
import { VOTE_KEYWORDS_ITEM1, VOTE_KEYWORDS_ITEM2 } from '../constants';
import { generateKeywords } from '@/utils/tournamentHelper';

interface UseTmiClientProps {
  liveTwitchChannel: string | null;
  isTournamentActive: boolean;
  tournamentWinner: any | null; // Remplacez 'any' par le type Item si disponible
  activeMatch: CurrentMatch | null;
  currentMatchIndex: number;
  onScoreUpdate: (matchIndex: number, itemKey: 'item1' | 'item2') => void;
}

export function useTmiClient({
  liveTwitchChannel,
  isTournamentActive,
  tournamentWinner,
  activeMatch,
  currentMatchIndex,
  onScoreUpdate
}: UseTmiClientProps) {
  const [tmiClient, setTmiClient] = useState<tmi.Client | null>(null);
  const [isTmiConnected, setIsTmiConnected] = useState(false);
  const [tmiError, setTmiError] = useState<string | null>(null);

  // Connexion/Déconnexion TMI
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
      setTmiError(null);
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
      setTmiError(`Impossible de se connecter au chat Twitch: "${liveTwitchChannel}".`);
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
  }, [isTournamentActive, liveTwitchChannel, tournamentWinner]); // tmiClient enlevé des deps

  // Gestionnaire de messages TMI
  useEffect(() => {
    if (!tmiClient || !isTmiConnected || !activeMatch || tournamentWinner) return;

    const item1Name = activeMatch.item1.name;
    const item2Name = activeMatch.item2.name;
    const item1VoteKeywords = [...VOTE_KEYWORDS_ITEM1, ...generateKeywords(item1Name)];
    const item2VoteKeywords = [...VOTE_KEYWORDS_ITEM2, ...generateKeywords(item2Name)];

    const messageHandler = (channel: string, tags: tmi.ChatUserstate, message: string, self: boolean) => {
      if (self || !activeMatch) return; // activeMatch re-check just in case

      const messageLower = message.toLowerCase().trim();
      let voted = false;

      if (item1VoteKeywords.some(keyword => messageLower.includes(keyword))) {
        onScoreUpdate(currentMatchIndex, 'item1');
        voted = true;
      } else if (item2VoteKeywords.some(keyword => messageLower.includes(keyword))) {
        onScoreUpdate(currentMatchIndex, 'item2');
        voted = true;
      }
      // if (voted) console.log(`Vote enregistré pour ${messageLower}`);
    };

    tmiClient.on('message', messageHandler);
    console.log(`TMI.js: Écouteur de messages activé pour: ${item1Name} vs ${item2Name}`);

    return () => {
      if (tmiClient) { // Vérifier si tmiClient existe avant de removeListener
        tmiClient.removeListener('message', messageHandler);
        console.log("TMI.js: Écouteur de messages désactivé.");
      }
    };
  }, [tmiClient, isTmiConnected, activeMatch, currentMatchIndex, tournamentWinner, onScoreUpdate]); // generateKeywords est stable si mis dans useCallback ou utils

  return { tmiClient, isTmiConnected, tmiError, setTmiError };
}