// app/tournament/[id]/live/hooks/useTmiClient.ts
import { useState, useEffect, useRef } from 'react';
import tmi from 'tmi.js';
import { CurrentMatch } from '../types';
import { VOTE_KEYWORDS_ITEM1, VOTE_KEYWORDS_ITEM2 } from '../constants';
import toast from "react-hot-toast"

interface UseTmiClientProps {
  liveTwitchChannel: string | null;
  isTournamentActive: boolean;
  tournamentWinner: any | null;
  activeMatch: CurrentMatch | null;
  currentMatchIndex: number;
  onScoreUpdate: (matchIndex: number, itemKey: 'item1' | 'item2') => void;
  onModifyScore: (matchIndex: number, itemKey: 'item1' | 'item2', amount: number) => void;
  onVoteReceived?: (itemKey: 'item1' | 'item2') => void;
}

export function useTmiClient({
  liveTwitchChannel,
  isTournamentActive,
  tournamentWinner,
  activeMatch,
  currentMatchIndex,
  onScoreUpdate,
  onModifyScore,
  onVoteReceived
}: UseTmiClientProps) {
  const [tmiClient, setTmiClient] = useState<tmi.Client | null>(null);
  const [isTmiConnected, setIsTmiConnected] = useState(false);
  const [tmiError, setTmiError] = useState<string | null>(null);
  
  const votedUsers = useRef(new Set<{username: string;votedItem: string}>());
  const superVoteUsers = useRef(new Set<string>()); // Track users who have used their super vote for the entire tournament
  const superVotesThisMatch = useRef(new Set<string>()); // Track which users used super vote in current match only

  // Créer un identifiant stable pour le match actuel
  // Cet identifiant ne changera que si les participants ou le round/match changent réellement.
  const matchIdentifier = activeMatch 
    ? `${activeMatch.roundNumber}-${activeMatch.matchNumberInRound}-${activeMatch.item1.id}-${activeMatch.item2.id}` 
    : null;

  // Reset super vote users when tournament starts/restarts
  useEffect(() => {
    if (isTournamentActive && !tournamentWinner) {
      // Tournament is active, clear super votes for fresh start
      superVoteUsers.current.clear();
      console.log(`[TMI SUPER VOTE DEBUG] Tournament started/restarted. Super votes cleared.`);
    }
  }, [isTournamentActive, tournamentWinner]);

  useEffect(() => {
    // Ce useEffect se déclenchera maintenant uniquement lorsque 'matchIdentifier' change,
    // ce qui signifie qu'un nouveau match (différents participants ou round/numéro de match) commence.
    if (matchIdentifier) { // S'assurer qu'il y a un match actif
      console.log(`[TMI VOTE DEBUG] Changement d'identifiant de match: ${matchIdentifier}. Réinitialisation des votants. Votants avant clear:`, Array.from(votedUsers.current));
      votedUsers.current.clear();
      superVotesThisMatch.current.clear(); // Clear super votes for this match
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

    client.on('connected', (_address, _port) => {
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

      // Moderator commands - only for luniqueflex
      if (username === 'luniqueflex') {
        const addVoteMatch = messageLower.match(/^\.\.add vote ([12]) (\d+)$/);
        const removeVoteMatch = messageLower.match(/^\.\.remove vote ([12]) (\d+)$/);
        const setVoteMatch = messageLower.match(/^\.\.set vote ([12]) (\d+)$/);

        if (addVoteMatch) {
          const voteNumber = addVoteMatch[1];
          const amount = parseInt(addVoteMatch[2], 10);
          const votedItem = voteNumber === '1' ? 'item1' : 'item2';
          const itemName = votedItem === 'item1' ? item1Name : item2Name;
          
          onModifyScore(currentMatchIndex, votedItem, amount);
          console.log(`[TMI MOD COMMAND] ${username} forced add ${amount} vote(s) for ${votedItem} (${itemName})`);
          
          toast(`🔧 Mod: +${amount} vote${amount > 1 ? 's' : ''} pour ${itemName}`, {
            icon: voteNumber === '1' ? '1️⃣' : '2️⃣',
            style: {
              borderRadius: '10px',
              background: '#6366f1',
              color: '#fff',
            },
            position: 'top-center'
          });
          return;
        }

        if (removeVoteMatch) {
          const voteNumber = removeVoteMatch[1];
          const amount = parseInt(removeVoteMatch[2], 10);
          const votedItem = voteNumber === '1' ? 'item1' : 'item2';
          const itemName = votedItem === 'item1' ? item1Name : item2Name;
          
          onModifyScore(currentMatchIndex, votedItem, -amount);
          console.log(`[TMI MOD COMMAND] ${username} forced remove ${amount} vote(s) from ${votedItem} (${itemName})`);
          
          toast(`🔧 Mod: -${amount} vote${amount > 1 ? 's' : ''} pour ${itemName}`, {
            icon: '❌',
            style: {
              borderRadius: '10px',
              background: '#ef4444',
              color: '#fff',
            },
            position: 'top-center'
          });
          return;
        }

        if (setVoteMatch) {
          const voteNumber = setVoteMatch[1];
          const targetScore = parseInt(setVoteMatch[2], 10);
          const votedItem = voteNumber === '1' ? 'item1' : 'item2';
          const itemName = votedItem === 'item1' ? item1Name : item2Name;
          const currentScore = votedItem === 'item1' ? activeMatch.item1.score : activeMatch.item2.score;
          const difference = targetScore - currentScore;
          
          onModifyScore(currentMatchIndex, votedItem, difference);
          console.log(`[TMI MOD COMMAND] ${username} set score to ${targetScore} for ${votedItem} (${itemName}) [was ${currentScore}]`);
          
          toast(`🔧 Mod: Score défini à ${targetScore} pour ${itemName}`, {
            icon: '⚙️',
            style: {
              borderRadius: '10px',
              background: '#8b5cf6',
              color: '#fff',
            },
            position: 'top-center'
          });
          return;
        }
      }

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
        toast(`${username} à voté pour ${item2Name}`,
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
      } else if (messageLower === 'super 1' || messageLower === 'super 2') {
        // Super vote command
        if (superVoteUsers.current.has(username)) {
          console.log(`[TMI SUPER VOTE DEBUG] ${username} a déjà utilisé son super vote.`);
          return;
        }

        votedItem = messageLower === 'super 1' ? 'item1' : 'item2';
        const itemName = votedItem === 'item1' ? item1Name : item2Name;
        
        // Mark user as having used their super vote tournament-wide
        superVoteUsers.current.add(username);
        // Also mark in current match
        superVotesThisMatch.current.add(username);
        
        toast(`⭐ ${username} a activé le SUPER VOTE pour ${itemName}! (+2 votes)`, {
          icon: '⭐',
          style: {
            borderRadius: '10px',
            background: '#f59e0b',
            color: '#fff',
          },
          position: 'bottom-center'
        });

        // Add vote twice for super vote
        votedUsers.current.add({username, votedItem});
        
        // Trigger animations twice for super vote
        if (onVoteReceived) {
          onVoteReceived(votedItem);
          onVoteReceived(votedItem);
        }
        
        // Update score twice for super vote
        onScoreUpdate(currentMatchIndex, votedItem);
        onScoreUpdate(currentMatchIndex, votedItem);
        console.log(`[TMI SUPER VOTE DEBUG] Super vote de ${username} pour ${votedItem} ENREGISTRÉ (x2). Nouveaux votants:`, Array.from(votedUsers.current));
        return;
      }

      if (votedItem) {
        votedUsers.current.add({username, votedItem});
        
        // Trigger animation before updating score
        if (onVoteReceived) {
          onVoteReceived(votedItem);
        }
        
        onScoreUpdate(currentMatchIndex, votedItem); // currentMatchIndex est utilisé ici
        console.log(`[TMI VOTE DEBUG] Vote de ${username} pour ${votedItem} ENREGISTRÉ. Nouveaux votants:`, Array.from(votedUsers.current));
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
  }, [tmiClient, isTmiConnected, activeMatch, currentMatchIndex, tournamentWinner, onScoreUpdate, onModifyScore, onVoteReceived, matchIdentifier]);

  return { tmiClient, isTmiConnected, tmiError, setTmiError, votedUsers, superVotesThisMatch };
}
