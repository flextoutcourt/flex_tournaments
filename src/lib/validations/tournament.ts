import { z } from 'zod';

/**
 * Available tournament modes
 */
export const TournamentMode = z.enum(['STANDARD', 'TWO_CATEGORY']);

/**
 * Validation schema for creating a tournament
 */
export const tournamentCreateSchema = z.object({
  title: z.string().trim().min(3, "Le nom du tournoi doit contenir au moins 3 caractères."),
  description: z
    .string()
    .trim()
    .max(500, "La description ne doit pas dépasser 500 caractères.")
    .nullable()
    .optional(),
  mode: TournamentMode.optional().default('STANDARD'),
  categoryA: z.string().trim().optional().nullable(),
  categoryB: z.string().trim().optional().nullable(),
});

/**
 * Validation schema for updating a tournament
 */
export const tournamentUpdateSchema = z.object({
  title: z.string().trim().min(3, "Le nom du tournoi doit contenir au moins 3 caractères.").optional(),
  description: z
    .string()
    .trim()
    .max(500, "La description ne doit pas dépasser 500 caractères.")
    .nullable()
    .optional(),
});

export type TournamentCreateInput = z.infer<typeof tournamentCreateSchema>;
export type TournamentUpdateInput = z.infer<typeof tournamentUpdateSchema>;
export type TournamentModeType = z.infer<typeof TournamentMode>;
