// app/tournament/[id]/live/utils/tournamentHelpers.ts
import { Item, CurrentMatch, GenerateMatchesResult } from '../types';
import { shuffleArray } from './arrayUtils';
import { getYouTubeVideoId } from './youtubeUtils';

export const generateKeywords = (itemName: string): string[] => {
  if (!itemName) return [];
  const nameParts = itemName.toLowerCase().split(/[\s-]+/);
  const keywords = [...nameParts.filter(part => part.length > 1)];
  if (keywords.length === 0 && nameParts.length > 0) {
    keywords.push(nameParts[0]);
  }
  return keywords.slice(0, 3);
};

export const generateMatches = (participants: Item[], roundNum: number): GenerateMatchesResult => {
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
};