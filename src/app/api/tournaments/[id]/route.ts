import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const TournamentUpdateSchema = z.object({
  title: z.string().trim().min(3, "Le titre doit contenir au moins 3 caractères.").optional(),
  description: z
    .string()
    .trim()
    .max(500, "La description ne doit pas dépasser 500 caractères.")
    .nullable()
    .optional(),
});

function getIdFromRequest(request: NextRequest) {
  const pathname = request.nextUrl.pathname; // ex: "/api/tournaments/<id>"
  const parts = pathname.split('/');
  return parts[parts.length - 1];
}

export async function GET(request: NextRequest) {
  const id = getIdFromRequest(request);

  if (!id) {
    return NextResponse.json({ error: "L'ID du tournoi est manquant." }, { status: 400 });
  }

  try {
    const tournament = await prisma.tournament.findUnique({
      where: { id },
      include: { Items: { orderBy: { createdAt: 'asc' } } },
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

export async function PUT(request: NextRequest) {
  const id = getIdFromRequest(request);

  if (!id) {
    return NextResponse.json({ error: "L'ID du tournoi est manquant." }, { status: 400 });
  }

  try {
    const json = await request.json();

    const parsed = TournamentUpdateSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Erreur de validation." },
        { status: 400 }
      );
    }

    const { title, description } = parsed.data;

    if (!title && description === undefined) {
      return NextResponse.json(
        { error: "Au moins un champ (title ou description) doit être fourni pour la mise à jour." },
        { status: 400 }
      );
    }

    const dataToUpdate = {
      ...(title && { title }),
      ...(description !== undefined && { description }),
    };

    const updatedTournament = await prisma.tournament.update({
      where: { id },
      data: dataToUpdate,
    });

    return NextResponse.json(updatedTournament, { status: 200 });
  } catch (error: any) {
    console.error(`Erreur lors de la mise à jour du tournoi ${id}:`, error);

    if (error.code === 'P2025') {
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

export async function DELETE(request: NextRequest) {
  const id = getIdFromRequest(request);

  if (!id) {
    return NextResponse.json({ error: "L'ID du tournoi est manquant." }, { status: 400 });
  }

  try {
    await prisma.tournament.delete({ where: { id } });
    return NextResponse.json({ message: "Tournoi supprimé avec succès." }, { status: 200 });
  } catch (error: any) {
    console.error(`Erreur lors de la suppression du tournoi ${id}:`, error);

    if (error.code === 'P2025') {
      return NextResponse.json({ error: "Tournoi non trouvé pour la suppression." }, { status: 404 });
    }

    return NextResponse.json(
      { error: "Une erreur interne est survenue.", details: error.message },
      { status: 500 }
    );
  }
}
