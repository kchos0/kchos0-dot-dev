/**
 * Returns the admin password from the runtime environment.
 */
export function getAdminPassword(env: Record<string, string | undefined>): string | undefined {
  return env.ADMIN_PASSWORD;
}

/**
 * Creates a SHA-256 session token from the admin password.
 * Stores a hash in the cookie rather than the raw password.
 */
export async function createSessionToken(password: string): Promise<string> {
  const data = new TextEncoder().encode(`admin-auth:${password}`);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Verifies that the cookie value matches the expected session token.
 */
export async function verifyAdminCookie(
  cookieValue: string | undefined,
  password: string
): Promise<boolean> {
  if (!cookieValue) return false;
  const expected = await createSessionToken(password);
  return cookieValue === expected;
}
