// app/api/tournaments/[id]/items/[itemId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

// Petit utilitaire à usage interne, simple et minimal
function getParams(pathname: string) {
  const match = pathname.match(/^\/api\/tournaments\/([^/]+)\/items\/([^/]+)$/);
  if (!match) return null;
  return { id: match[1], itemId: match[2] };
}

export async function DELETE(request: NextRequest) {
  // Check authentication - user must be logged in to delete items
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json(
      { error: "Vous devez être connecté pour supprimer des participants." },
      { status: 401 }
    );
  }

  const params = getParams(request.nextUrl.pathname);
  if (!params) {
    return NextResponse.json({ error: 'URL invalide.' }, { status: 400 });
  }

  const { id: tournamentId, itemId } = params;

  try {
    const tournament = await prisma.tournament.findUnique({ where: { id: tournamentId } });
    if (!tournament) {
      return NextResponse.json({ error: 'Tournoi non trouvé.' }, { status: 404 });
    }

    const deletedItem = await prisma.item.delete({ where: { id: itemId } });
    return NextResponse.json({ message: 'Item supprimé.', deletedItem }, { status: 200 });

  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Item non trouvé.' }, { status: 404 });
    }

    return NextResponse.json({ error: 'Erreur serveur.', details: error.message }, { status: 500 });
  }
}
