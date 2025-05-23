// app/tournament/[id]/live/types.ts
export interface Item {
  id: string;
  name: string;
  youtubeUrl?: string | null;
  youtubeVideoId?: string | null; // Ajouté pour la cohérence après getYouTubeVideoId
}

export interface TournamentData {
  items: Item[];
  title: string;
}

export interface MatchParticipant extends Item { // Étend Item pour inclure youtubeVideoId
  score: number;
}

export interface CurrentMatch {
  item1: MatchParticipant;
  item2: MatchParticipant;
  roundNumber: number;
  matchNumberInRound: number;
}

export interface GenerateMatchesResult {
  matches: CurrentMatch[];
  byeParticipant: Item | null;
}

declare global {
    interface Window {
        onYouTubeIframeAPIReady?: () => void;
        isYouTubeApiReadyState?: boolean;
    }
}