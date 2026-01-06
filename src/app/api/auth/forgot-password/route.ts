// app/api/auth/forgot-password/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendPasswordResetEmail } from '@/services/emailService';
import { logActivity, getIpFromRequest, getUserAgentFromRequest } from '@/services/logService';
import crypto from 'crypto';

/**
 * POST /api/auth/forgot-password
 * Request a password reset token via email
 */
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      // For security, don't reveal if email exists
      // Still return success to prevent email enumeration
      return NextResponse.json(
        { success: true, message: 'Si un compte existe avec cet email, un lien de réinitialisation sera envoyé.' },
        { status: 200 }
      );
    }

    // Delete any existing reset tokens for this user
    await prisma.passwordResetToken.deleteMany({
      where: { userId: user.id },
    });

    // Generate a secure token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

    // Create password reset token
    await prisma.passwordResetToken.create({
      data: {
        token,
        email: user.email,
        userId: user.id,
        expiresAt,
      },
    });

    // Send reset email
    const emailSent = await sendPasswordResetEmail(user.email, token, user.name || undefined);

    if (!emailSent) {
      console.warn(`Failed to send password reset email to ${user.email}`);
      // Don't fail the request, but log it
    }

    // Log the activity
    await logActivity({
      userId: user.id,
      action: 'password_reset_requested',
      description: `Demande de réinitialisation de mot de passe pour ${user.email}`,
      entityType: 'user',
      entityId: user.id,
      ipAddress: getIpFromRequest(request),
      userAgent: getUserAgentFromRequest(request),
    });

    return NextResponse.json(
      { success: true, message: 'Si un compte existe avec cet email, un lien de réinitialisation sera envoyé.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Password reset request error:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue. Veuillez réessayer.' },
      { status: 500 }
    );
  }
}
