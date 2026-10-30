export const LOCALE_COOKIE = "NEXT_LOCALE";

export const defaultLocale = "vi";
export type Locale = string;
export type TranslationLocale = string;

export function isLocale(value: string): value is Locale {
  return typeof value === "string" && value.trim().length > 0;
}

export function normalizeLocaleCode(value?: string | null): Locale {
  if (!value) return defaultLocale;
  const normalized = value.trim().toLowerCase().split("-")[0];
  return normalized || defaultLocale;
}

export function isTranslationLocale(value: string): value is TranslationLocale {
  const normalized = normalizeLocaleCode(value);
  return normalized !== defaultLocale;
}
