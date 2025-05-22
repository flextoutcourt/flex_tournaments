// app/api/tournaments/[id]/items/[itemId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import {prisma} from '@/lib/prisma'; // Assurez-vous que ce chemin et l'export de prisma sont corrects

// Définir une interface pour le contexte de la route, y compris les paramètres dynamiques
interface DeleteRouteContext {
  params: {
    id: string;       // Correspond au segment [id] de l'URL (sera utilisé comme tournamentId)
    itemId: string;   // Correspond au segment [itemId] de l'URL
  };
}

// DELETE: Supprimer un item spécifique d'un tournoi
export async function DELETE(
  request: NextRequest,
  context: DeleteRouteContext // Utiliser l'interface définie pour le deuxième argument
) {
  const { id: tournamentId, itemId } = context.params; // Déstructurer et renommer 'id' en 'tournamentId' pour la clarté

  if (!tournamentId) {
    return NextResponse.json({ error: "L'ID du tournoi est manquant." }, { status: 400 });
  }
  if (!itemId) {
    return NextResponse.json({ error: "L'ID de l'item est manquant." }, { status: 400 });
  }

  try {
    // Vérifier d'abord si le tournoi existe (bonne pratique)
    const tournament = await prisma.tournament.findUnique({
      where: { id: tournamentId },
    });

    if (!tournament) {
      return NextResponse.json({ error: "Tournoi parent non trouvé." }, { status: 404 });
    }

    // Essayer de supprimer l'item.
    // Prisma lèvera une erreur P2025 (Record to delete does not exist) si l'item n'est pas trouvé.
    const deletedItem = await prisma.item.delete({
      where: {
        id: itemId,
        // Si vous voulez vous assurer que l'item appartient bien au tournoi spécifié,
        // et que votre modèle Item a un champ tournamentId, vous pouvez ajouter :
        // tournamentId: tournamentId,
        // Cela rend la condition de suppression plus stricte.
        // Cependant, si itemId est globalement unique (comme un CUID),
        // where: { id: itemId } est généralement suffisant.
      },
    });

    return NextResponse.json({ message: "Item supprimé avec succès.", deletedItem }, { status: 200 });

  } catch (error: any) {
    console.error(`Erreur lors de la suppression de l'item ${itemId} du tournoi ${tournamentId}:`, error);
    
    if (error.code === 'P2025') { // Erreur Prisma: L'enregistrement à supprimer n'existe pas.
      return NextResponse.json({ error: "Item non trouvé pour la suppression." }, { status: 404 });
    }
    
    return NextResponse.json(
      { error: "Une erreur interne est survenue lors de la suppression de l'item.", details: error.message },
      { status: 500 }
    );
  }
}
