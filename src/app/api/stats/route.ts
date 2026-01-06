import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const tournamentCount = await prisma.tournament.count();
    
    // Get total vote count
    const voteCount = await prisma.vote.count();
    
    return NextResponse.json({
      tournaments: tournamentCount,
      votes: voteCount.toLocaleString('fr-FR'),
      support: '24/7'
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
