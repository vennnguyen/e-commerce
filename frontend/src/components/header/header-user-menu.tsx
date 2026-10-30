"use client"

import Link from "next/link"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Loader2 } from "lucide-react"
import type { User } from "@/types/api.types"

interface UserMenuProps {
  user: User | null
  loading: boolean
  isSigningOut?: boolean
  onSignOut: () => void
  signInHref: string
  shopCatalogHref: string
}

export function UserMenu({ user, loading, isSigningOut = false, onSignOut, signInHref, shopCatalogHref }: UserMenuProps) {
  const t = useTranslations("header")

  if (loading) {
    return <div className="w-24 h-10 rounded-full bg-secondary/50 animate-pulse" />
  }

  if (!user) {
    return (
      <Button
        size="sm"
        className="h-10 px-5 rounded-full bg-gradient-to-r from-primary to-accent hover:from-primary/95 hover:to-accent/95 text-white font-bold shadow-md shadow-primary/10 hover:shadow-lg hover:shadow-primary/20 hover:scale-[1.03] active:scale-[0.97] transition-all duration-150 ease-out ml-1 cursor-pointer"
        asChild
      >
        <a href={signInHref}>{t("signIn")}</a>
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 pl-2 pr-3.5 h-10 rounded-full border border-border hover:border-primary/50 bg-secondary/30 hover:bg-secondary/60 shadow-sm transition-all duration-150 ease-out outline-none cursor-pointer">
          <Avatar className="h-6.5 w-6.5 ring-2 ring-primary/30 transition-all duration-150 ease-out">
            {user.image ? (
              <AvatarImage src={user.image} alt={user.name} />
            ) : (
              <AvatarFallback className="text-[10px] font-bold bg-primary text-white">
                {user.name?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            )}
          </Avatar>
          <span className="text-xs font-bold text-foreground max-w-[80px] truncate">
            {user.name?.split(" ").pop()}
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 rounded-2xl border border-border bg-background/95 backdrop-blur-md shadow-xl p-1.5 animate-in fade-in duration-150"
      >
        <div className="px-3 py-2.5">
          <p className="text-sm font-bold text-foreground truncate">{user.name}</p>
          <p className="text-xs text-muted-foreground truncate mt-0.5">{user.email}</p>
        </div>
        <DropdownMenuSeparator className="bg-border/60" />
        <DropdownMenuItem
          asChild
          className="rounded-xl focus:bg-primary/5 focus:text-primary transition-all duration-150 ease-out cursor-pointer"
        >
          <Link href="/product/account" className="w-full flex items-center justify-between font-semibold">
            <span>{t("account")}</span>
            <span className="w-1.5 h-1.5 bg-primary/60 rounded-full" />
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          asChild
          className="rounded-xl focus:bg-primary/5 focus:text-primary transition-all duration-150 ease-out cursor-pointer"
        >
          <a href={shopCatalogHref} className="w-full flex items-center justify-between font-semibold">
            <span>{t("products")}</span>
          </a>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-border/60" />
        <DropdownMenuItem
          onClick={(e) => {
            e.preventDefault();
            if (!isSigningOut) onSignOut();
          }}
          disabled={isSigningOut}
          className="rounded-xl text-destructive focus:bg-destructive/10 focus:text-destructive transition-all duration-150 ease-out font-bold cursor-pointer"
        >
          {isSigningOut ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t("signingOut")}
            </>
          ) : (
            t("signOut")
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
