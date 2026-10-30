"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, X } from "lucide-react"

interface SearchBarProps {
  shopUrl: string
  onSearch?: (searchTerm: string) => void
  searchQueryFromUrl?: string
}

export function SearchBar({ shopUrl, onSearch, searchQueryFromUrl }: SearchBarProps) {
  const [expanded, setExpanded] = useState(false)
  const [value, setValue] = useState(searchQueryFromUrl ?? "")
  const [prevQuery, setPrevQuery] = useState(searchQueryFromUrl)
  if (prevQuery !== searchQueryFromUrl) {
    setPrevQuery(searchQueryFromUrl)
    setValue(searchQueryFromUrl ?? "")
  }
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const close = () => {
    setExpanded(false)
    setValue("")
  }

  const handleSearch = (query: string) => {
    const q = query.trim()
    if (onSearch) {
      onSearch(q)
    } else {
      router.push(`${shopUrl}/product/catalog${q ? `?q=${encodeURIComponent(q)}` : ""}`)
    }
    close()
  }

  useEffect(() => {
    if (!expanded) return
    const timer = setTimeout(() => inputRef.current?.focus(), 50)
    return () => clearTimeout(timer)
  }, [expanded])

  useEffect(() => {
    if (!expanded) return
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close() }
    const onClickOutside = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) close()
    }
    window.addEventListener("keydown", onKey)
    document.addEventListener("mousedown", onClickOutside)
    return () => {
      window.removeEventListener("keydown", onKey)
      document.removeEventListener("mousedown", onClickOutside)
    }
  }, [expanded])

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        suppressHydrationWarning
        onClick={() => setExpanded(!expanded)}
        className={[
          "w-10 h-10 flex items-center justify-center rounded-full border shadow-sm transition-all duration-150 ease-out cursor-pointer",
          expanded
            ? "border-primary bg-primary/5 text-primary scale-105"
            : "border-border hover:border-primary/50 bg-secondary/30 hover:bg-primary/5 text-foreground hover:text-primary hover:scale-105 active:scale-95",
        ].join(" ")}
        aria-label="Toggle search"
      >
        <Search className="w-[18px] h-[18px]" />
      </button>

      {expanded && (
        <div className="absolute top-13 right-0 w-80 bg-background/98 backdrop-blur-lg border border-border rounded-2xl shadow-xl p-3.5 animate-in fade-in slide-in-from-top-2 duration-150 z-50">
          <div className="flex items-center gap-2 bg-secondary/40 border border-border focus-within:border-primary focus-within:bg-background rounded-full px-3.5 h-10 transition-all duration-150">
            <Search className="w-4 h-4 text-primary shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleSearch(value) }}
              placeholder="Tìm kiếm sản phẩm..."
              className="flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground outline-none font-semibold cursor-text"
            />
            {value && (
              <button
                type="button"
                onClick={() => setValue("")}
                className="text-foreground hover:text-primary transition-colors p-1 hover:bg-secondary rounded-full cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <div className="flex items-center justify-between mt-2.5 px-1.5 text-[10px] font-bold text-muted-foreground select-none">
            <span>ẤN ENTER ĐỂ TÌM KIẾM</span>
            <span className="text-primary/70">Mtiktech Shop</span>
          </div>
        </div>
      )}
    </div>
  )
}
