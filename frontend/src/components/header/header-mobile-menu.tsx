"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { useTranslations } from "next-intl"
import { Search, X, Heart, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LanguageSwitcher } from "@/components/ui/language-switcher"
import type { User } from "@/types/api.type"

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
  user: User | null
  loading: boolean
  isSigningOut?: boolean
  onSignOut: () => void
  shopCatalogHref: string
  signInHref: string
  shopUrl: string
  onSearch?: (searchTerm: string) => void
  searchQueryFromUrl?: string
}

export function MobileMenu({
  isOpen,
  onClose,
  user,
  loading,
  isSigningOut = false,
  onSignOut,
  shopCatalogHref,
  signInHref,
  shopUrl,
  onSearch,
  searchQueryFromUrl,
}: MobileMenuProps) {
  const t = useTranslations("header")
  const pathname = usePathname()
  const [searchValue, setSearchValue] = useState(searchQueryFromUrl ?? "")
  const [prevQuery, setPrevQuery] = useState(searchQueryFromUrl)
  if (prevQuery !== searchQueryFromUrl) {
    setPrevQuery(searchQueryFromUrl)
    setSearchValue(searchQueryFromUrl ?? "")
  }
  const router = useRouter()

  const isHomeActive = pathname === "/" || pathname === "/vi" || pathname === "/en" || pathname === "/ja" || pathname === "/ko"
  const isProductsActive = pathname.includes("/product/catalog") || (pathname.includes("/product/") && !pathname.includes("/product/shopcart") && !pathname.includes("/product/account") && !pathname.includes("/product/order-status"))
  const landingPageUrl = process.env.NEXT_PUBLIC_LANDING_PAGE_URL

  if (!isOpen) return null

  const handleSearch = () => {
    const q = searchValue.trim()
    if (onSearch) {
      onSearch(q)
    } else {
      router.push(`${shopUrl}/product/catalog${q ? `?q=${encodeURIComponent(q)}` : ""}`)
    }
    onClose()
  }

  return (
    <div className="lg:hidden border-t border-border py-5 bg-background/98 backdrop-blur-lg animate-in slide-in-from-top-4 duration-300 rounded-b-2xl shadow-xl px-1">
      <nav className="flex flex-col gap-1 mb-5">
        <a href={landingPageUrl || "/"} onClick={onClose} className={`header-mobile-nav-link ${isHomeActive ? "header-mobile-nav-link-active" : ""}`}>
          {t("home")}
        </a>
        <a href={shopCatalogHref} onClick={onClose} className={`header-mobile-nav-link ${isProductsActive ? "header-mobile-nav-link-active" : ""}`}>
          {t("products")}
        </a>
        <Link href="#" className="header-mobile-nav-link">{t("support")}</Link>
        <Link href="#" className="header-mobile-nav-link">{t("contact")}</Link>
      </nav>

      <div className="border-t border-border pt-5 flex flex-col gap-4 px-2">
        <div className="flex items-center gap-2.5 bg-secondary/30 border border-border rounded-full px-4 h-11 focus-within:border-primary focus-within:bg-background transition-all duration-150 ease-out">
          <Search className="w-[18px] h-[18px] text-foreground shrink-0" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleSearch() }}
            placeholder="Tìm kiếm sản phẩm..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none font-semibold cursor-text"
          />
          {searchValue && (
            <button
              type="button"
              onClick={() => setSearchValue("")}
              className="text-foreground hover:text-primary transition-colors p-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <LanguageSwitcher className="header-icon-btn !text-foreground hover:!bg-primary/5 hover:!text-primary [&>button]:h-full [&>button]:w-full [&>button]:cursor-pointer [&>button]:border-0 [&>button]:shadow-none" />
          <button type="button" className="header-icon-btn" aria-label="Wishlist">
            <Heart className="w-[18px] h-[18px]" />
          </button>

          {loading ? (
            <div className="flex-1 h-10 rounded-full bg-secondary/50 animate-pulse" />
          ) : user ? (
            <div className="flex flex-1 gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 h-10 rounded-full font-bold border-border cursor-pointer"
                onClick={onClose}
                asChild
              >
                <Link href="/product/account">{t("account")}</Link>
              </Button>
              <Button
                size="sm"
                variant="destructive"
                className="flex-1 h-10 rounded-full font-bold cursor-pointer"
                onClick={onSignOut}
                disabled={isSigningOut}
              >
                {isSigningOut ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("signingOut")}
                  </>
                ) : (
                  t("signOut")
                )}
              </Button>
            </div>
          ) : (
            <Button
              size="sm"
              className="flex-1 h-10 rounded-full bg-gradient-to-r from-primary to-accent text-white font-bold shadow-md cursor-pointer"
              onClick={onClose}
              asChild
            >
              <a href={signInHref}>{t("signIn")}</a>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
