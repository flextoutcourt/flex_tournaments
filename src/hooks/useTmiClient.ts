// app/tournament/[id]/live/hooks/useTmiClient.ts
import { useState, useEffect, useCallback, useRef } from 'react'; // Ajout de useRef
import tmi from 'tmi.js';
import { CurrentMatch } from '../types';
import { VOTE_KEYWORDS_ITEM1, VOTE_KEYWORDS_ITEM2 } from '../constants';
import { generateKeywords } from '@/utils/tournamentHelper';
import toast from "react-hot-toast"

interface UseTmiClientProps {
  liveTwitchChannel: string | null;
  isTournamentActive: boolean;
  tournamentWinner: any | null;
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
  
  const votedUsers = useRef(new Set<{username: string;votedItem: string}>());

  // Créer un identifiant stable pour le match actuel
  // Cet identifiant ne changera que si les participants ou le round/match changent réellement.
  const matchIdentifier = activeMatch 
    ? `${activeMatch.roundNumber}-${activeMatch.matchNumberInRound}-${activeMatch.item1.id}-${activeMatch.item2.id}` 
    : null;

  useEffect(() => {
    // Ce useEffect se déclenchera maintenant uniquement lorsque 'matchIdentifier' change,
    // ce qui signifie qu'un nouveau match (différents participants ou round/numéro de match) commence.
    if (matchIdentifier) { // S'assurer qu'il y a un match actif
      console.log(`[TMI VOTE DEBUG] Changement d'identifiant de match: ${matchIdentifier}. Réinitialisation des votants. Votants avant clear:`, Array.from(votedUsers.current));
      votedUsers.current.clear();
      console.log(`[TMI VOTE DEBUG] Votants après clear:`, Array.from(votedUsers.current));
    }
    // Si activeMatch devient null (fin du tournoi), matchIdentifier devient null,
    // et ce hook ne videra pas les votants, ce qui est correct.
  }, [matchIdentifier]); // La dépendance est maintenant l'identifiant stable.

  useEffect(() => {
    if (!isTournamentActive || !liveTwitchChannel || tournamentWinner) {
      if (tmiClient) {
        tmiClient.disconnect();
        setTmiClient(null);
        setIsTmiConnected(false);
      }
      return;
    }

    const client = new tmi.Client({
      options: { debug: false },
      channels: [liveTwitchChannel],
    });

    client.on('connected', (address, port) => {
      setIsTmiConnected(true);
      setTmiError(null);
      console.log(`TMI.js: Connecté à ${liveTwitchChannel}`);
    });

    client.on('disconnected', (reason) => {
      setIsTmiConnected(false);
      console.warn(`TMI.js: Déconnecté. Raison: ${reason}`);
    });

    client.connect().catch(err => {
      setTmiError(`Impossible de se connecter au chat Twitch: "${liveTwitchChannel}".`);
      setIsTmiConnected(false);
      console.error("TMI.js: Erreur de connexion:", err);
    });

    setTmiClient(client);

    return () => {
      if (client && client.readyState() === 'OPEN') {
        client.disconnect();
      }
      setTmiClient(null);
      setIsTmiConnected(false);
    };
  }, [isTournamentActive, liveTwitchChannel, tournamentWinner]);

  useEffect(() => {
    // Ce hook attache/détache le gestionnaire de messages.
    // Il se ré-exécutera si activeMatch change (même si c'est juste une nouvelle référence d'objet avec les mêmes données de match).
    // C'est généralement acceptable, mais la logique de vote unique est maintenant protégée par le 'matchIdentifier' plus stable.
    if (!tmiClient || !isTmiConnected || !activeMatch || tournamentWinner) return;

    const item1Name = activeMatch.item1.name;
    const item2Name = activeMatch.item2.name;
    const item1VoteKeywords = [...VOTE_KEYWORDS_ITEM1];
    const item2VoteKeywords = [...VOTE_KEYWORDS_ITEM2];

    const messageHandler = (channel: string, tags: tmi.ChatUserstate, message: string, self: boolean) => {
      if (self || !activeMatch || !tags.username) return; // Vérifier activeMatch à nouveau ici au cas où il deviendrait null pendant le traitement

      const username = tags.username.toLowerCase();
      const messageLower = message.toLowerCase().trim();

      // Log pour le débogage du match actif au moment du message
      console.log(`[TMI VOTE DEBUG] Message de ${username}: "${messageLower}". Match Actif ID (via closure): ${activeMatch.roundNumber}-${activeMatch.matchNumberInRound}-${activeMatch.item1.id}-${activeMatch.item2.id}. CurrentMatchIndex: ${currentMatchIndex}`);
      console.log(`[TMI VOTE DEBUG] Votants actuels pour ${username} (avant check):`, Array.from(votedUsers.current));

      // Check if user has already voted
      const hasVoted = Array.from(votedUsers.current).some(vote => vote.username === username);
      if (hasVoted) {
        console.log(`[TMI VOTE DEBUG] ${username} a déjà voté pour ce match (ID: ${matchIdentifier}). Vote ignoré.`);
        return;
      }

      let votedItem: 'item1' | 'item2' | null = null;

      console.log(item1VoteKeywords.some(keyword => messageLower == keyword));

      if (item1VoteKeywords.some(keyword => messageLower == keyword)) {
        votedItem = 'item1';
        toast(`${username} à voté pour ${item1Name}`,
          {
            icon: '1️',
            style: {
              borderRadius: '10px',
              background: '#333',
              color: '#fff',
            },
            position: 'bottom-left'
          }
        );
      } else if (item2VoteKeywords.some(keyword => messageLower == keyword)) {
        votedItem = 'item2';
        toast(`${username} à voté pour ${item1Name}`,
          {
            icon: '2️⃣',
            style: {
              borderRadius: '10px',
              background: '#333',
              color: '#fff',
            },
            position: 'bottom-right'
          }
        );
      }

      if (votedItem) {
        votedUsers.current.add({username, votedItem});
        onScoreUpdate(currentMatchIndex, votedItem); // currentMatchIndex est utilisé ici
        console.log(`[TMI VOTE DEBUG] Vote de ${username} pour ${votedItem} ENREGISTRÉ. Nouveaux votants:`, Array.from(votedUsers.current));
      } else {
        // console.log(`[TMI VOTE DEBUG] Message de ${username} ("${messageLower}") n'est pas un vote valide.`);
      }
    };

    tmiClient.on('message', messageHandler);
    console.log(`TMI.js: Écouteur de messages activé pour: ${item1Name} (${item1VoteKeywords.join(', ')}) vs ${item2Name} (${item2VoteKeywords.join(', ')}) (Match ID: ${matchIdentifier})`);

    return () => {
      if (tmiClient) {
        tmiClient.removeListener('message', messageHandler);
        console.log(`TMI.js: Écouteur de messages désactivé (Match ID était: ${matchIdentifier}).`);
      }
    };
  }, [tmiClient, isTmiConnected, activeMatch, currentMatchIndex, tournamentWinner, onScoreUpdate, matchIdentifier]); // Ajout de matchIdentifier ici pour que les logs de l'écouteur soient à jour

  return { tmiClient, isTmiConnected, tmiError, setTmiError, votedUsers };
}
