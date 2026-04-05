import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendBusinessResetPasswordEmail(
  email: string,
  resetUrl: string,
): Promise<void> {
  try {
    const info = await transporter.sendMail({
      from: `"Fundee" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: email,
      subject: "Réinitialisation de votre mot de passe",
      html: `
        <div style="font-family: Poppins, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 24px; background: #f9fafb;">
          <div style="background: white; border-radius: 16px; padding: 40px; box-shadow: 0 4px 24px rgba(0,0,0,0.06);">
            <div style="text-align: center; margin-bottom: 32px;">
              <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: #ff6b00; margin-right: 8px;"></span>
              <span style="font-weight: 700; font-size: 18px; color: #0f172a;">Fundee</span>
            </div>

            <h2 style="font-size: 22px; font-weight: 700; color: #0f172a; margin-bottom: 12px; text-align: center;">
              Réinitialisation du mot de passe
            </h2>

            <p style="color: #6b7280; font-size: 14px; line-height: 1.7; text-align: center; margin-bottom: 32px;">
              Vous avez demandé à réinitialiser votre mot de passe. Cliquez sur le bouton ci-dessous pour en créer un nouveau. Ce lien expire dans <strong>1 heure</strong>.
            </p>

            <div style="text-align: center; margin-bottom: 32px;">
              <a href="${resetUrl}"
                 style="display: inline-block; padding: 14px 32px; background: #ff6b00; color: white; border-radius: 10px; text-decoration: none; font-weight: 600; font-size: 15px;">
                Réinitialiser mon mot de passe
              </a>
            </div>

            <p style="color: #9ca3af; font-size: 12px; text-align: center; line-height: 1.6;">
              Si vous n'avez pas demandé cette réinitialisation, ignorez cet email. Votre mot de passe restera inchangé.
            </p>

            <hr style="border: none; border-top: 1px solid #f3f4f6; margin: 24px 0;" />

            <p style="color: #d1d5db; font-size: 11px; text-align: center;">
              © ${new Date().getFullYear()} Promodoro · Tous droits réservés
            </p>
          </div>
        </div>
      `,
    });
  } catch (err: any) {
    console.error("📧 Erreur sendMail →", {
      message: err.message,
      code: err.code,
      command: err.command,
      response: err.response,
    });
    throw err;
  }
}
