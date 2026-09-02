"use client";

import { useLocale } from "next-intl";
import { useTranslations } from "next-intl";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";
import type { Locale } from "@/i18n/request";

const LOCALE_COOKIE = "NEXT_LOCALE";
const COOKIE_MAX_AGE = 365 * 24 * 60 * 60; // 1 year

function setLocaleCookie(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
}

interface LanguageSwitcherProps {
  className?: string;
}

export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const locale = useLocale() as Locale;
  const t = useTranslations("common");

  const handleLocaleChange = (newLocale: Locale) => {
    if (newLocale === locale) return;
    setLocaleCookie(newLocale);
    window.location.reload();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={`h-12 w-12 shrink-0 ${className ?? "rounded-xl"}`}
          aria-label={t("language")}
        >
          <Languages className="w-5 h-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleLocaleChange("vi")}>
          {t("vi")} {locale === "vi" && "✓"}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleLocaleChange("en")}>
          {t("en")} {locale === "en" && "✓"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
