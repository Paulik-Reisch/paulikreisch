import 'server-only';

/**
 * E-Mail-Allowlist fuer den Admin-Bereich. Die gleichen Adressen stehen auch in
 * den Firestore-Security-Rules. Optional per ADMIN_EMAILS (kommagetrennt)
 * ueberschreibbar.
 */
const DEFAULT_ADMIN_EMAILS = [
  'maximilian.reisch@t-online.de',
  'philipp.l.paulik@gmail.com',
];

export function getAdminEmails(): string[] {
  const fromEnv = process.env.ADMIN_EMAILS;
  const list = fromEnv && fromEnv.trim().length > 0 ? fromEnv.split(',') : DEFAULT_ADMIN_EMAILS;
  return list.map((e) => e.trim().toLowerCase()).filter(Boolean);
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return getAdminEmails().includes(email.trim().toLowerCase());
}
