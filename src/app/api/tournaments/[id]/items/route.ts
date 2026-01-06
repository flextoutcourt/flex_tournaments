import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { logActivity, getIpFromRequest, getUserAgentFromRequest } from '@/services/logService';

interface ItemCreateRequest {
  name?: string;
  youtubeUrl?: string | null;
  category?: string | null;
}

// Utilitaire pour extraire l'ID du tournoi depuis le path
function extractTournamentId(pathname: string): string | null {
  const match = pathname.match(/^\/api\/tournaments\/([^/]+)\/items$/);
  return match ? match[1] : null;
}

// Utilitaire pour extraire l’ID de vidéo YouTube
function getYouTubeVideoId(url: string): string | null {
  const regExp = /^.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[1]?.length === 11 ? match[1] : null;
}

export async function POST(request: NextRequest) {
  // Check authentication - user must be logged in to add items
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json(
      { error: "Vous devez être connecté pour ajouter des participants." },
      { status: 401 }
    );
  }

  const tournamentId = extractTournamentId(request.nextUrl.pathname);
  const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

  if (!tournamentId) {
    return NextResponse.json({ error: "L'ID du tournoi est manquant." }, { status: 400 });
  }

  try {
    const body = await request.json() as ItemCreateRequest;
    let itemName = body.name?.trim();
    const youtubeUrl = body.youtubeUrl?.trim();

    if (youtubeUrl && !itemName && YOUTUBE_API_KEY) {
      const videoId = getYouTubeVideoId(youtubeUrl);
      if (videoId) {
        try {
          const ytRes = await fetch(`https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${YOUTUBE_API_KEY}&part=snippet`);
          if (ytRes.ok) {
            const ytData = await ytRes.json();
            itemName = ytData.items?.[0]?.snippet?.title ?? itemName;
          } else {
            console.warn("Erreur API YouTube:", await ytRes.json());
          }
        } catch (err) {
          console.error("Erreur YouTube fetch:", err);
        }
      }
    }

    if (!itemName || itemName.length < 2) {
      return NextResponse.json(
        { error: "Le nom de l'item est requis (ou récupérable via URL YouTube valide) et doit faire au moins 2 caractères." },
        { status: 400 }
      );
    }

    if (youtubeUrl) {
      try {
        new URL(youtubeUrl);
        const valid = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/.test(youtubeUrl);
        if (!valid) {
          return NextResponse.json({ error: "L'URL YouTube est invalide." }, { status: 400 });
        }
      } catch {
        return NextResponse.json({ error: "L'URL YouTube fournie est invalide." }, { status: 400 });
      }
    }

    const tournament = await prisma.tournament.findUnique({ where: { id: tournamentId } });
    if (!tournament) {
      return NextResponse.json({ error: "Tournoi non trouvé." }, { status: 404 });
    }

    // Si le tournoi est en mode TWO_CATEGORY, valider la catégorie fournie
    if ((tournament as any).mode === 'TWO_CATEGORY') {
      const providedCat = body.category ? body.category.trim() : null;
      if (!providedCat) {
        return NextResponse.json({ error: "La catégorie est requise pour ce tournoi." }, { status: 400 });
      }
      const allowedA = (tournament as any).categoryA?.trim().toLowerCase();
      const allowedB = (tournament as any).categoryB?.trim().toLowerCase();
      if (providedCat.toLowerCase() !== allowedA && providedCat.toLowerCase() !== allowedB) {
        return NextResponse.json({ error: `Catégorie invalide. Utilisez '${(tournament as any).categoryA}' ou '${(tournament as any).categoryB}'.` }, { status: 400 });
      }
    }

    const existingItem = await prisma.item.findFirst({
      where: {
        tournamentId,
        name: { equals: itemName, mode: 'insensitive' },
      },
    });

    if (existingItem) {
      return NextResponse.json({ error: `Un participant nommé "${itemName}" existe déjà.` }, { status: 409 });
    }

    const newItem = await prisma.item.create({
      data: {
        name: itemName,
        youtubeUrl: youtubeUrl || null,
        category: body.category ? body.category.trim() : null,
        tournamentId,
      },
    });

    // Log the activity
    await logActivity({
      userId: session.user?.id,
      action: 'item_created',
      description: `Participant "${itemName}" ajouté au tournoi`,
      entityType: 'item',
      entityId: newItem.id,
      ipAddress: getIpFromRequest(request),
      userAgent: getUserAgentFromRequest(request),
    });

    // Also log at tournament level
    await logActivity({
      userId: session.user?.id,
      action: 'tournament_item_added',
      description: `Participant "${itemName}" ajouté`,
      entityType: 'tournament',
      entityId: tournamentId,
      ipAddress: getIpFromRequest(request),
      userAgent: getUserAgentFromRequest(request),
    });

    return NextResponse.json(newItem, { status: 201 });

  } catch (err: any) {
    console.error("Erreur POST item:", err);
    if (err instanceof SyntaxError) {
      return NextResponse.json({ error: "Corps JSON invalide." }, { status: 400 });
    }
    return NextResponse.json({ error: "Erreur interne.", details: err.message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const tournamentId = extractTournamentId(request.nextUrl.pathname);

  if (!tournamentId) {
    return NextResponse.json({ error: "L'ID du tournoi est manquant." }, { status: 400 });
  }

  try {
    const exists = await prisma.tournament.count({ where: { id: tournamentId } });

    if (!exists) {
      return NextResponse.json({ error: "Tournoi non trouvé." }, { status: 404 });
    }

    const items = await prisma.item.findMany({
      where: { tournamentId },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json(items, { status: 200 });

  } catch (err: any) {
    console.error("Erreur GET items:", err);
    return NextResponse.json({ error: "Erreur serveur.", details: err.message }, { status: 500 });
  }
}
