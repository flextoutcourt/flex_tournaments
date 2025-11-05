/**
 * Tournament-related constants
 */

/**
 * Available tournament modes
 */
export const TOURNAMENT_MODES = {
  STANDARD: 'STANDARD',
  TWO_CATEGORY: 'TWO_CATEGORY',
} as const;

/**
 * Tournament item count options
 */
export const ITEM_COUNT_OPTIONS = {
  ALL: 'all',
  EIGHT: '8',
  SIXTEEN: '16',
  THIRTY_TWO: '32',
} as const;

/**
 * Tournament status
 */
export const TOURNAMENT_STATUS = {
  NOT_STARTED: 'NOT_STARTED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
} as const;

/**
 * LocalStorage keys
 */
export const STORAGE_KEYS = {
  TOURNAMENT_STATE: (tournamentId: string) => `tournamentState_${tournamentId}`,
} as const;

/**
 * Default values
 */
export const TOURNAMENT_DEFAULTS = {
  MODE: TOURNAMENT_MODES.STANDARD,
  ROUND_NUMBER: 1,
  MATCH_INDEX: 0,
} as const;

/**
 * Validation constraints
 */
export const TOURNAMENT_CONSTRAINTS = {
  TITLE_MIN_LENGTH: 3,
  TITLE_MAX_LENGTH: 100,
  DESCRIPTION_MAX_LENGTH: 500,
  MIN_PARTICIPANTS: 2,
} as const;
