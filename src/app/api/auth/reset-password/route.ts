// app/api/auth/reset-password/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logActivity, getIpFromRequest, getUserAgentFromRequest } from '@/services/logService';
import bcrypt from 'bcryptjs';

/**
 * POST /api/auth/reset-password
 * Reset password with valid token
 */
export async function POST(request: NextRequest) {
  try {
    const { token, password, confirmPassword } = await request.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token and password are required' },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Les mots de passe ne correspondent pas' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Le mot de passe doit contenir au moins 8 caractères' },
        { status: 400 }
      );
    }

    // Find the reset token
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!resetToken) {
      return NextResponse.json(
        { error: 'Lien de réinitialisation invalide ou expiré' },
        { status: 400 }
      );
    }

    // Check if token has expired
    if (new Date() > resetToken.expiresAt) {
      // Delete expired token
      await prisma.passwordResetToken.delete({
        where: { id: resetToken.id },
      });

      return NextResponse.json(
        { error: 'Ce lien de réinitialisation a expiré. Veuillez en demander un nouveau.' },
        { status: 400 }
      );
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user's password
    const updatedUser = await prisma.user.update({
      where: { id: resetToken.userId },
      data: {
        password: hashedPassword,
      },
    });

    // Delete the used reset token
    await prisma.passwordResetToken.delete({
      where: { id: resetToken.id },
    });

    // Delete all other reset tokens for this user (invalidate all reset links)
    await prisma.passwordResetToken.deleteMany({
      where: { userId: resetToken.userId },
    });

    // Log the activity
    await logActivity({
      userId: resetToken.userId,
      action: 'password_reset_completed',
      description: `Mot de passe réinitialisé avec succès`,
      entityType: 'user',
      entityId: resetToken.userId,
      ipAddress: getIpFromRequest(request),
      userAgent: getUserAgentFromRequest(request),
    });

    return NextResponse.json(
      { success: true, message: 'Votre mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous connecter.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Password reset error:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la réinitialisation du mot de passe' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/auth/reset-password
 * Verify if a reset token is valid
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      );
    }

    // Find the reset token
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!resetToken) {
      return NextResponse.json(
        { valid: false, error: 'Lien de réinitialisation invalide' },
        { status: 400 }
      );
    }

    // Check if token has expired
    if (new Date() > resetToken.expiresAt) {
      return NextResponse.json(
        { valid: false, error: 'Ce lien de réinitialisation a expiré' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { valid: true, email: resetToken.email },
      { status: 200 }
    );
  } catch (error) {
    console.error('Token verification error:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue' },
      { status: 500 }
    );
  }
}
