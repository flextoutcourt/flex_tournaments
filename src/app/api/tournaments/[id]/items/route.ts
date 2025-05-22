// app/api/tournaments/[id]/items/route.ts
import { NextRequest, NextResponse } from 'next/server';
import {prisma} from '@/lib/prisma'; // Ajustez le chemin vers votre instance Prisma

interface ItemCreateRequest {
  name?: string; // Nom est maintenant optionnel, peut être dérivé de YouTube
  youtubeUrl?: string | null;
}

// Fonction pour extraire l'ID de la vidéo YouTube d'une URL
function getYouTubeVideoId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

// POST: Ajouter un nouvel item à un tournoi spécifique
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } } // 'id' ici est l'ID du tournoi
) {
  const tournamentId = params.id;
  const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY; // Récupérer la clé API depuis les variables d'environnement

  if (!tournamentId) {
    return NextResponse.json({ error: "L'ID du tournoi est manquant." }, { status: 400 });
  }

  try {
    const body = await request.json() as ItemCreateRequest;
    let itemName = body.name?.trim(); // Nom fourni par l'utilisateur
    const youtubeUrl = body.youtubeUrl?.trim();

    // Si une URL YouTube est fournie et aucun nom n'est donné par l'utilisateur, essayer de récupérer le titre de la vidéo
    if (youtubeUrl && !itemName) {
      if (!YOUTUBE_API_KEY) {
        console.warn("Clé API YouTube (YOUTUBE_API_KEY) non configurée. Impossible de récupérer le titre de la vidéo.");
        // Optionnel: retourner une erreur si la récupération du titre est cruciale
        // return NextResponse.json({ error: "Configuration serveur incomplète pour récupérer les titres YouTube." }, { status: 500 });
      } else {
        const videoId = getYouTubeVideoId(youtubeUrl);
        if (videoId) {
          try {
            const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${YOUTUBE_API_KEY}&part=snippet`);
            if (!response.ok) {
              const errorData = await response.json();
              console.error("Erreur API YouTube:", errorData);
              // Ne pas bloquer si l'API YouTube échoue, mais itemName restera vide si non fourni
            } else {
              const videoData = await response.json();
              if (videoData.items && videoData.items.length > 0 && videoData.items[0].snippet && videoData.items[0].snippet.title) {
                itemName = videoData.items[0].snippet.title;
              } else {
                console.warn(`Aucun titre trouvé pour la vidéo YouTube ID: ${videoId}`);
              }
            }
          } catch (fetchError) {
            console.error("Erreur lors de la récupération du titre YouTube:", fetchError);
          }
        } else {
          console.warn(`ID de vidéo YouTube invalide pour l'URL: ${youtubeUrl}`);
        }
      }
    }

    // Validation finale du nom de l'item (après tentative de récupération depuis YouTube)
    if (!itemName || itemName.length < 2) {
      return NextResponse.json(
        { error: "Le nom de l'item est requis (ou doit être récupérable depuis une URL YouTube valide) et doit contenir au moins 2 caractères." },
        { status: 400 }
      );
    }

    // Validation de l'URL YouTube si fournie
    if (youtubeUrl) {
        try {
            new URL(youtubeUrl); // Valide la structure de l'URL
            const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
            if (!youtubeRegex.test(youtubeUrl)) {
                return NextResponse.json(
                    { error: "L'URL YouTube n'est pas valide." },
                    { status: 400 }
                );
            }
        } catch (_) {
            return NextResponse.json(
                { error: "L'URL YouTube fournie n'est pas une URL valide." },
                { status: 400 }
            );
        }
    }

    // Vérifier si le tournoi existe
    const tournament = await prisma.tournament.findUnique({
      where: { id: tournamentId },
    });

    if (!tournament) {
      return NextResponse.json({ error: "Tournoi parent non trouvé." }, { status: 404 });
    }
    
    // Vérifier si un item avec le même nom (final) existe déjà dans ce tournoi
    const existingItem = await prisma.item.findFirst({
        where: {
            tournamentId: tournamentId,
            name: {
                equals: itemName, // Utiliser le nom final déterminé
                mode: 'insensitive'
            }
        }
    });

    if (existingItem) {
        return NextResponse.json(
            { error: `Un participant nommé "${itemName}" existe déjà dans ce tournoi.` },
            { status: 409 }
        );
    }

    // Création de l'item associé au tournoi
    const newItem = await prisma.item.create({
      data: {
        name: itemName, // Utiliser le nom final déterminé
        youtubeUrl: youtubeUrl || null,
        tournamentId: tournamentId,
      },
    });

    return NextResponse.json(newItem, { status: 201 });

  } catch (error: any) {
    console.error(`Erreur lors de l'ajout d'un item au tournoi ${tournamentId}:`, error);
     if (error instanceof SyntaxError) {
        return NextResponse.json(
            { error: "Corps de la requête JSON invalide." },
            { status: 400 }
        );
    }
    return NextResponse.json(
      { error: "Une erreur interne est survenue lors de l'ajout de l'item.", details: error.message },
      { status: 500 }
    );
  }
}

// GET: Récupérer tous les items d'un tournoi spécifique
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } } // 'id' ici est l'ID du tournoi
) {
  const tournamentId = params.id;

  if (!tournamentId) {
    return NextResponse.json({ error: "L'ID du tournoi est manquant." }, { status: 400 });
  }

  try {
    const tournamentExists = await prisma.tournament.count({
        where: { id: tournamentId }
    });

    if (tournamentExists === 0) {
        return NextResponse.json({ error: "Tournoi non trouvé." }, { status: 404 });
    }

    const items = await prisma.item.findMany({
      where: {
        tournamentId: tournamentId,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return NextResponse.json(items, { status: 200 });

  } catch (error: any) {
    console.error(`Erreur lors de la récupération des items du tournoi ${tournamentId}:`, error);
    return NextResponse.json(
      { error: "Une erreur interne est survenue lors de la récupération des items.", details: error.message },
      { status: 500 }
    );
  }
}
