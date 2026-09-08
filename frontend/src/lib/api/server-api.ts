import { getPublicApiV1Base } from "@/lib/api/api-url";
import { getServerCookieHeader, getServerLocale } from "@/lib/locale/server-locale";
import type { Locale } from "@/i18n/config";

type ServerGetOptions = {
  locale?: Locale;
  params?: Record<string, string | number | boolean | undefined | null>;
  cache?: RequestCache;
  next?: NextFetchRequestConfig;
  skipAuth?: boolean;
};

type ServerMutateOptions = {
  locale?: Locale;
};

async function buildHeaders(skipAuth?: boolean): Promise<HeadersInit> {
  const headers: HeadersInit = { Accept: "application/json", "Content-Type": "application/json" };
  if (!skipAuth) {
    const cookieHeader = await getServerCookieHeader();
    if (cookieHeader) headers.Cookie = cookieHeader;
  }
  return headers;
}

function buildUrl(path: string, locale: Locale, params?: Record<string, string | number | boolean | undefined | null>): URL {
  const base = getPublicApiV1Base();
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(`${base}${normalizedPath}`);
  url.searchParams.set("locale", locale);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, String(value));
      }
    }
  }
  return url;
}

async function assertOk(res: Response, path: string): Promise<void> {
  if (!res.ok) {
    let message = `API ${res.status}: ${path}`;
    try {
      const body = await res.json();
      if (typeof body?.message === "string") message = body.message;
    } catch { /* ignore parse error */ }
    throw new Error(message);
  }
}

export async function serverApiGet<T>(
  path: string,
  options: ServerGetOptions = {},
): Promise<T> {
  const locale = options.locale ?? (await getServerLocale());
  const url = buildUrl(path, locale, options.params);
  const headers = await buildHeaders(options.skipAuth);

  const res = await fetch(url.toString(), {
    method: "GET",
    headers,
    credentials: "include",
    cache: options.cache ?? "no-store",
    next: options.next,
  });

  await assertOk(res, path);
  return res.json() as Promise<T>;
}

export async function serverApiPost<T>(
  path: string,
  body: unknown,
  options: ServerMutateOptions = {},
): Promise<T> {
  const locale = options.locale ?? (await getServerLocale());
  const url = buildUrl(path, locale);
  const headers = await buildHeaders();

  const res = await fetch(url.toString(), {
    method: "POST",
    headers,
    credentials: "include",
    body: JSON.stringify(body),
  });

  await assertOk(res, path);
  return res.json() as Promise<T>;
}

export async function serverApiPut<T>(
  path: string,
  body: unknown,
  options: ServerMutateOptions = {},
): Promise<T> {
  const locale = options.locale ?? (await getServerLocale());
  const url = buildUrl(path, locale);
  const headers = await buildHeaders();

  const res = await fetch(url.toString(), {
    method: "PUT",
    headers,
    credentials: "include",
    body: JSON.stringify(body),
  });

  await assertOk(res, path);
  return res.json() as Promise<T>;
}

export async function serverApiDelete<T = void>(
  path: string,
  options: ServerMutateOptions = {},
): Promise<T> {
  const locale = options.locale ?? (await getServerLocale());
  const url = buildUrl(path, locale);
  const headers = await buildHeaders();

  const res = await fetch(url.toString(), {
    method: "DELETE",
    headers,
    credentials: "include",
  });

  await assertOk(res, path);
  if (res.status === 204 || res.headers.get("content-length") === "0") {
    return undefined as T;
  }
  return res.json() as Promise<T>;
}
