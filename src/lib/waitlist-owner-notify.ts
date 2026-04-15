/**
 * Sends you an email when someone joins the waitlist (browser → FormSubmit).
 * First time: FormSubmit emails you a one-time activation link — click it to enable.
 *
 * Override recipient: VITE_WAITLIST_NOTIFY_EMAIL
 */
const DEFAULT_OWNER_EMAIL = 'sherazkarim12@gmail.com';

export async function notifyWaitlistOwner(signupEmail: string): Promise<void> {
  const recipient =
    (import.meta.env.VITE_WAITLIST_NOTIFY_EMAIL as string | undefined)?.trim() || DEFAULT_OWNER_EMAIL;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipient)) return;

  const body = {
    _subject: 'Belon — new waitlist signup',
    _template: 'table',
    _replyto: signupEmail,
    signup_email: signupEmail,
    signed_up_at: new Date().toISOString(),
  };

  try {
    await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(recipient)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body),
    });
  } catch {
    /* non-blocking; signup already succeeded */
  }
}
