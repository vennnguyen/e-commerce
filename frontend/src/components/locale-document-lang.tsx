"use client";

import { useEffect } from "react";
import { useLocale } from "next-intl";

/** Đồng bộ thuộc tính lang trên <html> với locale hiện tại (tránh async ở root layout). */
export function LocaleDocumentLang() {
  const locale = useLocale();

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return null;
}
