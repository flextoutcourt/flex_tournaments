import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ tournamentId: string }> }
) {
  try {
    const { tournamentId } = await params;

    // Get total votes for this tournament
    const totalVotes = await prisma.vote.count({
      where: { tournamentId },
    });

    // Get vote breakdown by item
    const votesByItem = await prisma.vote.groupBy({
      by: ['itemId'],
      where: { tournamentId },
      _count: {
        id: true,
      },
    });

    // Get item details
    const items = await prisma.item.findMany({
      where: { tournamentId },
    });

    const itemVotes = votesByItem.map(vote => {
      const item = items.find(i => i.id === vote.itemId);
      return {
        itemId: vote.itemId,
        itemName: item?.name || 'Unknown',
        votes: vote._count.id,
      };
    });

    return NextResponse.json({
      tournamentId,
      totalVotes,
      itemVotes: itemVotes.sort((a, b) => b.votes - a.votes),
    });
  } catch (error) {
    console.error('Error fetching tournament votes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch votes' },
      { status: 500 }
    );
  }
}
