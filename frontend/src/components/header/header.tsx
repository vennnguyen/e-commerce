"use client";

import { useState, useCallback } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Heart, Menu, X } from "lucide-react";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { SearchBar } from "./header-search-bar";
import { UserMenu } from "./header-user-menu";
import { MobileMenu } from "./header-mobile-menu";
import { NavLink } from "./header-nav-link";
import { CartButton } from "./header-cart-button";
import { useCurrentUser, useSignOut } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-orders";
import {
  buildCatalogQueryString,
  parseCatalogSearchParamsFromEntries,
} from "@/lib/product/catalog-search-params";

export function Header() {
  const t = useTranslations("header");
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const shopUrl = "";
  const landingPageUrl = process.env.NEXT_PUBLIC_LANDING_PAGE_URL;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: user, isLoading: loading } = useCurrentUser();
  const { data: cart } = useCart();
  const { mutate: signOut, isPending: isSigningOut } = useSignOut({
    success: t("signedOut"),
  });

  const isCatalogPage = pathname.startsWith("/product/catalog");
  const searchQueryFromUrl = isCatalogPage ? (searchParams.get("q") ?? "") : undefined;
  const handleCatalogSearch = useCallback((searchTerm: string) => {
    const next = parseCatalogSearchParamsFromEntries(searchParams.entries());
    next.page = 1;
    next.query = searchTerm.trim() || undefined;
    const qs = buildCatalogQueryString(next);
    router.push(qs ? `/product/catalog?${qs}` : "/product/catalog");
  }, [searchParams, router]);
  const onSearch = isCatalogPage ? handleCatalogSearch : undefined;

  const signInHref = "/auth/signin";
  const shopCatalogHref = "/product/catalog";
  const isHomeActive = pathname === "/";
  const isCartActive = pathname.includes("/product/shopcart");
  const isProductsActive =
    pathname.includes("/product/catalog") ||
    (pathname.includes("/product/") && !isCartActive && !pathname.includes("/account") && !pathname.includes("/order-status"));

  const cartItemCount = (cart?.orderItems || cart?.items || []).length;
  const cartHref = `${shopUrl}/product/shopcart`;

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 shadow-sm backdrop-blur-md transition-all duration-150 ease-out">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex h-16 w-full items-center justify-between gap-4 lg:h-[72px]">

          <div className="flex shrink-0 items-center justify-start lg:flex-1">
            <a href={landingPageUrl || "/"} className="flex shrink-0 cursor-pointer items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground">
                <span className="text-sm font-bold text-background">M</span>
              </div>
              <span className="text-base font-bold tracking-tight text-foreground">Mtiktech</span>
            </a>
          </div>

          <nav className="hidden items-center justify-center gap-8 lg:flex">
            <NavLink href={landingPageUrl || "/"} active={isHomeActive} isAnchor>{t("home")}</NavLink>
            <NavLink href={shopCatalogHref} active={isProductsActive} isAnchor>{t("products")}</NavLink>
            <NavLink href="#" active={false}>{t("support")}</NavLink>
            <NavLink href="#" active={false}>{t("contact")}</NavLink>
          </nav>

          <div className="hidden items-center justify-end gap-2.5 lg:flex lg:flex-1">
            <SearchBar shopUrl={shopUrl} onSearch={onSearch} searchQueryFromUrl={searchQueryFromUrl} />
            <button type="button" className="header-icon-btn" aria-label="Wishlist">
              <Heart className="h-[18px] w-[18px] transition-transform duration-150 ease-out hover:scale-110" />
            </button>
            <CartButton href={cartHref} active={isCartActive} count={cartItemCount} />
            <div className="mx-1 h-5 w-px bg-border" />
            <LanguageSwitcher className="header-icon-btn !text-foreground hover:!bg-primary/5 hover:!text-primary [&>button]:h-full [&>button]:w-full [&>button]:cursor-pointer [&>button]:border-0 [&>button]:shadow-none" />
            <UserMenu user={user ?? null} loading={loading} isSigningOut={isSigningOut} onSignOut={() => signOut()} signInHref={signInHref} shopCatalogHref={shopCatalogHref} />
          </div>

          <div className="ml-auto flex items-center gap-2 lg:hidden">
            <CartButton href={cartHref} active={isCartActive} count={cartItemCount} />
            <button type="button" className="header-icon-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <MobileMenu
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          user={user ?? null}
          loading={loading}
          isSigningOut={isSigningOut}
          onSignOut={() => signOut()}
          shopCatalogHref={shopCatalogHref}
          signInHref={signInHref}
          shopUrl={shopUrl}
          onSearch={onSearch}
          searchQueryFromUrl={searchQueryFromUrl}
        />
      </div>
    </header>
  );
}
