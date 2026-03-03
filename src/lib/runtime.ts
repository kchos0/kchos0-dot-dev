/**
 * Returns the runtime environment variables.
 * On Cloudflare Pages, secrets are in locals.runtime.env.
 * On local dev (astro dev / Node.js), falls back to import.meta.env from .env file.
 */
export function getRuntimeEnv(locals: unknown): Record<string, string | undefined> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const runtimeEnv = (locals as any)?.runtime?.env as
    | Record<string, string | undefined>
    | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return runtimeEnv ?? ((import.meta as any).env as Record<string, string | undefined>);
}
