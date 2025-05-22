// app/api/tournaments/[id]/items/[itemId]/route.ts
import { NextApiRequest, NextApiResponse } from 'next';
import {prisma} from '@/lib/prisma'; // Assurez-vous que ce chemin et l'export de prisma sont corrects

// L'interface DeleteRouteContext n'est plus nécessaire si on type directement le paramètre.

// DELETE: Supprimer un item spécifique d'un tournoi
export async function DELETE(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const { id: tournamentId, itemId } = request.query as { id: string; itemId: string }; // Déstructurer directement depuis params

  if (!tournamentId) {
    return response.status(400).json({ error: "L'ID du tournoi est manquant." });
  }
  if (!itemId) {
    return response.status(400).json({ error: "L'ID de l'item est manquant." });
  }

  try {
    // Vérifier d'abord si le tournoi existe (bonne pratique)
    const tournament = await prisma.tournament.findUnique({
      where: { id: tournamentId },
    });

    if (!tournament) {
      return response.status(404).json({ error: "Tournoi parent non trouvé." });
    }

    // Essayer de supprimer l'item.
    // Prisma lèvera une erreur P2025 (Record to delete does not exist) si l'item n'est pas trouvé.
    const deletedItem = await prisma.item.delete({
      where: {
        id: itemId,
        // Pour s'assurer que l'item appartient bien au tournoi spécifié,
        // vous pouvez ajouter la condition tournamentId si votre modèle Item le contient
        // et si vous avez une contrainte d'unicité sur (tournamentId, itemId) ou si vous voulez cette sécurité.
        // Exemple:
        // AND: [{ tournamentId: tournamentId }],
        // Ou, si vous avez une relation et que vous voulez être sûr :
        // tournament: {
        //   id: tournamentId
        // }
        // Cependant, si 'id' de l'item est globalement unique (comme un CUID),
        // la suppression par 'id: itemId' est directe. La vérification du tournoi parent ci-dessus
        // ajoute déjà une couche de contexte.
      },
    });

    return response.status(200).json({ message: "Item supprimé avec succès.", deletedItem });

  } catch (error: any) {
    console.error(`Erreur lors de la suppression de l'item ${itemId} du tournoi ${tournamentId}:`, error);
    
    if (error.code === 'P2025') { // Erreur Prisma: L'enregistrement à supprimer n'existe pas.
      return response.status(404).json({ error: "Item non trouvé pour la suppression." });
    }
    
    return response.status(500).json(
      { error: "Une erreur interne est survenue lors de la suppression de l'item.", details: error.message }
    );
  }
}
