import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";
import { defaultLocale, normalizeLocaleCode, type Locale } from "./config";

export { defaultLocale, type Locale, LOCALE_COOKIE } from "./config";

export default getRequestConfig(async () => {
  let localeCookie: string | undefined;
  try {
    const cookieStore = await cookies();
    localeCookie = cookieStore.get("NEXT_LOCALE")?.value;
  } catch {
    localeCookie = undefined;
  }
  const locale: Locale = normalizeLocaleCode(localeCookie);
  let messages: Record<string, unknown>;

  try {
    messages = (await import(`../../messages/${locale}.json`)).default;
  } catch {
    messages = (await import(`../../messages/${defaultLocale}.json`)).default;
  }

  return {
    locale,
    messages,
  };
});
