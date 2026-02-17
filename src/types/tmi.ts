/**
 * TMI.js Related Types
 */

import { CurrentMatch as BaseCurrentMatch } from '@/types';

export interface UseTmiClientProps {
  liveTwitchChannel: string | null;
  isTournamentActive: boolean;
  tournamentWinner: any | null;
  activeMatch: BaseCurrentMatch | null;
  currentMatchIndex: number;
  onScoreUpdate: (matchIndex: number, itemKey: 'item1' | 'item2') => void;
  onModifyScore: (matchIndex: number, itemKey: 'item1' | 'item2', amount: number) => void;
  onVoteReceived?: (itemKey: 'item1' | 'item2') => void;
  tournamentId?: string | null;
}

export type CurrentMatch = BaseCurrentMatch;

export interface VotePayload {
  vote: '1' | '2';
  username: string;
  userId: string;
  ts: number;
}

export interface ModeratorCommand {
  type: 'add' | 'remove' | 'set';
  voteNumber: '1' | '2';
  amount: number;
  targetScore?: number;
}

export interface TmiClientState {
  client: any | null;
  isConnected: boolean;
  error: string | null;
}
