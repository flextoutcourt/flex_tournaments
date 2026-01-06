// services/emailService.ts
import nodemailer from 'nodemailer';

// Configure your email service here
// Using Gmail, Sendgrid, or another provider
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(
  email: string,
  resetToken: string,
  userName?: string
): Promise<boolean> {
  try {
    // Build reset URL - adjust the URL to match your app domain
    const resetUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/auth/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: process.env.SMTP_FROM || 'noreply@flextournaments.com',
      to: email,
      subject: 'Réinitialisation de votre mot de passe - Flex Tournaments',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Réinitialisation de votre mot de passe</h2>
          
          <p>Bonjour${userName ? ` ${userName}` : ''},</p>
          
          <p>Vous avez demandé la réinitialisation de votre mot de passe pour votre compte Flex Tournaments.</p>
          
          <p style="margin: 30px 0;">
            <a href="${resetUrl}" style="display: inline-block; background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
              Réinitialiser mon mot de passe
            </a>
          </p>
          
          <p style="color: #666; font-size: 14px;">
            Ce lien expirera dans 1 heure. Si vous n'avez pas demandé cette réinitialisation, veuillez ignorer cet email.
          </p>
          
          <p style="color: #666; font-size: 14px;">
            Ou copiez ce lien dans votre navigateur:<br/>
            ${resetUrl}
          </p>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          
          <p style="color: #999; font-size: 12px;">
            Flex Tournaments - Plateforme de tournois en direct
          </p>
        </div>
      `,
      text: `
Réinitialisation de votre mot de passe

Bonjour${userName ? ` ${userName}` : ''},

Vous avez demandé la réinitialisation de votre mot de passe pour votre compte Flex Tournaments.

Cliquez sur le lien ci-dessous pour réinitialiser votre mot de passe:
${resetUrl}

Ce lien expirera dans 1 heure. Si vous n'avez pas demandé cette réinitialisation, veuillez ignorer cet email.

Flex Tournaments
      `,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email de réinitialisation:', error);
    return false;
  }
}

/**
 * Send welcome email for new accounts
 */
export async function sendWelcomeEmail(
  email: string,
  userName?: string
): Promise<boolean> {
  try {
    const mailOptions = {
      from: process.env.SMTP_FROM || 'noreply@flextournaments.com',
      to: email,
      subject: 'Bienvenue sur Flex Tournaments',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Bienvenue sur Flex Tournaments!</h2>
          
          <p>Bonjour${userName ? ` ${userName}` : ''},</p>
          
          <p>Votre compte a été créé avec succès. Vous pouvez maintenant vous connecter et commencer à créer vos tournois.</p>
          
          <p style="margin: 30px 0;">
            <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/tournaments" style="display: inline-block; background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
              Accéder à vos tournois
            </a>
          </p>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          
          <p style="color: #999; font-size: 12px;">
            Flex Tournaments - Plateforme de tournois en direct
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email de bienvenue:', error);
    return false;
  }
}
