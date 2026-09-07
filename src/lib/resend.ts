import { Resend } from 'resend';

let _resend: Resend | null = null;

export function getResend(): Resend {
  if (_resend) return _resend;
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error('RESEND_API_KEY environment variable is not configured');
  }
  _resend = new Resend(apiKey);
  return _resend;
}

export const resend = {
  get emails() {
    return getResend().emails;
  },
};

export const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? 'Aafreen Couture <orders@aafreen-couture.com>';
