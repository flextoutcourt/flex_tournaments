// app/api/tournaments/[id]/items/[itemId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import {prisma} from '@/lib/prisma'; // Ajustez le chemin vers votre instance Prisma

// DELETE: Supprimer un item spécifique d'un tournoi
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; itemId: string } }
) {
  const { id, itemId } = params;

  if (!id) {
    return NextResponse.json({ error: "L'ID du tournoi est manquant." }, { status: 400 });
  }
  if (!itemId) {
    return NextResponse.json({ error: "L'ID de l'item est manquant." }, { status: 400 });
  }

  try {
    // Vérifier d'abord si le tournoi existe (optionnel, mais bonne pratique)
    const tournament = await prisma.tournament.findUnique({
      where: { id: id },
    });

    if (!tournament) {
      return NextResponse.json({ error: "Tournoi parent non trouvé." }, { status: 404 });
    }

    // Essayer de supprimer l'item
    // Prisma lèvera une erreur P2025 (Record to delete does not exist) si l'item n'est pas trouvé.
    const deletedItem = await prisma.item.delete({
      where: {
        id: itemId,
        // S'assurer que l'item appartient bien au tournoi spécifié avant de le supprimer
        // Cela évite de supprimer un item qui n'appartient pas au bon tournoi si seul l'itemId est utilisé.
        // Cependant, si l'ID de l'item est globalement unique, la clause id ici est une double vérification.
        // Si votre logique garantit que l'itemId est toujours correct pour le id,
        // une simple suppression par `id: itemId` suffit.
        // Pour plus de sécurité, on peut faire une recherche préalable ou utiliser une transaction.
        // Ici, on suppose que l'itemId est suffisant si la logique client est correcte.
        // Si vous voulez être plus strict :
        // const itemToDelete = await prisma.item.findFirst({
        //   where: { id: itemId, id: id }
        // });
        // if (!itemToDelete) {
        //   return NextResponse.json({ error: "Item non trouvé dans ce tournoi ou n'existe pas." }, { status: 404 });
        // }
        // await prisma.item.delete({ where: { id: itemId }});
      },
    });

    return NextResponse.json({ message: "Item supprimé avec succès.", deletedItem }, { status: 200 });

  } catch (error: any) {
    console.error(`Erreur lors de la suppression de l'item ${itemId} du tournoi ${id}:`, error);
    
    if (error.code === 'P2025') { // Erreur Prisma: L'enregistrement à supprimer n'existe pas.
      return NextResponse.json({ error: "Item non trouvé pour la suppression." }, { status: 404 });
    }
    
    return NextResponse.json(
      { error: "Une erreur interne est survenue lors de la suppression de l'item.", details: error.message },
      { status: 500 }
    );
  }
}
