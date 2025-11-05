import { prisma } from '@/lib/prisma';
import { ValidationError, NotFoundError, DatabaseError } from '@/lib/errors';
import type { TournamentCreateInput, TournamentUpdateInput } from '@/lib/validations/tournament';
import { TOURNAMENT_MODES } from '@/constants/tournament';

/**
 * Tournament service for handling tournament operations
 */
export class TournamentService {
  /**
   * Validate two-category mode requirements
   * @throws ValidationError if validation fails
   */
  static validateTwoCategoryMode(
    mode: string | undefined,
    categoryA: string | null | undefined,
    categoryB: string | null | undefined
  ): void {
    if (mode === TOURNAMENT_MODES.TWO_CATEGORY) {
      if (!categoryA || !categoryB) {
        throw new ValidationError(
          'Les deux catégories doivent être fournies pour le mode à deux catégories.'
        );
      }

      if (categoryA.trim().toLowerCase() === categoryB.trim().toLowerCase()) {
        throw new ValidationError('Les deux catégories doivent être différentes.');
      }
    }
  }

  /**
   * Create a new tournament
   * @throws ValidationError if validation fails
   * @throws DatabaseError if database operation fails
   */
  static async createTournament(
    data: TournamentCreateInput,
    createdById: string
  ) {
    try {
      // Validate two-category mode
      this.validateTwoCategoryMode(data.mode, data.categoryA, data.categoryB);

      const tournament = await prisma.tournament.create({
        data: {
          title: data.title,
          description: data.description,
          mode: data.mode ?? TOURNAMENT_MODES.STANDARD,
          categoryA: data.categoryA ?? null,
          categoryB: data.categoryB ?? null,
          createdById,
        },
      });

      return tournament;
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      throw new DatabaseError('Erreur lors de la création du tournoi', error);
    }
  }

  /**
   * Get all tournaments
   */
  static async getAllTournaments() {
    try {
      return await prisma.tournament.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });
    } catch (error) {
      throw new DatabaseError('Erreur lors de la récupération des tournois', error);
    }
  }

  /**
   * Get a tournament by ID
   * @throws NotFoundError if tournament doesn't exist
   */
  static async getTournamentById(id: string) {
    try {
      const tournament = await prisma.tournament.findUnique({
        where: { id },
        include: {
          Items: true,
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      if (!tournament) {
        throw new NotFoundError('Tournoi non trouvé');
      }

      return tournament;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new DatabaseError('Erreur lors de la récupération du tournoi', error);
    }
  }

  /**
   * Update a tournament
   * @throws NotFoundError if tournament doesn't exist
   */
  static async updateTournament(id: string, data: TournamentUpdateInput) {
    try {
      const tournament = await prisma.tournament.update({
        where: { id },
        data: {
          ...(data.title && { title: data.title }),
          ...(data.description !== undefined && { description: data.description }),
        },
      });

      return tournament;
    } catch (error) {
      throw new DatabaseError('Erreur lors de la mise à jour du tournoi', error);
    }
  }

  /**
   * Delete a tournament
   * @throws NotFoundError if tournament doesn't exist
   */
  static async deleteTournament(id: string) {
    try {
      await prisma.tournament.delete({
        where: { id },
      });
    } catch (error) {
      throw new DatabaseError('Erreur lors de la suppression du tournoi', error);
    }
  }

  /**
   * Add an item to a tournament
   */
  static async addItemToTournament(
    tournamentId: string,
    itemData: {
      name: string;
      youtubeUrl?: string;
      category?: string;
    }
  ) {
    try {
      // Verify tournament exists
      await this.getTournamentById(tournamentId);

      const item = await prisma.item.create({
        data: {
          name: itemData.name,
          youtubeUrl: itemData.youtubeUrl,
          category: itemData.category,
          tournamentId,
        },
      });

      return item;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new DatabaseError('Erreur lors de l\'ajout de l\'élément', error);
    }
  }

  /**
   * Get all items for a tournament
   */
  static async getTournamentItems(tournamentId: string) {
    try {
      return await prisma.item.findMany({
        where: { tournamentId },
        orderBy: { createdAt: 'asc' },
      });
    } catch (error) {
      throw new DatabaseError('Erreur lors de la récupération des éléments', error);
    }
  }
}
