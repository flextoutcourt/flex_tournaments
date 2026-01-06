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
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #0f172a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0f172a;">
            <tr>
              <td align="center" style="padding: 40px 20px;">
                <table width="100%" maxwidth="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #1e293b; border: 1px solid #334155; border-radius: 16px; overflow: hidden;">
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #4f46e5 0%, #ec4899 100%); padding: 40px 30px; text-align: center;">
                      <div style="font-size: 48px; margin-bottom: 15px;">🔐</div>
                      <h1 style="color: #ffffff; font-size: 28px; margin: 0 0 8px 0; font-weight: 700;">Réinitialiser votre mot de passe</h1>
                      <p style="color: #e2e8f0; font-size: 14px; margin: 0;">Flex Tournaments</p>
                    </td>
                  </tr>

                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px 30px; color: #e2e8f0;">
                      <p style="font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">Bonjour${userName ? ` <strong>${userName}</strong>` : ''},</p>
                      <p style="font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">Vous avez demandé la réinitialisation de votre mot de passe. Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe en toute sécurité.</p>

                      <!-- CTA Button -->
                      <table cellpadding="0" cellspacing="0" style="margin: 30px auto;">
                        <tr>
                          <td style="background: linear-gradient(135deg, #4f46e5 0%, #ec4899 100%); border-radius: 8px;">
                            <a href="${resetUrl}" style="display: inline-block; padding: 16px 40px; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 16px;">Réinitialiser mon mot de passe</a>
                          </td>
                        </tr>
                      </table>

                      <!-- Security Note -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: rgba(34, 197, 94, 0.15); border-left: 4px solid #22c55e; margin: 25px 0;">
                        <tr>
                          <td style="padding: 15px 15px; color: #86efac; font-size: 14px;">
                            ⏱️ Ce lien expirera dans <strong>1 heure</strong> pour des raisons de sécurité.
                          </td>
                        </tr>
                      </table>

                      <p style="font-size: 14px; color: #94a3b8; line-height: 1.6; margin: 20px 0;">Si vous n'avez pas demandé cette réinitialisation, ignorez simplement cet email. Votre compte reste sécurisé.</p>

                      <p style="font-size: 13px; color: #94a3b8; line-height: 1.6; margin: 20px 0 10px 0;">Ou copiez ce lien dans votre navigateur si le bouton ne fonctionne pas:</p>
                      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: rgba(99, 102, 241, 0.1); border-radius: 6px;">
                        <tr>
                          <td style="padding: 12px 12px; color: #818cf8; font-size: 12px; word-break: break-all;">
                            ${resetUrl}
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Divider -->
                  <tr>
                    <td style="height: 1px; background-color: #334155;"></td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="padding: 30px; text-align: center; color: #64748b; font-size: 12px;">
                      © 2026 Flex Tournaments. Tous droits réservés.
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
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
