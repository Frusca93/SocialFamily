export async function sendMail(to: string, subject: string, html: string) {
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const SMTP_HOST = process.env.SMTP_HOST;
  const SMTP_PORT = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
  const SMTP_USER = process.env.SMTP_USER;
  const SMTP_PASS = process.env.SMTP_PASS;
  const FROM = process.env.MAIL_FROM || SMTP_USER || 'noreply@example.com';

  // 1) Prefer SMTP if configured (es. Gmail)
  if (SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS) {
    try {
      const nodemailer = await import('nodemailer');
      const transporter = (nodemailer as any).createTransport({
        host: SMTP_HOST,
        port: SMTP_PORT,
        secure: SMTP_PORT === 465, // 465 = SSL, 587 = STARTTLS
        auth: { user: SMTP_USER, pass: SMTP_PASS },
      });
      await transporter.sendMail({ from: FROM, to, subject, html });
      return;
    } catch (e) {
      console.error('[MAIL] SMTP exception', e);
      // fallthrough to Resend
    }
  }

  // 2) Resend HTTP API (richiede dominio verificato o hosted)
  if (RESEND_API_KEY) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ from: FROM, to, subject, html })
      });
      if (!res.ok) {
        console.error('[MAIL] Resend failed', await res.text());
      }
      return;
    } catch (e) {
      console.error('[MAIL] Resend exception', e);
    }
  }

  // 3) Fallback: log only (utile in dev senza credenziali)
  console.log(`[MAIL:FALLBACK] to=${to} subject=${subject} html=${html}`);
}
