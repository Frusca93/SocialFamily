export async function sendMail(to: string, subject: string, html: string) {
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const FROM = process.env.MAIL_FROM || 'noreply@example.com';
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
  // Fallback: log only
  console.log(`[MAIL:FALLBACK] to=${to} subject=${subject} html=${html}`);
}
