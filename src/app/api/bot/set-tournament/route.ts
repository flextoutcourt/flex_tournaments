import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { tournamentId } = await request.json();

    if (!tournamentId) {
      return NextResponse.json(
        { error: 'Tournament ID required' },
        { status: 400 }
      );
    }

    const tournament = await prisma.tournament.findUnique({
      where: { id: tournamentId },
      include: { Items: true },
    });

    if (!tournament) {
      return NextResponse.json(
        { error: 'Tournament not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      tournament: {
        id: tournament.id,
        title: tournament.title,
        items: tournament.Items.map(item => ({
          id: item.id,
          name: item.name,
        })),
      },
    });
  } catch (error) {
    console.error('Error setting tournament:', error);
    return NextResponse.json(
      { error: 'Failed to set tournament' },
      { status: 500 }
    );
  }
}
