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

export const generateMatches = (
  participants: Item[], 
  roundNum: number, 
  twoCategoryMode: boolean = false,
  orderedCategoryNames?: [string, string]
): GenerateMatchesResult => {
  console.log(`Génération des matchs pour Round ${roundNum} avec participants:`, participants.map(p => p.name));
  if (participants.length === 0) {
    return { matches: [], byeParticipant: null };
  }
  if (participants.length === 1) {
    return { matches: [], byeParticipant: participants[0] };
  }

  const newMatches: CurrentMatch[] = [];
  let byeParticipant: Item | null = null;

  if (twoCategoryMode) {
    // Regrouper par catégorie
    const map: Record<string, Item[]> = {};
    participants.forEach(p => {
      const cat = (p.category || '__none__') as string;
      if (!map[cat]) map[cat] = [];
      map[cat].push(p);
    });

    let cats = Object.keys(map).filter(c => c !== '__none__');
    
    // For first round with specified category order, use that order
    // For subsequent rounds, use alphabetical sort for consistency
    if (roundNum === 1 && orderedCategoryNames && cats.length === 2) {
      // Try to order based on provided category names
      cats = cats.sort((a, b) => {
        const indexA = orderedCategoryNames.indexOf(a);
        const indexB = orderedCategoryNames.indexOf(b);
        return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
      });
    } else {
      cats = cats.sort();
    }

    // Si exactement 2 catégories non-null présentes, on paire cross-catégorie
    if (cats.length === 2) {
      // For first round: cats[0] on left (item1), cats[1] on right (item2)
      // For subsequent rounds: normal random matching
      const a = shuffleArray(map[cats[0]]);
      const b = shuffleArray(map[cats[1]]);

      const minLen = Math.min(a.length, b.length);
      for (let i = 0; i < minLen; i++) {
        newMatches.push({
          item1: { ...a[i], score: 0, youtubeVideoId: getYouTubeVideoId(a[i].youtubeUrl) },
          item2: { ...b[i], score: 0, youtubeVideoId: getYouTubeVideoId(b[i].youtubeUrl) },
          roundNumber: roundNum,
          matchNumberInRound: newMatches.length + 1,
        });
      }

      // Collect leftovers from both groups
      const leftovers = [...a.slice(minLen), ...b.slice(minLen)];
      if (leftovers.length === 1) {
        byeParticipant = leftovers[0];
      } else if (leftovers.length > 1) {
        // choose one random bye among leftovers, others will be ignored this round
        byeParticipant = leftovers[0];
      }
      console.log(`generateMatches (twoCategoryMode): Round ${roundNum} généré avec ${newMatches.length} matchs. Bye: ${byeParticipant?.name || 'Aucun'}`);
      return { matches: newMatches, byeParticipant };
    }
    // Sinon, si pas exactement 2 catégories, retomber sur génération classique
  }

  // Mode classique: paire aléatoire
  const shuffled = shuffleArray(participants);
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
  return { matches: newMatches, byeParticipant };
};