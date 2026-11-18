/**
 * Single source of truth for "is this person an admin?".
 *
 * Admin = the stored role is "admin", OR the account uses one of the owner e-mail addresses AND that
 * address is verified. The verification condition matters: e-mail/password sign-up does not verify
 * ownership of an address, so without it anyone could register an owner address that has no account
 * yet and instantly become admin. Google sign-in marks the address verified, so the owner can still
 * use it.
 */
const OWNER_EMAILS = ['vardanaggarwal13@gmail.com', 'support@aafreencouture.com'];

function ownerEmails(): string[] {
  const configured = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  return configured ? [...OWNER_EMAILS, configured] : OWNER_EMAILS;
}

interface AccessSubject {
  role?: unknown;
  email?: string | null;
  emailVerified?: boolean | null;
}

export function isAdminUser(user: AccessSubject | null | undefined): boolean {
  if (!user) return false;
  if (user.role === 'admin') return true;
  const email = user.email?.trim().toLowerCase();
  return Boolean(email && user.emailVerified === true && ownerEmails().includes(email));
}
