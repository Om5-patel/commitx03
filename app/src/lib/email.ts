import nodemailer from "nodemailer";

let transporter: nodemailer.Transporter | null = null;

export function getEmailTransporter() {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    console.warn("SMTP credentials not fully provided. Email sending will be logged to console.");
    return null;
  }

  transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });

  return transporter;
}

export interface EmailPayload {
  to: string;
  subject: string;
  title: string;
  message: string;
  ctaText?: string;
  ctaUrl?: string;
}

export async function sendCommitXEmail(payload: EmailPayload) {
  const { to, subject, title, message, ctaText, ctaUrl } = payload;
  const fromEmail = process.env.SMTP_FROM || "noreply@commitx.in";

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Nunito Sans', -apple-system, sans-serif; background-color: #faf6f0; color: #2e3230; margin: 0; padding: 24px; }
          .container { max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 20px; padding: 32px; border: 1px solid #e4e0d8; }
          .logo { font-size: 24px; font-weight: bold; color: #4a7c59; font-family: 'Literata', Georgia, serif; margin-bottom: 24px; }
          .title { font-size: 20px; font-weight: bold; color: #2e3230; margin-bottom: 12px; }
          .message { font-size: 15px; line-height: 1.6; color: #4a4e4a; margin-bottom: 28px; }
          .button { display: inline-block; background-color: #4a7c59; color: #ffffff !important; font-weight: bold; text-decoration: none; padding: 12px 24px; border-radius: 12px; font-size: 14px; }
          .footer { margin-top: 32px; font-size: 12px; color: #74796e; text-align: center; border-top: 1px solid #f0ece4; padding-top: 16px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">CommitX</div>
          <div class="title">${title}</div>
          <div class="message">${message}</div>
          ${ctaText && ctaUrl ? `<a href="${ctaUrl}" class="button">${ctaText}</a>` : ""}
          <div class="footer">
            © ${new Date().getFullYear()} CommitX. Rooted in Accountability.<br/>
            Real stakes, real results.
          </div>
        </div>
      </body>
    </html>
  `;

  const mailer = getEmailTransporter();
  if (mailer) {
    try {
      await mailer.sendMail({
        from: `CommitX <${fromEmail}>`,
        to,
        subject,
        html,
      });
      return { success: true };
    } catch (err: any) {
      console.error("Failed to send email via SMTP:", err);
      return { success: false, error: err.message };
    }
  } else {
    console.log(`[Mock Email Sent] To: ${to} | Subject: ${subject} | Message: ${message}`);
    return { success: true, is_mock: true };
  }
}
