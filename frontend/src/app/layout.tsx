import type { Metadata } from "next";
import { Suspense } from "react";
import { Inter, Space_Grotesk } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
import QueryProvider from "@/provider/query-provider";
import { LocaleDocumentLang } from "@/components/locale-document-lang";
import { Toaster } from "sonner";
import "./globals.css";

import { Header } from "@/components/header/header";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin", "vietnamese"],
  variable: "--font-space-grotesk",
});

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("layout");
  return {
    title: t("title"),
    description: t("description"),
  };
}

async function RootLayoutIntl({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <LocaleDocumentLang />
      <QueryProvider>
        <Header/>
        {children}
        <Toaster position="bottom-right" richColors />
      </QueryProvider>
    </NextIntlClientProvider>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      suppressHydrationWarning
      className={`${inter.variable} ${spaceGrotesk.variable}`}
    >
      <body className="font-sans antialiased">
        <Suspense fallback={null}>
          <RootLayoutIntl>{children}</RootLayoutIntl>
        </Suspense>
      </body>
    </html>
  );
}
