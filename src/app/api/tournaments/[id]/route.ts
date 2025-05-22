// app/api/tournaments/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import {prisma} from '@/lib/prisma'; // Ajustez le chemin vers votre instance Prisma

interface TournamentUpdateRequest {
  title?: string;
  description?: string | null;
  // Vous pourrez ajouter d'autres champs ici plus tard, comme 'status'
}

// GET: Récupérer un tournoi spécifique par son ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: "L'ID du tournoi est manquant." }, { status: 400 });
  }

  try {
    const tournament = await prisma.tournament.findUnique({
      where: { id },
      include: {
        Items: { // Inclure les items associés, triés par date de création
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    if (!tournament) {
      return NextResponse.json({ error: "Tournoi non trouvé." }, { status: 404 });
    }

    return NextResponse.json(tournament, { status: 200 });
  } catch (error: any) {
    console.error(`Erreur lors de la récupération du tournoi ${id}:`, error);
    return NextResponse.json(
      { error: "Une erreur interne est survenue.", details: error.message },
      { status: 500 }
    );
  }
}

// PUT: Mettre à jour un tournoi spécifique
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: "L'ID du tournoi est manquant." }, { status: 400 });
  }

  try {
    const body = await request.json() as TournamentUpdateRequest;
    const { title, description } = body;

    // Validation
    if (!title && description === undefined) {
      return NextResponse.json(
        { error: "Au moins un champ (title ou description) doit être fourni pour la mise à jour." },
        { status: 400 }
      );
    }
    if (title && (typeof title !== 'string' || title.trim().length < 3)) {
      return NextResponse.json(
        { error: "Le titre du tournoi doit contenir au moins 3 caractères." },
        { status: 400 }
      );
    }
    if (description !== undefined && description !== null && (typeof description !== 'string' || description.length > 500)) {
      return NextResponse.json(
        { error: "La description ne doit pas dépasser 500 caractères." },
        { status: 400 }
      );
    }
    
    const dataToUpdate: TournamentUpdateRequest = {};
    if (title) {
        dataToUpdate.title = title.trim();
    }
    if (description !== undefined) { // Permet de mettre la description à null ou une chaîne vide
        dataToUpdate.description = description === null ? null : description.trim();
    }


    const updatedTournament = await prisma.tournament.update({
      where: { id },
      data: dataToUpdate,
    });

    return NextResponse.json(updatedTournament, { status: 200 });

  } catch (error: any) {
    console.error(`Erreur lors de la mise à jour du tournoi ${id}:`, error);
    if (error.code === 'P2025') { // Erreur si l'enregistrement à mettre à jour n'existe pas
      return NextResponse.json({ error: "Tournoi non trouvé pour la mise à jour." }, { status: 404 });
    }
    if (error.code === 'P2002' && error.meta?.target?.includes('title')) {
      return NextResponse.json(
        { error: "Un autre tournoi avec ce titre existe déjà." },
        { status: 409 }
      );
    }
    if (error instanceof SyntaxError) {
        return NextResponse.json(
            { error: "Corps de la requête JSON invalide." },
            { status: 400 }
        );
    }
    return NextResponse.json(
      { error: "Une erreur interne est survenue.", details: error.message },
      { status: 500 }
    );
  }
}

// DELETE: Supprimer un tournoi spécifique
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: "L'ID du tournoi est manquant." }, { status: 400 });
  }

  try {
    // La suppression en cascade des Items est gérée par la relation onDelete: Cascade dans schema.prisma
    await prisma.tournament.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Tournoi supprimé avec succès." }, { status: 200 }); // Ou 204 No Content

  } catch (error: any) {
    console.error(`Erreur lors de la suppression du tournoi ${id}:`, error);
    if (error.code === 'P2025') { // Erreur si l'enregistrement à supprimer n'existe pas
      return NextResponse.json({ error: "Tournoi non trouvé pour la suppression." }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Une erreur interne est survenue.", details: error.message },
      { status: 500 }
    );
  }
}
