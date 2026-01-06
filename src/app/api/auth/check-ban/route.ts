import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/services/authService';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const user = await AuthService.findUserByEmail(email);

    if (!user) {
      return NextResponse.json(
        { banned: false },
        { status: 200 }
      );
    }

    if (user.banned) {
      return NextResponse.json(
        { 
          banned: true,
          reason: user.bannedReason || 'Raison non spécifiée'
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { banned: false },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error checking ban status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
