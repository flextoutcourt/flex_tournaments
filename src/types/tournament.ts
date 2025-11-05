/**
 * Tournament-related types
 */

export type TournamentMode = 'STANDARD' | 'TWO_CATEGORY';

export interface Tournament {
  id: string;
  title: string;
  description: string | null;
  mode: TournamentMode;
  categoryA: string | null;
  categoryB: string | null;
  createdAt: Date;
  updatedAt: Date;
  createdById: string | null;
}

export interface TournamentWithItems extends Tournament {
  items: Item[];
}

export interface TournamentWithCreator extends Tournament {
  createdBy?: {
    id: string;
    name: string | null;
    email: string;
  } | null;
}

export interface Item {
  id: string;
  name: string;
  youtubeUrl?: string | null;
  category?: string | null;
  tournamentId: string;
  createdAt: Date;
}

export interface ItemWithScore extends Item {
  score: number;
  youtubeVideoId?: string | null;
}

export interface CurrentMatch {
  item1: ItemWithScore;
  item2: ItemWithScore;
  roundNumber: number;
  matchNumberInRound: number;
}

export interface GenerateMatchesResult {
  matches: CurrentMatch[];
  byeParticipant: Item | null;
}

export interface TournamentFormData {
  title: string;
  description?: string;
  mode: TournamentMode;
  categoryA?: string;
  categoryB?: string;
}
