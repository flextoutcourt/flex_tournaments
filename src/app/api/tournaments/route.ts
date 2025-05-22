// app/api/tournaments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Schéma de validation avec Zod
const TournamentCreateSchema = z.object({
  title: z.string().trim().min(3, "Le nom du tournoi doit contenir au moins 3 caractères."),
  description: z
    .string()
    .trim()
    .max(500, "La description ne doit pas dépasser 500 caractères.")
    .nullable()
    .optional(),
});

// POST: Créer un nouveau tournoi
export async function POST(request: NextRequest) {
  try {
    const json = await request.json();

    const parsed = TournamentCreateSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Erreur de validation." },
        { status: 400 }
      );
    }

    const { title, description } = parsed.data;

    const newTournament = await prisma.tournament.create({
      data: { title, description },
    });

    return NextResponse.json(newTournament, { status: 201 });
  } catch (error: any) {
    console.error("Erreur lors de la création du tournoi:", error);

    if (error.code === 'P2002' && error.meta?.target?.includes('title')) {
      return NextResponse.json(
        { error: "Un tournoi avec ce titre existe déjà." },
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
      { error: "Une erreur interne est survenue lors de la création du tournoi.", details: error.message },
      { status: 500 }
    );
  }
}

// GET: Récupérer tous les tournois
export async function GET(request: NextRequest) {
  try {
    const tournaments = await prisma.tournament.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(tournaments, { status: 200 });
  } catch (error: any) {
    console.error("Erreur lors de la récupération des tournois:", error);
    return NextResponse.json(
      { error: "Une erreur interne est survenue lors de la récupération des tournois.", details: error.message },
      { status: 500 }
    );
  }
}
