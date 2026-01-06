import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { itemId, tournamentId } = await request.json();

    if (!itemId || !tournamentId) {
      return NextResponse.json(
        { error: 'itemId and tournamentId required' },
        { status: 400 }
      );
    }

    // Record the vote
    const vote = await prisma.vote.create({
      data: {
        itemId,
        tournamentId,
      },
    });

    return NextResponse.json({
      success: true,
      voteId: vote.id,
    });
  } catch (error) {
    console.error('Error recording vote:', error);
    return NextResponse.json(
      { error: 'Failed to record vote' },
      { status: 500 }
    );
  }
}
