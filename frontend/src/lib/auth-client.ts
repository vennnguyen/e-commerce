import { createAuthClient } from 'better-auth/client';

function serverBaseUrl(): string {
  return (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000').replace(
    /\/+$/,
    '',
  );
}

let browserClient: ReturnType<typeof createAuthClient> | null = null;
let browserOrigin: string | null = null;

export function getAuthClient() {
  if (typeof window !== 'undefined') {
    const origin = window.location.origin;
    if (!browserClient || browserOrigin !== origin) {
      browserClient = createAuthClient({
        baseURL: origin,
        basePath: '/api/auth',
      });
      browserOrigin = origin;
    }
    return browserClient;
  }
  return createAuthClient({
    baseURL: serverBaseUrl(),
    basePath: '/api/auth',
  });
}
