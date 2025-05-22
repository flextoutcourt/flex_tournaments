// app/api/tournaments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import {prisma} from '@/lib/prisma'; // Assurez-vous que le chemin vers votre instance Prisma est correct

// Interface pour le corps de la requête attendu
interface TournamentCreateRequest {
  title: string;
  description?: string | null;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as TournamentCreateRequest;
    const { title, description } = body;

    // Validation simple (des validations plus complexes peuvent être ajoutées)
    if (!title || typeof title !== 'string' || title.trim().length < 3) {
      return NextResponse.json(
        { error: "Le nom du tournoi est requis et doit contenir au moins 3 caractères." },
        { status: 400 }
      );
    }

    if (description && (typeof description !== 'string' || description.length > 500)) {
      return NextResponse.json(
        { error: "La description ne doit pas dépasser 500 caractères." },
        { status: 400 }
      );
    }

    // Création du tournoi dans la base de données
    const newTournament = await prisma.tournament.create({
      data: body,
    });

    return NextResponse.json(newTournament, { status: 201 });

  } catch (error: any) {
    console.error("Erreur lors de la création du tournoi:", error);

    // Gérer les erreurs spécifiques de Prisma (ex: contrainte d'unicité sur le nom)
    if (error.code === 'P2002' && error.meta?.target?.includes('name')) {
      return NextResponse.json(
        { error: "Un tournoi avec ce nom existe déjà." },
        { status: 409 } // 409 Conflict
      );
    }
    
    // Gérer les erreurs de parsing JSON
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

// Optionnel: Gérer la récupération de tous les tournois (GET)
export async function GET(request: NextRequest) {
  try {
    const tournaments = await prisma.tournament.findMany({
      orderBy: {
        createdAt: 'desc', // Afficher les plus récents en premier
      },
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
